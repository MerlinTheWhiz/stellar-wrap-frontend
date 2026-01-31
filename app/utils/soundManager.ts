import { useSoundStore } from "../store/soundStore";


export const SOUND_NAMES = {
    SLIDE_WHOOSH: "slide-whoosh",
    CARD_FLIP: "card-flip",
  MINT_SUCCESS: "mint-success",
    BG_MUSIC: "bg-music",
} as const;

export const SOUND_FILES = {
  [SOUND_NAMES.SLIDE_WHOOSH]: "/audio/slide-whoosh.mp3",
  [SOUND_NAMES.CARD_FLIP]: "/audio/card-flip.mp3",
  [SOUND_NAMES.MINT_SUCCESS]: "/audio/mint-success.mp3",
  [SOUND_NAMES.BG_MUSIC]: "/audio/bg-music.mp3",

};


export type SoundName = (typeof SOUND_NAMES)[keyof typeof SOUND_NAMES];

interface AudioInstance {
  audio: HTMLAudioElement;
  isPlaying: boolean;
}

class SoundManager {
  private sfxPool: Map<SoundName, AudioInstance[]> = new Map();
  private audioContext: AudioContext | null = null;
  private bgMusicBuffer: AudioBuffer | null = null;
  private bgMusicSource: AudioBufferSourceNode | null = null;
  private bgMusicGainNode: GainNode | null = null;
  private bgMusicLoaded: boolean = false;
  private isPlaying: boolean = false;
  private isInitialized: boolean = false;


   preloadSFX(): void {
    if (typeof window === "undefined") return;
     
     Object.entries(SOUND_FILES).forEach(([name, src]) => {
      
      if (name === SOUND_NAMES.BG_MUSIC) return;
      
      const pool: AudioInstance[] = [];
      for (let i = 0; i < 3; i++) {
        const audio = new Audio(src);
        audio.preload = "auto";
        audio.volume = 0.7; 
        pool.push({ audio, isPlaying: false });
      }
      this.sfxPool.set(name as SoundName, pool);
    });

    this.isInitialized = true;
  }

  private getAvailableInstance(soundName: SoundName): AudioInstance | null {
    const pool = this.sfxPool.get(soundName);
    if (!pool) return null;

    let available = pool.find((instance) => !instance.isPlaying);
    
    if (!available) {
      available = pool[0];
      available.audio.pause();
      available.audio.currentTime = 0;
    }

    return available;
  }

