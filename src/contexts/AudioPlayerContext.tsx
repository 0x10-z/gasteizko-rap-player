import { createContext, useContext, useRef, useState, useCallback, type RefObject } from "react";

type AudioPlayerContextType = {
  audioRef: RefObject<HTMLAudioElement | null>;
  isPlaying: boolean;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  setIsPlaying: (playing: boolean) => void;
};

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error("useAudioPlayer must be used within an AudioPlayerProvider");
  }
  return context;
};

export const AudioPlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const play = useCallback(() => {
    if (audioRef.current) {
      const promise = audioRef.current.play();
      if (promise !== undefined) {
        promise.catch((err: DOMException) => {
          if (err.name !== "AbortError") {
            console.error("Audio playback failed:", err);
          }
        });
      }
      setIsPlaying(true);
    }
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  return (
    <AudioPlayerContext.Provider value={{ audioRef, isPlaying, play, pause, toggle, setIsPlaying }}>
      {children}
    </AudioPlayerContext.Provider>
  );
};
