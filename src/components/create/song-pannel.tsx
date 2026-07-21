"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Loader2, Music, Plus } from "lucide-react";
import { Switch } from "../ui/switch";
import { toast } from "sonner";
import { generateSong, type GenerateRequest } from "~/actions/generation";

const suggestionTags = [
  "Lo-fi chill beats",
  "Epic cinematic orchestra",
  "Upbeat pop anthem",
  "80s synthwave retro",
  "Acoustic folk ballad",
  "Hard-hitting trap beat",
];

const styleTags = [
  "Pop",
  "Lo-fi",
  "Synthwave",
  "Acoustic",
  "Ambient",
  "Energetic",
];

export function SongPannel() {
  const [mode, setMode] = useState<"simple" | "custom">("simple");
  const [description, setDescription] = useState("");
  const [instrumental, setInstrumental] = useState(false);
  const [lyricsMode, setLyricsMode] = useState<"write" | "auto">("write");
  const [lyrics, setLyrics] = useState("");
  const [styleInput, setStyleInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSuggestionTagClick = (tag: string) => {
    const currTags = description
      .split(", ")
      .map((s) => s.trim())
      .filter((s) => s);
    if (!currTags.includes(tag)) {
      if (description.trim() == "") {
        setDescription(tag);
      } else {
        setDescription(description + ", " + tag);
      }
    }
  };
  const handleStyleTagClick = (tag: string) => {
    const currTags = styleInput
      .split(", ")
      .map((s) => s.trim())
      .filter((s) => s);
    if (!currTags.includes(tag)) {
      if (styleInput.trim() == "") {
        setStyleInput(tag);
      } else {
        setStyleInput(styleInput + ", " + tag);
      }
    }
  };

  const handleCreate = async () => {
    if(mode=="simple" && !description.trim()){
        toast.error("Please describe your song before creating.");
        return;
    }
    if(mode=="custom" && !styleInput.trim()){
        toast.error("Please add some styles to your song before creating.");
        return;
    }

    let requestBody: GenerateRequest;
    if(mode=="simple"){
        requestBody = {
            fullDescribedSong: description,
            instrumental: instrumental
        }
    }
    else {
        const prompt = styleInput;
        if(lyricsMode=="write"){
            requestBody = {
                prompt,
                lyrics,
                instrumental
            }
        }
        else{
            requestBody = {
                prompt,
                describedLyrics: lyrics,
                instrumental
            }
        }
    }

    try {
        setLoading(true);
        await generateSong(requestBody);
        setDescription("");
        setLyrics("");
        setStyleInput("");
    } catch (error) {
        toast.error("Failed to generate song");
    } finally {
        setLoading(false);
    }
  }

  return (
    <div className="bg-muted/30 flex w-full flex-col md:h-full">
      <div className="flex-1 overflow-y-auto p-4">
        <Tabs
          value={mode}
          onValueChange={(value) => setMode(value as "simple" | "custom")}
        >
          <TabsList className="w-full">
            <TabsTrigger value={"simple"}>Simple</TabsTrigger>
            <TabsTrigger value={"custom"}>Custom</TabsTrigger>
          </TabsList>
          <TabsContent value={"simple"} className="mt-6 space-y-6">
            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium">Describe your song</label>
              <Textarea
                placeholder="A dreamy lofi hip-hop song, perfect for studying or relaxing"
                className="min-h-30 resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Button variant={"outline"} onClick={() => setMode("custom")}>
                <Plus />
                Lyrics
              </Button>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Instrumental</label>
                <Switch
                  checked={instrumental}
                  onCheckedChange={setInstrumental}
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium">Suggestions</label>
              <div className="w-full overflow-x-auto whitespace-nowrap">
                <div className="flex gap-2 pb-2">
                  {suggestionTags.map((tag) => (
                    <Button
                      key={tag}
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 shrink-0 rounded-full bg-transparent text-xs"
                      onClick={() => handleSuggestionTagClick(tag)}
                    >
                      <Plus />
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value={"custom"} className="mt-6 space-y-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Lyrics</label>
                <div className="flex items-center gap-1">
                  <Button
                    variant={lyricsMode == "auto" ? "secondary" : "ghost"}
                    onClick={() => {
                      setLyricsMode("auto");
                      setLyrics("");
                    }}
                    className="h-7 text-xs"
                    size={"sm"}
                  >
                    Auto
                  </Button>

                  <Button
                    variant={lyricsMode == "write" ? "secondary" : "ghost"}
                    onClick={() => {
                      setLyricsMode("write");
                      setLyrics("");
                    }}
                    className="h-7 text-xs"
                    size={"sm"}
                  >
                    Write
                  </Button>
                </div>
              </div>
              <Textarea
                value={lyrics}
                onChange={(e) => setLyrics(e.target.value)}
                className="min-h-30 resize-none"
                placeholder={
                  lyricsMode == "write"
                    ? "Add your own lyrics here"
                    : "Describe your lyrics, e.g., a sad song about lost love"
                }
              />
            </div>

            <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Instrumental</label>
                <Switch
                    checked={instrumental}
                    onCheckedChange={setInstrumental}
                />
            </div>

            <div className="flex flex-col gap-3">
                <label className="text-sm font-medium">
                    Styles
                </label>
                <Textarea
                    value={styleInput}
                    onChange={(e) => setStyleInput(e.target.value)}
                    className="min-h-30 resize-none"
                    placeholder="Enter style tags"
                />
                <div className="w-full overflow-x-auto whitespace-nowrap">
                    <div className="flex gap-2 pb-2">
                        {styleTags.map((tag) => (
                            <Button
                                key={tag}
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-7 shrink-0 rounded-full bg-transparent text-xs"
                                onClick={() => handleStyleTagClick(tag)}
                            >
                                <Plus />
                                {tag}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <div className="border-t p-4">
        <Button onClick={handleCreate} disabled={loading} className="w-full cursor-pointer front-medium">
            {loading ? <Loader2 className="animate-spin"/> : <Music />}
            {loading ? "Creating..." : "Create"}
        </Button>
      </div>
    </div>
  );
}
