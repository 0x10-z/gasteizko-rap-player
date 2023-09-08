import { useState, useRef, useEffect, forwardRef } from "react";
import React from "react";
import LibrarySong from "./LibrarySong";
import styled from "styled-components";
import { List, AutoSizer, ListRowProps } from "react-virtualized";
import { SongType } from "../App";

type LibraryProps = {
  songs: SongType[];
  setCurrentSong: (song: SongType) => void;
  audioRef: React.RefObject<HTMLAudioElement>;
  isPlaying: boolean;
  setSongs: (songs: SongType[]) => void;
  setLibraryStatus: (status: boolean) => void;
  libraryStatus: boolean;
};

const Library = forwardRef<HTMLDivElement, LibraryProps>(
  (
    {
      songs,
      setCurrentSong,
      audioRef,
      isPlaying,
      setSongs,
      setLibraryStatus,
      libraryStatus,
    },
    ref
  ) => {
    const [searchTerm, setSearchTerm] = useState<string>("");

    const filteredSongs = songs.filter((song) => {
      const searchTermLower = searchTerm.toLowerCase();
      return (
        song.name.toLowerCase().includes(searchTermLower) ||
        song.artist.toLowerCase().includes(searchTermLower) ||
        song.album.toLowerCase().includes(searchTermLower)
      );
    });

    const inputRef = useRef<HTMLInputElement>(null);
    const [currentSongIndex, setCurrentSongIndex] = useState<number>(
      filteredSongs.findIndex((song) => song.active)
    );

    useEffect(() => {
      if (libraryStatus) {
        setCurrentSongIndex(filteredSongs.findIndex((song) => song.active));
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    }, [libraryStatus, filteredSongs]);

    const groupByAlbum = (
      songs: SongType[]
    ): { [album: string]: SongType[] } => {
      return songs.reduce((acc, song) => {
        if (!acc[song.album]) {
          acc[song.album] = [];
        }
        acc[song.album].push(song);
        return acc;
      }, {} as { [album: string]: SongType[] });
    };
    const listRef = useRef<List>(null);

    const albums = groupByAlbum(filteredSongs);

    const rowRenderer = ({ index, key, style }: ListRowProps) => {
      const albumName = Object.keys(albums)[index];
      const albumSongs = albums[albumName];
      const albumCover = albumSongs[0]?.cover; // Tomando la carátula de la primera canción
      const uniqueKey = `${albumName}-${albumSongs
        .map((song) => song.id)
        .join("-")}`;

      return (
        <div key={uniqueKey} style={{ ...style, cursor: "pointer" }}>
          <AlbumTitle>{albumName}</AlbumTitle>
          <AlbumCoverWrapper>
            <AlbumCover src={albumCover} alt={`${albumName} cover`} />
          </AlbumCoverWrapper>
          {/* Renderiza la carátula */}
          {/* Puedes estilizar este título como quieras */}
          {albumSongs.map((song) => (
            <LibrarySong
              key={song.id}
              song={song}
              songs={songs}
              setCurrentSong={setCurrentSong}
              audioRef={audioRef}
              isPlaying={isPlaying}
              setSongs={setSongs}
            />
          ))}
        </div>
      );
    };
    if (listRef.current) {
      listRef.current.forceUpdateGrid();
    }
    return (
      <LibraryContainer
        ref={ref}
        $libraryStatus={libraryStatus}
        onClick={(e) => e.stopPropagation()}
      >
        <H1>Tracklist</H1>
        <StickyHeader>
          <SearchInput
            type="text"
            placeholder="Busca un tema..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            ref={inputRef}
          />
          <CloseButton onClick={() => setLibraryStatus(false)}>X</CloseButton>
        </StickyHeader>
        <SongContainer>
          <AutoSizer>
            {({ height, width }: { height: number; width: number }) => (
              <StyledList
                ref={listRef}
                width={width}
                height={height}
                rowCount={Object.keys(albums).length}
                rowHeight={({ index }: { index: number }) => {
                  const albumName = Object.keys(albums)[index];
                  const albumSongs = albums[albumName];
                  return 100 + albumSongs.length * 80; // 100 para la carátula, 50 para el título del álbum, y 100 para cada canción
                }}
                rowRenderer={rowRenderer}
                scrollToIndex={currentSongIndex}
              />
            )}
          </AutoSizer>
        </SongContainer>
      </LibraryContainer>
    );
  }
);

const AlbumCover = styled.img`
  display: block;
  max-width: 100%;
  max-height: 150%;
  object-fit: cover;
  transition: transform 0.3s ease;
  transform: translate(-50%, -50%) scale(1.6);
  position: absolute;
  top: 50%;
  left: 50%;
`;

const AlbumCoverWrapper = styled.div`
  width: 100%;
  height: 100px;
  overflow: hidden;
  border-radius: 10px;
  position: relative;

  &:hover ${AlbumCover} {
    transform: translate(-50%, -50%) scale(0.7);
  }
`;

const AlbumTitle = styled.h2`
  padding: 0.5rem 1rem;
  background-color: #f3f4f6; /* Un gris claro */
  color: #333; /* Casi negro */
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid #e0e0e0; /* Un borde sutil en la parte inferior para separar del contenido */
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #e0e0e0; /* Cambia el color de fondo al pasar el cursor por encima */
  }
`;

const StyledList = styled(List)`
  scrollbar-width: thin;
  scrollbar-color: rgba(155, 155, 155, 0.5) transparent;

  &::-webkit-scrollbar {
    width: 15px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(155, 155, 155, 0.5);
    border-radius: 20px;
    border: transparent;
  }
`;

const LibraryContainer = styled.div<{ $libraryStatus: boolean }>`
  display: flex;
  flex-direction: column;
  position: fixed;
  z-index: 99;
  top: 0;
  left: 0;
  width: 20rem;
  height: 100%;
  background-color: white;
  box-shadow: 2px 2px 50px rgb(204, 204, 204);
  transform: translateX(${(p) => (p.$libraryStatus ? "0%" : "-100%")});
  transition: all 0.5s ease;
  opacity: ${(p) => (p.$libraryStatus ? "100" : "0")};
  @media screen and (max-width: 768px) {
    width: 100%;
  }
`;

const SongContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  background-color: white;
`;

const H1 = styled.h2`
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
`;

const StickyHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 10;
  padding: 0.5rem 1rem;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.5rem;
  margin-right: 1rem;
  border: 1px solid rgba(155, 155, 155, 0.5);
  border-radius: 5px;
  &:focus {
    border-color: rgba(155, 155, 155, 0.8);
  }
`;

const CloseButton = styled.button`
  background-color: rgba(0, 0, 0, 0.7);
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: white;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 1);
  }
`;

export default React.memo(Library);
