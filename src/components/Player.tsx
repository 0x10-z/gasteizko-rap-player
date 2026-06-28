import { FC, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faPlay,
  faPause,
  faInfo,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import styled, { keyframes } from "styled-components";
import useKeyboardControls from "../hooks/useKeyboardControls";
import { useSongChange } from "../contexts/SongChangeProvider";
import { useAudioPlayer } from "../contexts/AudioPlayerContext";
import { SongType, SongInfoType } from "../types/models";

const typingDots = keyframes`
  0%, 20% {
    content: '.';
  }
  40% {
    content: '..';
  }
  60%, 100% {
    content: '...';
  }
`;

type PlayerProps = {
  currentSong: SongType;
  currentSongIndex: number;
  totalSongs: number;
  songInfo: SongInfoType;
  setSongInfo: (songInfo: SongInfoType) => void;
  setIsShortcutsModalOpen: (isOpen: boolean) => void;
};

const Player: FC<PlayerProps> = ({
  currentSong,
  currentSongIndex,
  totalSongs,
  songInfo,
  setSongInfo,
  setIsShortcutsModalOpen,
}) => {
  const { changeSong } = useSongChange();
  const { audioRef, isPlaying, toggle } = useAudioPlayer();
  const [color1, color2] = currentSong.color;

  const skipTrackHandler = useCallback(
    async (direction: "skip-forward" | "skip-back") => {
      if (direction === "skip-forward") {
        await changeSong("forward");
      } else if (direction === "skip-back") {
        await changeSong("backward");
      }
    },
    [changeSong],
  );

  const { handleKeyDown, handleKeyUp } = useKeyboardControls(
    toggle,
    skipTrackHandler,
    audioRef,
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const togglePlayPauseIcon = () => {
    if (isPlaying) {
      return faPause;
    } else {
      return faPlay;
    }
  };

  const getTime = (time: number) => {
    const minute = Math.floor(time / 60);
    const second = ("0" + Math.floor(time % 60)).slice(-2);
    return `${minute}:${second}`;
  };

  const dragHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    audioRef.current!.currentTime = Number(e.target.value);
    setSongInfo({ ...songInfo, currentTime: Number(e.target.value) });
  };

  const downloadSong = () => {
    window.open(currentSong.audio, "_blank");
  };

  const progress = songInfo.duration
    ? (songInfo.currentTime * 100) / songInfo.duration
    : 0;

  return (
    <PlayerContainer>
      <PlayerTopRow>
        <MetaBlock>
          <MetaLabel>Control deck</MetaLabel>
          <MetaValue>{currentSong.name}</MetaValue>
          <MetaSubvalue>
            Corte {currentSongIndex + 1} de {totalSongs} del disco
          </MetaSubvalue>
        </MetaBlock>
        <UtilityActions>
          <UtilityButton
            type="button"
            onClick={() => setIsShortcutsModalOpen(true)}
            aria-label="Atajos de teclado">
            <FontAwesomeIcon icon={faInfo} />
          </UtilityButton>
          <UtilityButton
            type="button"
            onClick={() => downloadSong()}
            aria-label="Descargar canción">
            <FontAwesomeIcon icon={faDownload} />
          </UtilityButton>
        </UtilityActions>
      </PlayerTopRow>
      <TimeControlContainer>
        <TimeText>{getTime(songInfo.currentTime || 0)}</TimeText>
        <Track $color1={color1} $color2={color2}>
          <Input
            onChange={dragHandler}
            min={0}
            max={songInfo.duration || 0}
            value={songInfo.currentTime}
            type="range"
            aria-label="Progreso de la canción"
          />
          <AnimateTrack $progress={progress}></AnimateTrack>
        </Track>
        <TimeText>
          {(songInfo.duration && getTime(songInfo.duration || 0)) || <Dots />}
        </TimeText>
      </TimeControlContainer>

      <PlayControlContainer>
        <TransportButton
          type="button"
          onClick={() => skipTrackHandler("skip-back")}
          aria-label="Canción anterior">
          <FontAwesomeIcon icon={faAngleLeft} size="lg" />
        </TransportButton>
        <PlayButton
          onClick={toggle}
          $color1={color1}
          $color2={color2}
          aria-label={isPlaying ? "Pausar" : "Reproducir"}>
          <FontAwesomeIcon
            icon={togglePlayPauseIcon()}
            size="lg"
            style={{ marginLeft: isPlaying ? 0 : 2 }}
          />
        </PlayButton>
        <TransportButton
          type="button"
          onClick={() => skipTrackHandler("skip-forward")}
          aria-label="Siguiente canción">
          <FontAwesomeIcon icon={faAngleRight} size="lg" />
        </TransportButton>
      </PlayControlContainer>
    </PlayerContainer>
  );
};

const Dots = styled.span`
  &::after {
    content: "...";
    animation: ${typingDots} 1s infinite;
  }
`;

const PlayButton = styled.button<{ $color1: string; $color2: string }>`
  width: 68px;
  height: 68px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${(p) => p.$color1}, ${(p) => p.$color2});
  color: #061109;
  font-size: 1.2rem;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  box-shadow: 0 16px 36px ${(p) => p.$color1}55;

  &:hover {
    transform: scale(1.04);
    box-shadow: 0 20px 42px ${(p) => p.$color1}77;
  }

  &:active {
    transform: scale(0.95);
  }

  @media screen and (max-height: 760px) {
    width: 60px;
    height: 60px;
  }
`;

const PlayerContainer = styled.div`
  width: min(760px, 100%);
  display: flex;
  flex-direction: column;
  margin-top: auto;
  gap: 1rem;
  padding: 1.2rem 1.3rem 1.1rem;
  border-radius: 28px;
  background: linear-gradient(
    180deg,
    rgba(13, 19, 24, 0.88),
    rgba(9, 13, 17, 0.92)
  );
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 26px 70px rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(28px);

  @media screen and (max-width: 768px) {
    margin-top: 1.25rem;
  }

  @media screen and (max-height: 760px) {
    gap: 0.75rem;
    padding: 1rem 1.1rem 0.95rem;
  }
`;

const PlayerTopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  @media screen and (max-width: 520px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

const MetaBlock = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

const MetaLabel = styled.span`
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: rgba(198, 214, 203, 0.56);
`;

const MetaValue = styled.span`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  color: #f4faf5;
  font-size: 1rem;
  font-weight: 700;

  @media screen and (max-height: 760px) {
    font-size: 0.92rem;
  }
`;

const MetaSubvalue = styled.span`
  color: rgba(198, 214, 203, 0.68);
  font-size: 0.8rem;
  font-variant-numeric: tabular-nums;

  @media screen and (max-height: 760px) {
    font-size: 0.74rem;
  }
`;

const UtilityActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
`;

const UtilityButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.05);
  color: rgba(236, 247, 239, 0.82);
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    transform 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
  }
`;

const TimeControlContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  @media screen and (max-width: 520px) {
    gap: 0.5rem;
  }
`;

const Track = styled.div<{ $color1: string; $color2: string }>`
  width: 100%;
  height: 8px;
  position: relative;
  border-radius: 999px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.08);
  transition: height 0.15s ease;

  &:hover {
    height: 10px;
  }

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to right,
      ${(p) => p.$color1},
      ${(p) => p.$color2}
    );
    opacity: 0.95;
  }
