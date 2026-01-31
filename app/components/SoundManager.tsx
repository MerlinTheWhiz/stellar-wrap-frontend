"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { soundManager } from "../utils/soundManager";
import { useSoundStore } from "../store/soundStore";

export function SoundManager() {
  const pathname = usePathname();
  const isMuted = useSoundStore((state) => state.isMuted);
  const isInitializingRef = useRef(false);

  useEffect(() => {
    if (isInitializingRef.current) return;
    
    const isStoryFlow = pathname !== "/";
    
    if (pathname === "/") {
      soundManager.stopBackgroundMusic();
      return;
    }
    
    if (isStoryFlow) {
      if (isMuted) {
        soundManager.pauseBackgroundMusic();
      } else {
        isInitializingRef.current = true;
        soundManager.startBackgroundMusic()
          .catch((error) => {
            console.warn("Failed to start background music:", error);
          })
          .finally(() => {
            isInitializingRef.current = false;
          });
      }
    }
  }, [pathname, isMuted]);

  return null;
}

