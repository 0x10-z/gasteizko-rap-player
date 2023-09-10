import { useState, useRef, useEffect, forwardRef } from "react";
import React from "react";
import LibrarySong from "./LibrarySong";
import styled from "styled-components";
import { List, AutoSizer, ListRowProps } from "react-virtualized";
import { SongType } from "../types/models";
import { isMobileDevice } from "../utils";

type LibraryProps = {
  songs: SongType[];
  setCurrentSong: (song: SongType) => void;
  audioRef: React.RefObject<HTMLAudioElement>;
  isPlaying: boolean;
  setSongs: (songs: SongType[]) => void;
  setLibraryStatus: (status: boolean) => void;
  libraryStatus: boolean;
  [x: string]: any;
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
      ...rest
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
        if (inputRef.current && !isMobileDevice()) {
          inputRef.current.focus();
        }
      }
    }, [libraryStatus, filteredSongs]);

    const rowRenderer = ({ index, key, style }: ListRowProps) => {
      const song = filteredSongs[index];
      return (
        <div key={key} style={{ ...style, cursor: "pointer" }}>
          <LibrarySong
            song={song}
            songs={songs}
            setCurrentSong={setCurrentSong}
            audioRef={audioRef}
            isPlaying={isPlaying}
            setSongs={setSongs}
          />
        </div>
      );
    };

    return (
      <LibraryContainer
        ref={ref}
        $libraryStatus={libraryStatus}
        onClick={(e) => e.stopPropagation()}
        {...rest}
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
                width={width}
                height={height}
                rowCount={filteredSongs.length}
                rowHeight={100}
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
