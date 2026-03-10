import { useState, RefObject } from "react";
import styled from "styled-components";
import { SongType } from "../types/models";

type LibrarySongProps = {
  song: SongType;
  setCurrentSong: (song: SongType) => void;
  audioRef: RefObject<HTMLAudioElement>;
  isPlaying: boolean;
  songs: SongType[];
  setSongs: (songs: SongType[]) => void;
};

const Spinner = styled.div`
  border: 3px solid rgba(0, 0, 0, 0.08);
  border-radius: 50%;
  border-top: 3px solid rgb(80, 80, 80);
  width: 48px;
  height: 48px;
  animation: spin 1s linear infinite;
  margin: 16px 0;
  flex-shrink: 0;

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
        $loaded={imageLoaded}
      />
      <LibrarySongDescription>
        <SongName className="text-ellipsis">{song.name}</SongName>
        <SongDetail className="text-ellipsis">{song.artist}</SongDetail>
        {song.artist !== song.album && (
          <SongDetail className="text-ellipsis">{song.album}</SongDetail>
        )}
      </LibrarySongDescription>
    </LibrarySongContainer>
  );
};

const LibrarySongContainer = styled.div<{ $isActive: boolean }>`
  padding: 0 1.25rem;
  height: 80px;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: background-color 0.2s ease;
  background-color: ${(p) =>
    p.$isActive ? "rgba(0, 0, 0, 0.06)" : "transparent"};
  border-left: ${(p) =>
    p.$isActive ? "3px solid rgb(80, 80, 80)" : "3px solid transparent"};

  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }

  &:hover .text-ellipsis {
    overflow: visible;
    white-space: normal;
    max-width: none;
  }
`;

const LibrarySongDescription = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;

  .text-ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const Img = styled.img<{ $loaded: boolean }>`
  border-radius: 8px;
  height: 48px;
  width: 48px;
  object-fit: cover;
  flex-shrink: 0;
  display: ${(p) => (p.$loaded ? "block" : "none")};
`;

const SongName = styled.h3`
  font-size: 0.9rem;
  font-weight: 600;
  color: rgb(40, 40, 40);
`;

const SongDetail = styled.h4`
  font-size: 0.75rem;
  color: rgb(140, 140, 140);
`;

export default LibrarySong;
