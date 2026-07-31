"use client";

import type { Category, Like, Song } from "generated/prisma";
import Image from "next/image";
import { Headphones, Heart, Loader2, Music, Play } from "lucide-react";
import { useState } from "react";
import { usePlayerStore } from "~/stores/use-player-store";
import { Button } from "../ui/button";
import { toggleLikeSong } from "~/actions/song";
import { getPlayUrl } from "~/actions/generation";

type SongWithRelation = Song & {
  user: { name: string | null };
  _count: {
    likes: number;
  };
  categories: Category[];
  thumbnailUrl?: string | null;
  likes?: Like[];
};

export function SongCard({ song }: { song: SongWithRelation }) {
  const [isLoading, setIsLoading] = useState(false);
  const[isLiked, setIsLiked] = useState(song.likes ? song.likes.length > 0 : false);
  const [likesCount, setLikesCount] = useState(song._count.likes);
  const setTrack = usePlayerStore((state) => state.setTrack);

  const handlePlay = async () => {
    setIsLoading(true);
    const playUrl = await getPlayUrl(song.id);

    setTrack({
      id: song.id,
      title: song.title,
      url: playUrl,
      thumbnail: song.thumbnailUrl ?? null,
      prompt: song.prompt,
      createdBy: song.user.name,
    });

    setIsLoading(false);
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    await toggleLikeSong(song.id);
  }
  return (
    <div className="bg-card hover:border-ring/40 rounded-xl border p-2 transition-colors">
      <div onClick={handlePlay} className="cursor-pointer">
        <div className="group relative aspect-square w-full overflow-hidden rounded-lg bg-muted transition-opacity duration-300 group-hover:opacity-90">
          {song.thumbnailUrl ? (
            <Image
              src={song.thumbnailUrl}
              alt={song.title ?? "song"}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1280px) 20vw, 160px"
              className="object-cover object-center"
            />
          ) : (
            <div className="bg-muted flex h-full w-full items-center justify-center">
              <Music className="text-muted-foreground h-12 w-12" />
            </div>
          )}

          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
            <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-transform group-hover:scale-105">
                {isLoading ? <Loader2 className="text-primary-foreground h-6 w-6 animate-spin"/> : <Play className="text-primary-foreground fill-primary-foreground h-6 w-6"/>}
            </div>
          </div>
        </div>

        <h3 className="text-foreground mt-2 truncate text-sm font-medium">{song.title}</h3>
        <p className="text-muted-foreground truncate text-xs">{song.user.name}</p>
        <div className="mt-1 flex items-center justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1.5 tabular-nums">
                <Headphones className="h-3.5 w-3.5" />
                {new Intl.NumberFormat("en", { notation: "compact" }).format(
                  song.listenCount,
                )}
            </span>
            <Button
              onClick={handleLike}
              variant={"ghost"}
              size={"sm"}
              aria-pressed={isLiked}
              aria-label={isLiked ? "Unlike" : "Like"}
              className={`text-muted-foreground hover:text-foreground -mr-2 cursor-pointer gap-1.5 tabular-nums ${
                isLiked ? "text-destructive hover:text-destructive" : ""
              }`}
            >
                <Heart
                  className={`h-3.5 w-3.5 transition-transform ${
                    isLiked ? "fill-destructive scale-110" : ""
                  }`}
                />
                {new Intl.NumberFormat("en", { notation: "compact" }).format(
                  likesCount,
                )}
            </Button>
        </div>
      </div>
    </div>
  );
}
