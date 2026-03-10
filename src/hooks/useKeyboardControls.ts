import { useCallback, useRef } from "react";

type PlaySongHandlerType = () => void;
type SkipTrackHandlerType = (direction: "skip-forward" | "skip-back") => void;
type AudioRefType = React.RefObject<HTMLAudioElement | null>;

const useKeyboardControls = (
  playSongHandler: PlaySongHandlerType,
  skipTrackHandler: SkipTrackHandlerType,
  audioRef: AudioRefType
) => {
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const keyHeld = useRef(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;

      if (e.code === "Space" && !isInput) {
        e.preventDefault();
      }

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
      const target = e.target as HTMLElement;
      const isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;

      clearTimeout(pressTimer.current!);
      switch (e.code) {
        case "Space":
          if (!isInput) {
            playSongHandler();
          }
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
