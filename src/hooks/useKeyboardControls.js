import { useCallback, useRef } from "react";

const useKeyboardControls = (playSongHandler, skipTrackHandler, audioRef) => {
  const pressTimer = useRef(null);
  const keyHeld = useRef(false); // Nuevo ref para rastrear si la tecla fue mantenida

  const handleKeyDown = useCallback(
    (e) => {
      if (e.code === "ArrowRight" || e.code === "ArrowLeft") {
        pressTimer.current = setTimeout(() => {
          keyHeld.current = true; // Establecer que la tecla fue mantenida
          if (e.code === "ArrowRight") {
            audioRef.current.currentTime += 5; // Avanza 5 segundos
          } else {
            audioRef.current.currentTime -= 5; // Retrocede 5 segundos
          }
        }, 500); // Tiempo que se debe mantener presionada la tecla para avanzar/retroceder
      }
    },
    [audioRef]
  );

  const handleKeyUp = useCallback(
    (e) => {
      clearTimeout(pressTimer.current);
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