  playSound(soundName: SoundName): void {
    if (typeof window === "undefined") return;

    if (soundName === SOUND_NAMES.BG_MUSIC) {
      console.warn("BG_MUSIC should be played via startBackgroundMusic(), not playSound()");
      return;
    }

    const isMuted = useSoundStore.getState().isMuted;
    if (isMuted) return;

    if (!this.isInitialized) {
      this.preloadSFX();
    }

    const instance = this.getAvailableInstance(soundName);
    if (!instance) return;

    instance.isPlaying = true;
    const audio = instance.audio;

    audio.currentTime = 0;
    audio.play().catch((error) => {
      console.warn(`Failed to play sound ${soundName}:`, error);
      instance.isPlaying = false;
    });

    audio.onended = () => {
      instance.isPlaying = false;
    };
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    
    if (!this.audioContext) {
      // eslint-disable-next-line
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    return this.audioContext;
  }

  async initBackgroundMusic(): Promise<void> {
    if (typeof window === "undefined" || this.bgMusicLoaded) return;

    try {
      const audioContext = this.getAudioContext();
      if (!audioContext) return;

      const response = await fetch(SOUND_FILES[SOUND_NAMES.BG_MUSIC]);
      const arrayBuffer = await response.arrayBuffer();
      this.bgMusicBuffer = await audioContext.decodeAudioData(arrayBuffer);

      this.bgMusicGainNode = audioContext.createGain();
      this.bgMusicGainNode.gain.value = 0.2;
      this.bgMusicGainNode.connect(audioContext.destination);

      this.bgMusicLoaded = true;
    } catch (error) {
      console.warn("Failed to load background music:", error);
    }
  }

  private startLoop(): void {
    const audioContext = this.getAudioContext();
    if (!audioContext || !this.bgMusicBuffer || !this.bgMusicGainNode) return;

    if (this.bgMusicSource) {
      try {
        this.bgMusicSource.stop();
        this.bgMusicSource.onended = null; 
      } catch (error) {
        console.error("Failed to stop background music:", error);
      }
      this.bgMusicSource = null;
    }

    if (!this.isPlaying) return;

    this.bgMusicSource = audioContext.createBufferSource();
    this.bgMusicSource.buffer = this.bgMusicBuffer;
    this.bgMusicSource.connect(this.bgMusicGainNode);

    const currentSource = this.bgMusicSource;
    this.bgMusicSource.onended = () => {
      if (this.isPlaying && this.bgMusicSource === currentSource) {
        this.bgMusicSource = null;
        this.startLoop();
      }
    };

    try {
      this.bgMusicSource.start(0);
    } catch (error) {
      console.warn("Failed to start audio source:", error);
      this.bgMusicSource = null;
      this.isPlaying = false;
    }
  }

  async startBackgroundMusic(): Promise<void> {
    if (typeof window === "undefined") return;

    const isMuted = useSoundStore.getState().isMuted;
    if (isMuted) {
      this.isPlaying = false;
      return;
    }

    if (this.isPlaying) {
      return;
    }

    if (!this.bgMusicLoaded) {
      await this.initBackgroundMusic();
    }

    if (!this.bgMusicLoaded) {
      console.warn("Background music not loaded");
      return;
    }

    const audioContext = this.getAudioContext();
    if (!audioContext) {
      console.warn("AudioContext not available");
      return;
    }

    if (audioContext.state === "suspended") {
      try {
        await audioContext.resume();
      } catch (error) {
        console.warn("Failed to resume AudioContext:", error);
        return; 
      }
    }

    this.isPlaying = true;
    this.startLoop();
  }

  stopBackgroundMusic(): void {
    this.isPlaying = false;
    
    if (this.bgMusicSource) {
      try {
        this.bgMusicSource.onended = null;
        this.bgMusicSource.stop();
      } catch (error) {
        console.error("Failed to stop background music:", error);
      }
      this.bgMusicSource = null;
    }
  }

  pauseBackgroundMusic(): void {
    this.isPlaying = false;
    
    if (this.bgMusicSource) {
      try {
        this.bgMusicSource.onended = null;
        this.bgMusicSource.stop();
      } catch (error) {
        console.error("Failed to pause background music:", error);
      }
      this.bgMusicSource = null;
    }
  }

  async resumeBackgroundMusic(): Promise<void> {
    if (typeof window === "undefined") return;

    const isMuted = useSoundStore.getState().isMuted;
    if (isMuted) {
      this.isPlaying = false;
      return;
    }

    if (this.isPlaying) {
      return;
    }

    if (!this.bgMusicLoaded) {
      await this.initBackgroundMusic();
    }

    if (!this.bgMusicLoaded) {
      console.warn("Background music not loaded");
      return;
    }

    const audioContext = this.getAudioContext();
    if (!audioContext) {
      console.warn("AudioContext not available");
      return;
    }

    if (audioContext.state === "suspended") {
      try {
        await audioContext.resume();
      } catch (error) {
        console.warn("Failed to resume AudioContext:", error);
        return; 
      }
    }

    this.isPlaying = true;
    this.startLoop();
  }

  updateMuteState(isMuted: boolean): void {
    if (isMuted) {
      this.pauseBackgroundMusic();
    } else {
      if (this.bgMusicLoaded) {
        this.resumeBackgroundMusic().catch((error) => {
          console.warn("Failed to resume background music on unmute:", error);
        });
      }
    }
  }

  cleanup(): void {
    this.stopBackgroundMusic();
    
    if (this.bgMusicGainNode) {
      this.bgMusicGainNode.disconnect();
      this.bgMusicGainNode = null;
    }
    
    if (this.audioContext) {
      this.audioContext.close().catch((error) => {
        console.warn("Failed to close audio context:", error);
      });
      this.audioContext = null;
    }
    
    this.bgMusicBuffer = null;
    this.bgMusicLoaded = false;
    this.sfxPool.clear();
    this.isInitialized = false;
  }
}

export const soundManager = new SoundManager();

if (typeof window !== "undefined") {
  soundManager.preloadSFX();
}

