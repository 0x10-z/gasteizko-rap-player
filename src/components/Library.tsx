import { useState, useRef, useEffect, useMemo, forwardRef, memo } from "react";
import LibrarySong from "./LibrarySong";
import styled from "styled-components";
import { SongType } from "../types/models";
import { isMobileDevice } from "../utils";

type LibraryProps = {
  songs: SongType[];
  setCurrentSong: (song: SongType) => void;
  setSongs: (songs: SongType[]) => void;
  setLibraryStatus: (status: boolean) => void;
  libraryStatus: boolean;
};

type AlbumGroup = {
  key: string;
  album: string;
  artist: string;
  cover: string;
  songs: SongType[];
  hasActiveSong: boolean;
};

const Library = forwardRef<HTMLDivElement, LibraryProps>(
  (
    { songs, setCurrentSong, setSongs, setLibraryStatus, libraryStatus },
    ref,
  ) => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedAlbumKey, setSelectedAlbumKey] = useState<string>("");
    const shouldRenderContent = libraryStatus || searchTerm.trim().length > 0;

    const filteredSongs = useMemo(
      () =>
        songs.filter((song: SongType) => {
          const searchTermLower = searchTerm.toLowerCase();
          return (
            song.name.toLowerCase().includes(searchTermLower) ||
            song.artist.toLowerCase().includes(searchTermLower) ||
            song.album.toLowerCase().includes(searchTermLower)
          );
        }),
      [songs, searchTerm],
    );

    const inputRef = useRef<HTMLInputElement>(null);

    const albums = useMemo<AlbumGroup[]>(() => {
      const groupedAlbums = new Map<string, AlbumGroup>();

      filteredSongs.forEach((song) => {
        const key = `${song.album}__${song.cover}`;
        const existingAlbum = groupedAlbums.get(key);

        if (existingAlbum) {
          existingAlbum.songs.push(song);
          if (song.active) {
            existingAlbum.hasActiveSong = true;
          }
          return;
        }

        groupedAlbums.set(key, {
          key,
          album: song.album,
          artist: song.artist,
          cover: song.cover,
          songs: [song],
          hasActiveSong: song.active,
        });
      });

      return Array.from(groupedAlbums.values()).sort((left, right) => {
        if (left.hasActiveSong !== right.hasActiveSong) {
          return left.hasActiveSong ? -1 : 1;
        }

        return left.album.localeCompare(right.album, "es", {
          sensitivity: "base",
        });
      });
    }, [filteredSongs]);

    const selectedAlbum = useMemo(
      () => albums.find((album) => album.key === selectedAlbumKey) ?? null,
      [albums, selectedAlbumKey],
    );

    useEffect(() => {
      if (libraryStatus) {
        if (inputRef.current && !isMobileDevice()) {
          inputRef.current.focus();
        }
      }
    }, [libraryStatus]);

    useEffect(() => {
      if (albums.length === 0) {
        if (selectedAlbumKey) {
          setSelectedAlbumKey("");
        }
        return;
      }

      const selectedAlbumStillExists = albums.some(
        (album) => album.key === selectedAlbumKey,
      );
      if (!selectedAlbumStillExists) {
        setSelectedAlbumKey("");
      }
    }, [albums, selectedAlbumKey]);

    return (
      <LibraryContainer
        ref={ref}
        $libraryStatus={libraryStatus}
        onClick={(e) => e.stopPropagation()}>
        <Header>
          <HeaderTitle>Coleccion</HeaderTitle>
          <SongCount>{albums.length} discos</SongCount>
        </Header>
        <StickyHeader>
          <SearchInput
            type="text"
            placeholder="Busca un tema o disco..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            ref={inputRef}
          />
          <CloseButton
            onClick={() => setLibraryStatus(false)}
            aria-label="Cerrar tracklist">
            <CloseIcon>&times;</CloseIcon>
          </CloseButton>
        </StickyHeader>
        <SongContainer>
          {!shouldRenderContent ? (
            <EmptyState>
              <SectionTitle>Abre la coleccion</SectionTitle>
              <SectionMeta>
                Un mosaico de caratulas para navegar por discos y temas.
              </SectionMeta>
            </EmptyState>
          ) : albums.length > 0 ? (
            <LibraryContent>
              {selectedAlbum ? (
                <Section>
                  <SelectedAlbumHeader>
                    <BackButton
                      type="button"
                      onClick={() => setSelectedAlbumKey("")}
                      aria-label="Volver al mosaico">
                      <BackIcon aria-hidden="true">&larr;</BackIcon>
                      Volver
                    </BackButton>
                    <SelectedAlbumCover
                      src={selectedAlbum.cover}
                      alt={selectedAlbum.album}
                    />
                    <SelectedAlbumInfo>
                      <SectionTitle>{selectedAlbum.album}</SectionTitle>
                      <SectionMeta>
                        {selectedAlbum.songs.length} cortes disponibles
                      </SectionMeta>
                    </SelectedAlbumInfo>
                  </SelectedAlbumHeader>
                  <SelectedSongs>
                    {selectedAlbum.songs.map((song) => (
                      <LibrarySong
                        key={song.id}
                        song={song}
                        songs={songs}
                        setCurrentSong={setCurrentSong}
                        setSongs={setSongs}
                      />
                    ))}
                  </SelectedSongs>
                </Section>
              ) : (
                <Section>
                  <SectionHeader>
                    <SectionTitle>Mosaico</SectionTitle>
                    <SectionMeta>
                      {filteredSongs.length} temas filtrados
                    </SectionMeta>
                  </SectionHeader>
                  <AlbumGrid>
                    {albums.map((album) => (
                      <AlbumCard
                        key={album.key}
                        type="button"
                        onClick={() => setSelectedAlbumKey(album.key)}
                        $isSelected={false}
                        $isActive={album.hasActiveSong}>
                        <AlbumCover
                          src={album.cover}
                          alt={album.album}
                          loading="lazy"
                        />
                        <AlbumCardBody>
                          <AlbumTitle>{album.album}</AlbumTitle>
                          <AlbumArtist>{album.artist}</AlbumArtist>
                          <AlbumMeta>
                            {album.songs.length} tema
                            {album.songs.length === 1 ? "" : "s"}
                          </AlbumMeta>
                        </AlbumCardBody>
                      </AlbumCard>
                    ))}
                  </AlbumGrid>
                </Section>
              )}
            </LibraryContent>
          ) : (
            <EmptyState>
              <SectionTitle>No hay resultados</SectionTitle>
              <SectionMeta>
                Prueba con otro nombre de tema, artista o disco.
              </SectionMeta>
            </EmptyState>
          )}
        </SongContainer>
      </LibraryContainer>
    );
  },
);

