import { create } from "zustand";

interface SoundStoreState {
  isMuted: boolean;
  toggleMute: () => void;
  setMuted: (muted: boolean) => void;
}

// Load initial state from localStorage
const getInitialMutedState = (): boolean => {
  if (typeof window === "undefined") return false;
  const stored = localStorage.getItem("sound-preferences");
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return parsed.isMuted ?? false;
    } catch {
      return false;
    }
  }
  return false;
};

export const useSoundStore = create<SoundStoreState>((set) => ({
  isMuted: getInitialMutedState(),
  toggleMute: () =>
    set((state) => {
      const newMuted = !state.isMuted;
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "sound-preferences",
          JSON.stringify({ isMuted: newMuted })
        );
      }
      return { isMuted: newMuted };
    }),
  setMuted: (muted: boolean) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "sound-preferences",
        JSON.stringify({ isMuted: muted })
      );
    }
    set({ isMuted: muted });
  },
}));

