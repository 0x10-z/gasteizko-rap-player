import { useState, useRef, useEffect, forwardRef, useCallback } from "react";
import React from "react";
import LibrarySong from "./LibrarySong";
import styled from "styled-components";
import { useVirtualizer } from "@tanstack/react-virtual";
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

    const filteredSongs = songs.filter((song: SongType) => {
      const searchTermLower = searchTerm.toLowerCase();
      return (
        song.name.toLowerCase().includes(searchTermLower) ||
        song.artist.toLowerCase().includes(searchTermLower) ||
        song.album.toLowerCase().includes(searchTermLower)
      );
    });

    const inputRef = useRef<HTMLInputElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const virtualizer = useVirtualizer({
      count: filteredSongs.length,
      getScrollElement: () => scrollContainerRef.current,
      estimateSize: useCallback(() => 80, []),
      overscan: 5,
    });

    useEffect(() => {
      if (libraryStatus) {
        const activeIndex = filteredSongs.findIndex(
          (song: SongType) => song.active
        );
        if (activeIndex >= 0) {
          virtualizer.scrollToIndex(activeIndex, { align: "center" });
        }
        if (inputRef.current && !isMobileDevice()) {
          inputRef.current.focus();
        }
      }
    }, [libraryStatus, filteredSongs, virtualizer]);

    return (
      <LibraryContainer
        ref={ref}
        $libraryStatus={libraryStatus}
        onClick={(e) => e.stopPropagation()}
        {...rest}
      >
        <Header>
          <HeaderTitle>Tracklist</HeaderTitle>
          <SongCount>{filteredSongs.length} temas</SongCount>
        </Header>
        <StickyHeader>
          <SearchInput
            type="text"
            placeholder="Busca un tema..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            ref={inputRef}
          />
          <CloseButton onClick={() => setLibraryStatus(false)}>
            <CloseIcon>&times;</CloseIcon>
          </CloseButton>
        </StickyHeader>
        <SongContainer ref={scrollContainerRef}>
          <VirtualList $height={virtualizer.getTotalSize()}>
            {virtualizer.getVirtualItems().map((virtualRow) => {
              const song = filteredSongs[virtualRow.index];
              return (
                <VirtualRow
                  key={virtualRow.key}
                  $start={virtualRow.start}
                  $size={virtualRow.size}
                >
                  <LibrarySong
                    song={song}
                    songs={songs}
                    setCurrentSong={setCurrentSong}
                    audioRef={audioRef}
                    isPlaying={isPlaying}
                    setSongs={setSongs}
                  />
                </VirtualRow>
              );
            })}
          </VirtualList>
        </SongContainer>
      </LibraryContainer>
    );
  }
);

const LibraryContainer = styled.div<{ $libraryStatus: boolean }>`
  display: flex;
  flex-direction: column;
  position: fixed;
  z-index: 99;
  top: 0;
  left: 0;
  width: 22rem;
  height: 100%;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  border-right: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.08);
  transform: translateX(${(p) => (p.$libraryStatus ? "0%" : "-100%")});
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: ${(p) => (p.$libraryStatus ? "1" : "0")};
  @media screen and (max-width: 768px) {
    width: 100%;
  }
`;

const SongContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.15) transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.12);
    border-radius: 20px;
  }
`;

const VirtualList = styled.div<{ $height: number }>`
  height: ${(p) => p.$height}px;
  width: 100%;
  position: relative;
`;

const VirtualRow = styled.div<{ $start: number; $size: number }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: ${(p) => p.$size}px;
  transform: translateY(${(p) => p.$start}px);
  cursor: pointer;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 1.25rem 1.25rem 0.75rem;
`;

const HeaderTitle = styled.h2`
  font-size: 1.4rem;
  font-weight: 700;
  color: rgb(30, 30, 30);
`;

const SongCount = styled.span`
  font-size: 0.8rem;
  color: rgb(155, 155, 155);
`;

const StickyHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 10;
  padding: 0 1.25rem 1rem;
  gap: 0.75rem;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.6rem 1rem;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.03);
  color: rgb(30, 30, 30);
  font-size: 0.9rem;
  font-family: inherit;
  transition: all 0.2s ease;
  outline: none;

  &::placeholder {
    color: rgb(180, 180, 180);
  }

  &:focus {
    border-color: rgba(0, 0, 0, 0.2);
    background: rgba(0, 0, 0, 0.05);
  }
`;

const CloseButton = styled.button`
  background: rgba(0, 0, 0, 0.06);
  border: none;
  cursor: pointer;
  color: rgb(120, 120, 120);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: rgba(0, 0, 0, 0.12);
    color: rgb(30, 30, 30);
  }
`;

const CloseIcon = styled.span`
  font-size: 1.4rem;
  line-height: 1;
`;

export default React.memo(Library);