const LibraryContainer = styled.div<{ $libraryStatus: boolean }>`
  display: flex;
  flex-direction: column;
  position: fixed;
  z-index: 99;
  top: 0;
  left: 0;
  width: min(30rem, 100vw);
  height: 100%;
  background: linear-gradient(
    180deg,
    rgba(9, 14, 17, 0.96),
    rgba(6, 10, 12, 0.98)
  );
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 20px 0 50px rgba(0, 0, 0, 0.28);
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
  padding-bottom: 1.5rem;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.14) transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.12);
    border-radius: 20px;
  }
`;

const LibraryContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 0 1rem;
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 0.75rem;
  padding: 0 0.25rem;
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #eff8f2;
`;

const SectionMeta = styled.span`
  font-size: 0.78rem;
  color: rgba(197, 214, 203, 0.62);
`;

const AlbumGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.9rem;

  @media screen and (max-width: 420px) {
    grid-template-columns: 1fr;
  }
`;

const AlbumCard = styled.button<{ $isSelected: boolean; $isActive: boolean }>`
  border: 1px solid
    ${(p) => (p.$isSelected ? "rgba(0, 0, 0, 0.18)" : "rgba(0, 0, 0, 0.06)")};
  background: ${(p) =>
    p.$isSelected
      ? "linear-gradient(180deg, rgba(31, 41, 36, 0.98), rgba(17, 24, 21, 0.98))"
      : "rgba(255, 255, 255, 0.03)"};
  border-radius: 18px;
  padding: 0;
  overflow: hidden;
  cursor: pointer;
  text-align: left;
  box-shadow: ${(p) =>
    p.$isSelected
      ? "0 18px 42px rgba(0, 0, 0, 0.22)"
      : "0 10px 24px rgba(0, 0, 0, 0.12)"};
  transform: translateY(0);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    border: ${(p) =>
      p.$isActive
        ? "1px solid rgba(29, 185, 84, 0.45)"
        : "1px solid transparent"};
    border-radius: 18px;
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 18px 36px rgba(0, 0, 0, 0.24);
  }
`;

const AlbumCover = styled.img`
  display: block;
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  background: rgba(255, 255, 255, 0.06);
`;

const AlbumCardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: 0.85rem 0.9rem 1rem;
`;

const AlbumTitle = styled.h4`
  font-size: 0.92rem;
  font-weight: 700;
  color: #f0f9f2;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const AlbumArtist = styled.p`
  font-size: 0.78rem;
  color: rgba(203, 215, 206, 0.72);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const AlbumMeta = styled.span`
  font-size: 0.75rem;
  color: rgba(184, 198, 188, 0.58);
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
  color: #f4fbf6;
`;

const SongCount = styled.span`
  font-size: 0.8rem;
  color: rgba(197, 214, 203, 0.62);
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
  background: linear-gradient(
    180deg,
    rgba(9, 14, 17, 0.98),
    rgba(9, 14, 17, 0.82)
  );
  backdrop-filter: blur(16px);
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.6rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  color: #eef8f1;
  font-size: 0.9rem;
  font-family: inherit;
  transition: all 0.2s ease;
  outline: none;

  &::placeholder {
    color: rgba(189, 203, 193, 0.52);
  }

  &:focus {
    border-color: rgba(29, 185, 84, 0.4);
    background: rgba(255, 255, 255, 0.08);
  }
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.06);
  border: none;
  cursor: pointer;
  color: rgba(231, 242, 234, 0.72);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    color: #ffffff;
  }
`;

const CloseIcon = styled.span`
  font-size: 1.4rem;
  line-height: 1;
`;

const SelectedAlbumHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.9rem;
  padding: 0 0.25rem;
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  min-height: 2.35rem;
  padding: 0.55rem 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.05);
  color: #eef8f1;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    transform 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
  }
`;

const BackIcon = styled.span`
  font-size: 1rem;
  line-height: 1;
`;

const SelectedAlbumCover = styled.img`
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 16px;
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.28);
`;

const SelectedAlbumInfo = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

const SelectedSongs = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 18px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
`;

const EmptyState = styled.div`
  min-height: 12rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 0.35rem;
  padding: 0 1.25rem;
  color: #eef8f1;
`;

export default memo(Library);
