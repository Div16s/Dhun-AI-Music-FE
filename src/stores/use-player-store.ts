import { create } from "zustand";

interface PlayerTrack {
    id: string,
    title: string | null,
    url: string | null,
    thumbnail: string | null,
    prompt: string | null,
    createdBy: string | null
}

interface PlayerState {
    track: PlayerTrack | null,
    setTrack: (track: PlayerTrack) => void
}

export const usePlayerStore = create<PlayerState>((set) => ({
    track: null,
    setTrack: (track) => set({track})
}));