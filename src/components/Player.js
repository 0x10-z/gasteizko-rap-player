import React, { useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faPlay,
  faPause,
  faInfo,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import useKeyboardControls from "../hooks/useKeyboardControls";

const Player = ({
  currentSong,
  setCurrentSong,
  isPlaying,
  setIsPlaying,
  audioRef,
  songInfo,
  setSongInfo,
  songs,
  setSongs,
  setIsShortcutsModalOpen,
}) => {
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

  const activeLibraryHandler = useCallback(
    (newSong) => {
      const newSongs = songs.map((song) => {
        if (song.id === newSong.id) {
          return {
            ...song,
            active: true,
          };
        } else {
          return {
            ...song,
            active: false,
          };
        }
      });
      setSongs(newSongs);
    },
    [songs, setSongs]
  );

  const skipTrackHandler = useCallback(
    async (direction) => {
      let currentIndex = songs.findIndex((song) => song.id === currentSong.id);
      if (direction === "skip-forward") {
        setCurrentSong(songs[(currentIndex + 1) % songs.length]);
      } else if (direction === "skip-back") {
        if ((currentIndex - 1) % songs.length === -1) {
          await setCurrentSong(songs[songs.length - 1]);
          activeLibraryHandler(songs[(currentIndex + 1) % songs.length]);
        } else {
          await setCurrentSong(songs[(currentIndex - 1) % songs.length]);
          activeLibraryHandler(songs[(currentIndex + 1) % songs.length]);
        }
      }
      if (isPlaying) {
        audioRef.current.play();
      }
    },
    [
      currentSong,
      songs,
      setCurrentSong,
      isPlaying,
      audioRef,
      activeLibraryHandler,
    ]
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

  const getTime = (time) => {
    let minute = Math.floor(time / 60);
    let second = ("0" + Math.floor(time % 60)).slice(-2);
    return `${minute}:${second}`;
  };

  const dragHandler = (e) => {
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
    <PlayerContainer>
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

        <P>{getTime(songInfo.duration || 0)}</P>
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

const ControlIcon = styled(FontAwesomeIcon)`
  cursor: pointer;
  padding: 20px;
  width: 30px;
  height: 30px;
  border-radius: 80%;
  transition: background-color 0.3s ease;

  &:hover {
    border-radius: 50%;
    background-color: rgba(
      0,
      0,
      0,
      0.1
    ); // Puedes ajustar el color y la opacidad según lo que prefieras
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

const Track = styled.div`
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

const AnimateTrack = styled.div.attrs((props) => ({
  style: {
    transform: `translateX(${props.$progress}%)`,
  },
}))`
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
    width: 60%;
  }
`;

export default Player;
