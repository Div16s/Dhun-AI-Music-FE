import { db } from "~/server/db";
import { inngest } from "./client";
import { env } from "~/env";

export const generateSong = inngest.createFunction(
  {
    id: "generate-song",
    concurrency: { limit: 1, key: "event.data.userId" },
    onFailure: async ({event, error}) => {
        await db.song.update({
            where: {
                id: event?.data?.event?.data?.songId,
            },
            data: {
                status: "failed",
            }
        })
    },
    triggers: { event: "generate-song-event" },
  },
  async ({ event, step }) => {
    const { songId } = event.data as {
      songId: string;
      userId: string;
    };

    const { userId, credits, endpoint, body } = await step.run(
      "check-credits",
      async () => {
        const song = await db.song.findUniqueOrThrow({
          where: {
            id: songId,
          },
          select: {
            user: {
              select: {
                id: true,
                credits: true,
              },
            },
            prompt: true,
            lyrics: true,
            instrumental: true,
            fullDescribedSong: true,
            describedLyrics: true,
            inferenceSteps: true,
            audiDuration: true,
            vocalLanguage: true,
          },
        });

        type RequestBody = {
          duration?: number;
          inference_steps?: number;
          instrumental?: boolean;
          vocal_language?: string;
          description?: string;
          prompt?: string;
          lyrics?: string;
          described_lyrics?: string;
        };
        let endpoint = "";
        let body: RequestBody = {};

        const commonParams = {
          inference_steps: song.inferenceSteps ?? undefined,
          duration: song.audiDuration ?? undefined,
          instrumental: song.instrumental ?? undefined,
          vocal_language: song.vocalLanguage ?? undefined,
        };

        // description of a song
        if (song.fullDescribedSong) {
          endpoint = env.GENERATE_FROM_DESCRIPTION;
          body = {
            description: song.fullDescribedSong,
            ...commonParams,
          };
        }
        // custom mode: Lyrics + Prompt
        else if (song.prompt && song.lyrics) {
          endpoint = env.GENERATE_FROM_LYRICS;
          body = {
            prompt: song.prompt,
            lyrics: song.lyrics,
            ...commonParams,
          };
        }

        // custom mode: Described Lyrics + Prompt
        else if (song.describedLyrics && song.prompt) {
          endpoint = env.GENERATE_FROM_DESCRIBED_LYRICS;
          body = {
            prompt: song.prompt,
            described_lyrics: song.describedLyrics,
            ...commonParams,
          };
        }

        return {
          userId: song.user.id,
          credits: song.user.credits,
          endpoint: endpoint,
          body: body,
        };
      },
    );

    if (credits > 0) {
      await step.run("set-status-processing", async () => {
        return await db.song.update({
          where: {
            id: songId,
          },
          data: {
            status: "processing",
          },
        });
      });

      const response = await step.fetch(endpoint, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          "Modal-Key": env.MODAL_KEY,
          "Modal-Secret": env.MODAL_SECRET,
        },
      });

      await step.run("update-song-results", async () => {
        const responseData = response.ok
          ? ((await response.json()) as {
              song_s3_key: string;
              cover_image_s3_key: string;
              categories: string[];
              title?: string;
              prompt?: string;
            })
          : null;

        await db.song.update({
          where: {
            id: songId,
          },
          data: {
            s3Key: responseData?.song_s3_key,
            thumbnailS3Key: responseData?.cover_image_s3_key,
            ...(responseData?.title?.trim()
              ? { title: responseData.title.trim() }
              : {}),
            ...(responseData?.prompt?.trim()
              ? { prompt: responseData.prompt.trim() }
              : {}),
            status: response.ok ? "processed" : "failed",
          },
        });

        const categories = Array.from(
          new Set(
            (responseData?.categories ?? [])
              .map((c) => c.trim().toLowerCase())
              .filter(
                (c) =>
                  c.length > 0 && c.length <= 30 && c.split(/\s+/).length <= 3,
              ),
          ),
        ).slice(0, 5);

        if (categories.length > 0) {
          await db.song.update({
            where: {
              id: songId,
            },
            data: {
              categories: {
                connectOrCreate: categories.map((categoryName) => ({
                  where: { name: categoryName },
                  create: { name: categoryName },
                })),
              },
            },
          });
        }
      });

      return await step.run("deduct-credits", async () => {
        if (!response.ok) return;

        return await db.user.update({
          where: {
            id: userId,
          },
          data: {
            credits: {
              decrement: 1,
            },
          },
        });
      });
    } else {
      await step.run("set-status-no-credits", async () => {
        return await db.song.update({
          where: {
            id: songId,
          },
          data: {
            status: "no credits",
          },
        });
      });
    }

    return { message: `Task ${songId} complete` };
  },
);
