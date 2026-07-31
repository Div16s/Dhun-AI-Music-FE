"use client";

import Image from "next/image";
import { Download, Music, Pause, Play, Volume2 } from "lucide-react";
import { Card } from "~/components/ui/card";
import { usePlayerStore } from "~/stores/use-player-store";
import { Button } from "./ui/button";
import { useEffect, useRef, useState } from "react";
import { Slider } from "./ui/slider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

export default function SoundBar() {
  const { track } = usePlayerStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([100]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const togglePlay = () => {
    if(!track?.url || !audioRef.current) return;
    if(isPlaying){
        audioRef.current.pause();
        setIsPlaying(false);
    }
    else{
        audioRef.current.play();
        setIsPlaying(true);
    }
  }

  const handleSeek = (value: number[]) => {
    if(audioRef.current && value[0]!==undefined) {
        audioRef.current.currentTime = value[0];
        setCurrentTime(value[0]);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if(!audio) return;
    const updateTime = () => {
        setCurrentTime(audio.currentTime);
    }

    const updateDuration = () => {
        if(!isNaN(audio.duration)){
            setDuration(audio.duration);
        }
    }

    const handleTrackEnd = () => {
        setIsPlaying(false);
        setCurrentTime(0);
        
    }

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleTrackEnd);

    return () => {
        audio.removeEventListener("timeupdate", updateTime);
        audio.removeEventListener("loadedmetadata", updateDuration);
        audio.removeEventListener("ended", handleTrackEnd);
    }
  }, [track]);

  useEffect(() => {
    if (audioRef.current && track?.url) {
      setCurrentTime(0);
      setDuration(0);

      audioRef.current.src = track?.url;
      audioRef.current.load();

      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.error("Playback failed: ", error);
            setIsPlaying(false);
          });
      }
    }
  }, [track]);

  useEffect(() => {
    if(audioRef.current){
        audioRef.current.volume = volume[0]!/100;
    }
  }, [volume]);

  if(!track) return null;

  const promptText =
    track.prompt ?? (track.title !== "Untitled" ? track.title : null);

  return (
    <div className="px-4 pb-2">
      <Card className="bg-card/70 relative w-full shrink-0 rounded-xl border py-0 shadow-lg backdrop-blur-md">
        <div className="space-y-2 p-3">
          <div className="flex items-center justify-between">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <div className="from-primary to-accent relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-linear-to-br">
                {track?.thumbnail ? (
                  <Image
                    className="object-cover"
                    src={track.thumbnail}
                    alt="Music"
                    fill
                    sizes="40px"
                    unoptimized
                  />
                ) : (
                  <Music className="text-primary-foreground h-4 w-4" />
                )}
              </div>
              <div className="min-w-0 max-w-40 md:max-w-64">
                <p className="text-foreground truncate text-sm font-medium">
                  {track?.title || "Untitled"}
                </p>
                <p className="text-muted-foreground truncate text-xs">
                  {track?.createdBy}
                </p>
              </div>
            </div>

            <div className="absolute left-1/2 -translate-x-1/2">
              <Button
                size={"icon"}
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause" : "Play"}
                className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 w-10 rounded-full shadow-md"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5 fill-current" />
                ) : (
                  <Play className="h-5 w-5 fill-current" />
                )}
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden items-center gap-2 sm:flex">
                <Volume2 className="text-muted-foreground h-4 w-4 shrink-0" />
                <div className="w-16 shrink-0">
                  <Slider
                    className="**:data-[slot=slider-range]:bg-foreground/80"
                    value={volume}
                    onValueChange={setVolume}
                    step={1}
                    max={100}
                    min={0}
                  />
                </div>
              </div>
              {promptText && (
                <Dialog>
                  <DialogTrigger
                    render={
                      <Button
                        variant={"ghost"}
                        size={"sm"}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        View Prompt
                      </Button>
                    }
                  />
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Prompt</DialogTitle>
                      <DialogDescription>
                        The prompt used to generate this song.
                      </DialogDescription>
                    </DialogHeader>
                    <p className="text-foreground text-sm whitespace-pre-wrap">
                      {promptText}
                    </p>
                  </DialogContent>
                </Dialog>
              )}
              <Button
                variant={"ghost"}
                size={"icon"}
                aria-label="Download"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => {
                  if (!track?.url) return;
                  window.open(track?.url, "_blank");
                }}
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-muted-foreground w-8 text-right text-[10px]">
              {formatTime(currentTime)}
            </span>
            <Slider
              className={
                "flex-1 cursor-pointer **:data-[slot=slider-range]:bg-foreground/80"
              }
              value={[currentTime]}
              max={duration || 100}
              step={1}
              onValueChange={handleSeek}
            />
            <span className="text-muted-foreground w-8 text-right text-[10px]">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        
        <audio ref={audioRef} src={track?.url ?? ""} preload="metadata" />
        
      </Card>
    </div>
  );
}
