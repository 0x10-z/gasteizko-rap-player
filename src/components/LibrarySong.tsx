import { useState, RefObject } from "react";
import styled from "styled-components";
import { SongType } from "../App";

type LibrarySongProps = {
  song: SongType;
  setCurrentSong: (song: SongType) => void;
  audioRef: RefObject<HTMLAudioElement>;
  isPlaying: boolean;
  songs: SongType[];
  setSongs: (songs: SongType[]) => void;
};

const Spinner = styled.div`
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 4px solid #000;
  width: 60px;
  height: 60px;
  animation: spin 1s linear infinite;
  margin: 20px 0;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LibrarySong: React.FC<LibrarySongProps> = ({
  song,
  setCurrentSong,
  audioRef,
  isPlaying,
  songs,
  setSongs,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Function
  const songSelectHandler = async () => {
    await setCurrentSong(song);
    const curSong = song;
    const songList = songs;

    const newSongs = songList.map((song) => {
      if (song.id === curSong.id) {
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

    // check if user is wanting to play a song.
    if (isPlaying && audioRef.current) {
      audioRef.current.play();
    }
  };
  return (
    <LibrarySongContainer onClick={songSelectHandler} $isActive={song.active}>
      {!imageLoaded && <Spinner />}
      <Img
        src={song.cover}
        alt={song.name}
        height={100}
        onLoad={() => setImageLoaded(true)}
        loading="lazy"
      />
      <LibrarySongDescription>
        <H1>{song.name}</H1>
        <H2>{song.artist}</H2>
        <H2>{song.album}</H2>
      </LibrarySongDescription>
    </LibrarySongContainer>
  );
};
const LibrarySongContainer = styled.div<{ $isActive: boolean }>`
  padding: 0 2rem 0 2rem;
  height: 100px;
  width: 100%;
  display: flex;
  transition: all 0.3s ease;
  background-color: ${(p) => (p.$isActive ? "pink" : "white")};
  &:hover {
    background-color: lightblue;
    transition: all 0.3s ease;
  }
  &.active {
    background-color: pink;
  }
`;

const LibrarySongDescription = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Img = styled.img`
  margin: 20px 0;
  border-radius: 5px;
  border: 0.5px solid black;
  height: 60px;
`;

const H1 = styled.h3`
  padding-left: 1rem;
  font-size: 1rem;
`;

const H2 = styled.h4`
  padding-left: 1rem;
  font-size: 0.7rem;
`;

export default LibrarySong;
