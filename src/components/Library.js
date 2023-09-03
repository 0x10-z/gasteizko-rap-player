import { useState } from "react";
import React from "react";
import LibrarySong from "./LibrarySong";
import styled from "styled-components";

const Library = ({
  songs,
  currentSong,
  setCurrentSong,
  audioRef,
  isPlaying,
  setSongs,
  libraryStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSongs = songs.filter((song) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      song.name.toLowerCase().includes(searchTermLower) ||
      song.artist.toLowerCase().includes(searchTermLower) ||
      song.album.toLowerCase().includes(searchTermLower)
    );
  });
  return (
    <LibraryContainer $libraryStatus={libraryStatus}>
      <H1>Tracklist</H1>
      <SearchInput
        type="text"
        placeholder="Busca un tema..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <SongContainer>
        {filteredSongs.map((song) => (
          <LibrarySong
            song={song}
            songs={songs}
            setCurrentSong={setCurrentSong}
            key={song.id}
            audioRef={audioRef}
            isPlaying={isPlaying}
            setSongs={setSongs}
          />
        ))}
      </SongContainer>
    </LibraryContainer>
  );
};
const LibraryContainer = styled.div`
  position: fixed;
  z-index: 9;
  top: 0;
  left: 0;
  width: 20rem;
  height: 100%;
  background-color: white;
  box-shadow: 2px 2px 50px rgb(204, 204, 204);
  user-select: none;
  overflow: scroll;
  transform: translateX(${(p) => (p.$libraryStatus ? "0%" : "-100%")});
  transition: all 0.5s ease;
  opacity: ${(p) => (p.$libraryStatus ? "100" : "0")};
  scrollbar-width: thin;
  scrollbar-color: rgba(155, 155, 155, 0.5) tranparent;
  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(155, 155, 155, 0.5);
    border-radius: 20px;
    border: transparent;
  }
  @media screen and (max-width: 768px) {
    width: 100%;
    z-index: 9;
  }
`;

const SongContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
`;

const H1 = styled.h2`
  padding: 2rem;
`;

const SearchInput = styled.input`
  width: 90%;
  padding: 0.5rem 1rem;
  margin: 0 auto 1rem 1rem;
  border: 1px solid rgba(155, 155, 155, 0.5);
  border-radius: 5px;
  outline: none;
  position: sticky; // Añade esta línea
  top: 2rem; // Añade esta línea
  background-color: white; // Añade esta línea para asegurarte de que el fondo sea opaco
  z-index: 10; // Añade esta línea para asegurarte de que el input esté por encima de otros elementos
  &:focus {
    border-color: rgba(155, 155, 155, 0.8);
  }

  @media screen and (max-width: 768px) {
    top: 1.1rem; // Añade esta línea
    width: 65%;
  }
`;

export default Library;
