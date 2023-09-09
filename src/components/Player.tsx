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

  // Event handlers
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
        <P>{getTime(songInfo.currentTime || 0)}</P>
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
        <P>
          {(songInfo.duration && getTime(songInfo.duration || 0)) || <Dots />}
        </P>
      </TimeControlContainer>

      <PlayControlContainer>
        <ControlIcon
          onClick={() => setIsShortcutsModalOpen(true)}
          className="shortcutModal"
          icon={faInfo}
          size="2x"
        />
        <ControlIcon
          onClick={() => skipTrackHandler("skip-back")}
          className="skip-back"
          icon={faAngleLeft}
          size="2x"
        />
        <ControlIcon
          onClick={playSongHandler}
          className="play"
          icon={togglePlayPauseIcon()}
          size="2x"
        />
        <ControlIcon
          onClick={() => skipTrackHandler("skip-forward")}
          className="skip-forward"
          icon={faAngleRight}
          size="2x"
        />
        <ControlIcon
          onClick={() => downloadSong()}
          className="download"
          icon={faDownload}
          size="2x"
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
  padding: 20px;
  width: 30px;
  height: 30px;
  border-radius: 80%;
  transition: background-color 0.3s ease;

  &:hover {
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.1);
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
  margin-top: 5vh;
  width: 50%;
  display: flex;
  @media screen and (max-width: 768px) {
    width: 90%;
  }
`;

const Track = styled.div<{ $color1: string; $color2: string }>`
  background: lightblue;
  width: 100%;
  height: 1rem;
  position: relative;
  border-radius: 1rem;
  overflow: hidden;
  background: linear-gradient(
    to right,
    ${(p) => p.$color1},
    ${(p) => p.$color2}
  );
`;

const AnimateTrack = styled.div.attrs<{ $progress: number }>(
  ({ $progress }) => ({
    style: {
      transform: `translateX(${$progress}%)`,
    },
  })
)`
  background: rgb(204, 204, 204);
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
  /* padding-top: 1rem;
	padding-bottom: 1rem; */
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
  &::-moz-range-thumb {
    -webkit-appearance: none;
    background: transparent;
    border: none;
  }
`;

const P = styled.p`
  padding: 0 1rem 0 1rem;
  user-select: none;
`;

const PlayControlContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  width: 30%;
  @media screen and (max-width: 768px) {
    width: 90%;
  }
`;

export default Player;
