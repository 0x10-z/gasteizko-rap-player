import { FC, useState } from "react";
import styled from "styled-components";
import { SongType } from "../types/models";
import { useAudioPlayer } from "../contexts/AudioPlayerContext";
import { getAudioSrc } from "../utils";

// Cache loaded image URLs across mount/unmount cycles (virtual list)
const MAX_CACHE_SIZE = 800;
const loadedCovers = new Set<string>();

type LibrarySongProps = {
  song: SongType;
  setCurrentSong: (song: SongType) => void;
  songs: SongType[];
  setSongs: (songs: SongType[]) => void;
};

const Spinner = styled.div`
  border: 3px solid rgba(255, 255, 255, 0.08);
  border-radius: 50%;
  border-top: 3px solid rgba(236, 247, 240, 0.82);
  width: 40px;
  height: 40px;
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

const LibrarySong: FC<LibrarySongProps> = ({
  song,
  setCurrentSong,
  songs,
  setSongs,
}) => {
  const [imageLoaded, setImageLoaded] = useState(() =>
    loadedCovers.has(song.cover),
  );
  const { audioRef, play, setIsPlaying } = useAudioPlayer();

  const songSelectHandler = async () => {
    await setCurrentSong(song);
    const curSong = song;
    const songList = songs;

    const newSongs = songList.map((song: SongType) => {
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

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = getAudioSrc(song);
    }

    setIsPlaying(true);
    setTimeout(() => {
      play();
    }, 100);
  };

  const handleImageLoad = () => {
    if (loadedCovers.size >= MAX_CACHE_SIZE) {
      const first = loadedCovers.values().next().value;
      if (first) loadedCovers.delete(first);
    }
    loadedCovers.add(song.cover);
    setImageLoaded(true);
  };

  return (
    <LibrarySongContainer onClick={songSelectHandler} $isActive={song.active}>
      {!imageLoaded && <Spinner />}
      <Img
        src={song.cover}
        alt={song.name}
        height={100}
        onLoad={handleImageLoad}
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
  padding: 0.85rem 1rem;
  min-height: 78px;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
  background-color: ${(p) =>
    p.$isActive ? "rgba(29, 185, 84, 0.14)" : "transparent"};
  border-left: ${(p) =>
    p.$isActive ? "3px solid rgb(29, 185, 84)" : "3px solid transparent"};

  &:hover {
    background-color: rgba(255, 255, 255, 0.06);
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
  border-radius: 10px;
  height: 48px;
  width: 48px;
  object-fit: cover;
  flex-shrink: 0;
  display: ${(p) => (p.$loaded ? "block" : "none")};
`;

const SongName = styled.h3`
  font-size: 0.9rem;
  font-weight: 700;
  color: #eff8f2;
`;

const SongDetail = styled.h4`
  font-size: 0.75rem;
  color: rgba(202, 214, 205, 0.72);
`;

export default LibrarySong;
