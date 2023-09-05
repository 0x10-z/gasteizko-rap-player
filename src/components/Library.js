import { useState, useRef, useEffect, forwardRef } from "react";
import React from "react";
import LibrarySong from "./LibrarySong";
import styled from "styled-components";
import { List, AutoSizer } from "react-virtualized";

const Library = forwardRef(
  (
    {
      songs,
      currentSong,
      setCurrentSong,
      audioRef,
      isPlaying,
      setSongs,
      setLibraryStatus,
      libraryStatus,
    },
    ref
  ) => {
    const [searchTerm, setSearchTerm] = useState("");
    const inputRef = useRef(null); // Crea la referencia

    const filteredSongs = songs.filter((song) => {
      const searchTermLower = searchTerm.toLowerCase();
      return (
        song.name.toLowerCase().includes(searchTermLower) ||
        song.artist.toLowerCase().includes(searchTermLower) ||
        song.album.toLowerCase().includes(searchTermLower)
      );
    });

    useEffect(() => {
      if (libraryStatus && inputRef.current) {
        inputRef.current.focus(); // Establece el foco en el input cuando libraryStatus es true
      }
    }, [libraryStatus]);

    const rowRenderer = ({ index, key, style }) => {
      const song = filteredSongs[index];
      return (
        <div key={key} style={style}>
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

    const componentSize = 100;
    const totalHeight = filteredSongs.length * componentSize;
    console.log(totalHeight);
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
          <CloseButton
            $libraryStatus={libraryStatus}
            onClick={() => setLibraryStatus(false)}
          >
            X
          </CloseButton>
        </StickyHeader>
        <SongContainer $totalHeight={totalHeight}>
          <AutoSizer>
            {({ height, width }) => (
              <StyledList
                width={width}
                height={height}
                rowCount={filteredSongs.length}
                rowHeight={100}
                rowRenderer={rowRenderer}
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

const LibraryContainer = styled.div`
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
export default Library;
