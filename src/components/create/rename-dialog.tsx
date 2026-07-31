"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import type { Track } from "./track-list";
import { useState } from "react";
import { Button } from "../ui/button";

export function RenameDialog({
  track,
  onClose,
  onRename,
}: {
  track: Track;
  onClose: () => void;
  onRename: (trackId: string, newTitle: string) => void;
}) {
  const [title, setTitle] = useState(track.title ?? "");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (title.trim()) {
      onRename(track.id, title.trim());
    }
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className={"sm:max-w-106.25"}>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Rename Song</DialogTitle>
            <DialogDescription>
              Enter a new name for your song. Click save when you are done!
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center py-4">
              <Label htmlFor="name" className="text-right">
                Title
              </Label>
              <Input
                id="name"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose>
                <Button type="button" variant={"outline"}>Cancel</Button>
            </DialogClose>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