`;

const AnimateTrack = styled.div.attrs<{ $progress: number }>(
  ({ $progress }) => ({
    style: {
      width: `${Math.max(0, Math.min(100, $progress))}%`,
    },
  }),
)`
  background: rgba(6, 12, 8, 0.72);
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  transition: width 0.1s linear;
`;

const Input = styled.input`
  width: 100%;
  -webkit-appearance: none;
  background: transparent;
  cursor: pointer;
  touch-action: none;
  position: relative;
  z-index: 2;

  &:focus {
    outline: none;
    -webkit-appearance: none;
  }

  @media screen and (max-width: 768px) {
    &::-webkit-slider-thumb {
      height: 48px;
      width: 48px;
    }
  }
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 18px;
    width: 18px;
    background: transparent;
    border: none;
  }
  &::-moz-range-thumb {
    -webkit-appearance: none;
    background: transparent;
    border: none;
  }
  &::-ms-thumb {
    -webkit-appearance: none;
    background: transparent;
    border: none;
  }
`;

const TimeText = styled.p`
  font-size: 0.82rem;
  color: rgba(202, 214, 205, 0.7);
  user-select: none;
  font-variant-numeric: tabular-nums;
  min-width: 3.5ch;
`;

const PlayControlContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.85rem;

  @media screen and (max-width: 768px) {
    gap: 0.5rem;
  }

  @media screen and (max-height: 760px) {
    gap: 0.65rem;
  }
`;

const TransportButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.05);
  color: #edf7f0;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    background-color 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.1);
  }

  &:active {
    transform: scale(0.96);
  }

  @media screen and (max-height: 760px) {
    width: 44px;
    height: 44px;
  }
`;

export default Player;
