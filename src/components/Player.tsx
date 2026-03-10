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
  currentSong: any;
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  audioRef: any;
  songInfo: any;
  setSongInfo: (songInfo: any) => void;
  setIsShortcutsModalOpen: (isOpen: boolean) => void;
  [x: string]: any;
};

const Player: FC<PlayerProps> = ({
  currentSong,
  isPlaying,
  setIsPlaying,
  audioRef,
  songInfo,
  setSongInfo,
  setIsShortcutsModalOpen,
  ...rest
}) => {
  const { changeSong } = useSongChange();

  const playSongHandler = useCallback(() => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(!isPlaying);
    } else {
      audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying, audioRef, setIsPlaying]);

  const skipTrackHandler = useCallback(
    async (direction: "skip-forward" | "skip-back") => {
      if (direction === "skip-forward") {
        await changeSong("forward");
      } else if (direction === "skip-back") {
        await changeSong("backward");
      }
    },
    [changeSong]
  );

  const { handleKeyDown, handleKeyUp } = useKeyboardControls(
    playSongHandler,
    skipTrackHandler,
    audioRef
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
    let minute = Math.floor(time / 60);
    let second = ("0" + Math.floor(time % 60)).slice(-2);
    return `${minute}:${second}`;
  };

  const dragHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    audioRef.current.currentTime = e.target.value;
    setSongInfo({ ...songInfo, currentTime: e.target.value });
  };

  const downloadSong = () => {
    window.open(currentSong.audio, "_blank");
  };

  const progress = songInfo.duration
    ? (songInfo.currentTime * 100) / songInfo.duration
    : 0;

  const [color1, color2] = currentSong.color;
  return (
    <PlayerContainer {...rest}>
      <TimeControlContainer>
        <TimeText>{getTime(songInfo.currentTime || 0)}</TimeText>
        <Track $color1={color1} $color2={color2}>
          <Input
            onChange={dragHandler}
            min={0}
            max={songInfo.duration || 0}
            value={songInfo.currentTime}
            type="range"
          />
          <AnimateTrack $progress={progress}></AnimateTrack>
        </Track>
        <TimeText>
          {(songInfo.duration && getTime(songInfo.duration || 0)) || <Dots />}
        </TimeText>
      </TimeControlContainer>

      <PlayControlContainer>
        <SecondaryIcon
          onClick={() => setIsShortcutsModalOpen(true)}
          className="shortcutModal"
          icon={faInfo}
          size="lg"
        />
        <ControlIcon
          onClick={() => skipTrackHandler("skip-back")}
          className="skip-back"
          icon={faAngleLeft}
          size="2x"
        />
        <PlayButton
          onClick={playSongHandler}
          $color1={color1}
          $color2={color2}
        >
          <FontAwesomeIcon
            icon={togglePlayPauseIcon()}
            size="lg"
            style={{ marginLeft: isPlaying ? 0 : 2 }}
          />
        </PlayButton>
        <ControlIcon
          onClick={() => skipTrackHandler("skip-forward")}
          className="skip-forward"
          icon={faAngleRight}
          size="2x"
        />
        <SecondaryIcon
          onClick={() => downloadSong()}
          className="download"
          icon={faDownload}
          size="lg"
        />
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

const ControlIcon = styled(FontAwesomeIcon)`
  cursor: pointer;
  width: 28px;
  height: 28px;
  padding: 16px;
  color: rgb(80, 80, 80);
  transition: all 0.2s ease;
  border-radius: 50%;

  &:hover {
    color: rgb(30, 30, 30);
    background-color: rgba(0, 0, 0, 0.08);
  }

  &:active {
    transform: scale(0.92);
  }
`;

const SecondaryIcon = styled(FontAwesomeIcon)`
  cursor: pointer;
  width: 20px;
  height: 20px;
  padding: 14px;
  color: rgb(180, 180, 180);
  transition: all 0.2s ease;
  border-radius: 50%;

  &:hover {
    color: rgb(100, 100, 100);
    background-color: rgba(0, 0, 0, 0.06);
  }
`;

const PlayButton = styled.button<{ $color1: string; $color2: string }>`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    ${(p) => p.$color1},
    ${(p) => p.$color2}
  );
  color: #fff;
  font-size: 1.2rem;
  transition: all 0.2s ease;
  box-shadow: 0 4px 16px ${(p) => p.$color1}44;

  &:hover {
    transform: scale(1.08);
    box-shadow: 0 6px 24px ${(p) => p.$color1}66;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const PlayerContainer = styled.div`
  min-height: 20vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const TimeControlContainer = styled.div`
  margin-top: 3vh;
  width: 45%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  @media screen and (max-width: 768px) {
    width: 90%;
  }
`;

const Track = styled.div<{ $color1: string; $color2: string }>`
  width: 100%;
  height: 5px;
  position: relative;
  border-radius: 5px;
  overflow: hidden;
  background: linear-gradient(
    to right,
    ${(p) => p.$color1},
    ${(p) => p.$color2}
  );
  transition: height 0.15s ease;

  &:hover {
    height: 7px;
  }
`;

const AnimateTrack = styled.div.attrs<{ $progress: number }>(
  ({ $progress }) => ({
    style: {
      transform: `translateX(${$progress}%)`,
    },
  })
)`
  background: rgba(220, 220, 220, 0.7);
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
`;

const Input = styled.input`
  width: 100%;
  -webkit-appearance: none;
  background: transparent;
  cursor: pointer;
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
    height: 16px;
    width: 16px;
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
  font-size: 0.8rem;
  color: rgb(155, 155, 155);
  user-select: none;
  font-variant-numeric: tabular-nums;
  min-width: 3ch;
`;

const PlayControlContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  gap: 0.75rem;
  @media screen and (max-width: 768px) {
    gap: 0.5rem;
  }
`;

export default Player;
