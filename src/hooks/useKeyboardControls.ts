import { useCallback, useRef } from "react";

type PlaySongHandlerType = () => void;
type SkipTrackHandlerType = (direction: "skip-forward" | "skip-back") => void;
type AudioRefType = React.RefObject<HTMLAudioElement>;

const useKeyboardControls = (
  playSongHandler: PlaySongHandlerType,
  skipTrackHandler: SkipTrackHandlerType,
  audioRef: AudioRefType
) => {
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const keyHeld = useRef(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (
        audioRef.current &&
        (e.code === "ArrowRight" || e.code === "ArrowLeft")
      ) {
        pressTimer.current = setTimeout(() => {
          keyHeld.current = true;
          if (e.code === "ArrowRight") {
            audioRef.current!.currentTime += 5;
          } else {
            audioRef.current!.currentTime -= 5;
          }
        }, 500);
      }
    },
    [audioRef]
  );

  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      clearTimeout(pressTimer.current!);
      switch (e.code) {
        case "Space":
          playSongHandler();
          break;
        case "ArrowRight":
          if (!keyHeld.current) {
            skipTrackHandler("skip-forward");
          }
          break;
        case "ArrowLeft":
          if (!keyHeld.current) {
            skipTrackHandler("skip-back");
          }
          break;
        default:
          break;
      }
      keyHeld.current = false; // Restablecer el ref para la próxima vez
      pressTimer.current = null;
    },
    [playSongHandler, skipTrackHandler]
  );

  return { handleKeyDown, handleKeyUp };
};

export default useKeyboardControls;
