import { Loader2 } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { SongPannel } from "~/components/create/song-pannel";
import TrackListFetcher from "~/components/create/track-list-fetcher";
import { auth } from "~/lib/auth";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }
  return (
    <div className="flex h-full flex-col lg:flex-row">
      <SongPannel />
      <Suspense
        fallback={
          <div className="flex h-full w-full items-center justify-between">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        }
      >
        <TrackListFetcher />
      </Suspense>
    </div>
  );
}
