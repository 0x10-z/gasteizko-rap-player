import React, { createContext, useContext, useRef, useState, useCallback } from "react";

type AudioPlayerContextType = {
  audioRef: React.RefObject<HTMLAudioElement | null>;
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

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const play = useCallback(() => {
    if (audioRef.current) {
      const promise = audioRef.current.play();
      if (promise !== undefined) {
        promise.catch(() => {});
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
