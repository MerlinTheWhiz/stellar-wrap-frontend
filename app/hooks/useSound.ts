import { useCallback } from "react";
import { soundManager, SoundName } from "../utils/soundManager";
import { useSoundStore } from "../store/soundStore";

export function useSound() {
  const isMuted = useSoundStore((state) => state.isMuted);

  const playSound = useCallback(
    (soundName: SoundName) => {
      if (!isMuted) {
        soundManager.playSound(soundName);
      }
    },
    [isMuted]
  );

  return { playSound };
}

