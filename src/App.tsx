import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import "./App.css";
import Player from "./components/Player";
import Song from "./components/Song";
import Library from "./components/Library";
import About from "./components/About";
import Nav from "./components/Nav";
import Credit from "./components/Credit";
import HelpModal from "./components/HelpModal";
import tracklist from "./tracklist.json";
import { SongChangeProvider } from "./contexts/SongChangeProvider";
import { useAudioPlayer } from "./contexts/AudioPlayerContext";
import { prettifyString, getAudioSrc } from "./utils";
import { SongType, SongInfoType } from "./types/models";

const App = () => {
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;

  const location = useLocation();

  const { audioRef, isPlaying, play, pause } = useAudioPlayer();

  // Refs
  const libraryRef = useRef<HTMLDivElement | null>(null);
  const aboutRef = useRef<HTMLDivElement | null>(null);

  // State Initialization
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] =
    useState<boolean>(false);
  const [songs, setSongs] = useState<SongType[]>(tracklist);
  const [currentSong, setCurrentSong] = useState<SongType | null>(null);

  const [libraryStatus, setLibraryStatus] = useState<boolean>(false);
  const [aboutStatus, setAboutStatus] = useState<boolean>(false);
  const [songInfo, setSongInfo] = useState<SongInfoType>({
    currentTime: 0,
    duration: 0,
  });

  // Helper Functions
  const updateActiveSongs = useCallback(
    async (nextSong: SongType) => {
      setCurrentSong(nextSong);

      const newSongs = songs.map((song) => {
        if (song.id === nextSong.id) {
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
    [songs],
  );

  // Event Handlers
  const updateTimeHandler = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    const target = e.currentTarget;
    const currentTime = target.currentTime;
    const duration = target.duration;
    setSongInfo({ ...songInfo, currentTime, duration });
  };

  const songEndHandler = async () => {
    if (currentSong) {
      const currentIndex = songs.findIndex(
        (song) => song.id === currentSong.id,
      );
      const nextSong = songs[(currentIndex + 1) % songs.length];
      await updateActiveSongs(nextSong);
      if (isPlaying) {
        play();
      }
    }
  };

  const handleClickOutsideDOM = useCallback(
    (event: MouseEvent) => {
      if (
        libraryStatus &&
        libraryRef.current &&
        !libraryRef.current.contains(event.target as Node)
      ) {
        setLibraryStatus(false);
      }
      if (
        aboutStatus &&
        aboutRef.current &&
        !aboutRef.current.contains(event.target as Node)
      ) {
        setAboutStatus(false);
      }
    },
    [aboutStatus, libraryStatus],
  );

  const handleClickOutsideReact: React.MouseEventHandler<HTMLDivElement> = (
    event,
  ) => {
    handleClickOutsideDOM(event.nativeEvent);
  };

  // Effects
  useEffect(() => {
    function determineInitialSong() {
      const extractArtistAndNameFromURL = (url: string) => {
        const parts = url.split("@");
        if (parts.length < 2) return null;
        return {
          artist: prettifyString(parts[0]),
          name: prettifyString(parts[1]),
        };
      };

      const setActiveAndReturn = (song: SongType) => {
        song.active = true;
        return song;
      };

      const extractedData = extractArtistAndNameFromURL(
        location.pathname.substring(1),
      );

      if (extractedData) {
        const { artist, name } = extractedData;
        const songFromURL = songs.find(
          (song) =>
            prettifyString(song.artist) === artist &&
            prettifyString(song.name) === name,
        );

        if (songFromURL) {
          return setActiveAndReturn(songFromURL);
        }
      }

      return setActiveAndReturn(
        songs[Math.floor(Math.random() * songs.length)],
      );
    }

    if (!currentSong) {
      setCurrentSong(determineInitialSong());
    }
  }, [currentSong, location.pathname, songs]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideDOM);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideDOM);
    };
  }, [handleClickOutsideDOM]);

  const changeSong = useCallback(
    async (direction: "forward" | "backward") => {
      if (currentSong) {
        const currentIndex = songs.findIndex(
          (song) => song.id === currentSong.id,
        );
        let nextIndex;

        if (direction === "forward") {
          nextIndex = (currentIndex + 1) % songs.length;
        } else {
          nextIndex = (currentIndex - 1 + songs.length) % songs.length;
        }

        const nextSong = songs[nextIndex];
        updateActiveSongs(nextSong);

        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.src = getAudioSrc(nextSong);

          setTimeout(() => {
            play();
          }, 100);
        }
      }
    },
    [songs, currentSong, audioRef, updateActiveSongs, play],
  );

  useEffect(() => {
    if (currentSong) {
      navigateRef.current(
        `/${prettifyString(currentSong.artist)}@${prettifyString(
          currentSong.name,
        )}`,
      );
    }
    function updateMediaSession() {
      if (currentSong) {
        if ("mediaSession" in navigator) {
          navigator.mediaSession.metadata = new MediaMetadata({
            title: currentSong.name,
            artist: currentSong.artist,
            album: currentSong.album,
            artwork: [
              { src: currentSong.cover, sizes: "128x128", type: "image/webp" },
            ],
          });
          navigator.mediaSession.setActionHandler("play", () => {
            play();
          });
          navigator.mediaSession.setActionHandler("pause", () => {
            pause();
          });
          navigator.mediaSession.setActionHandler("previoustrack", () => {
            changeSong("backward");
          });
          navigator.mediaSession.setActionHandler("nexttrack", () => {
            changeSong("forward");
          });
        }
      }
    }

    updateMediaSession();
  }, [currentSong, changeSong, play, pause]);

  // Render
  return (
    <SongChangeProvider changeSong={changeSong}>
      {currentSong && (
        <>
          {(() => {
            const currentAlbumSongs = songs.filter(
              (song) =>
                song.album === currentSong.album && song.cover === currentSong.cover,
            );
            const currentAlbumSongIndex = currentAlbumSongs.findIndex(
              (song) => song.id === currentSong.id,
            );

            return (
          <AppContainer
            $backgroundImage={currentSong.cover}
            $colorA={currentSong.color[0] || "#1db954"}
            $colorB={currentSong.color[1] || currentSong.color[0] || "#15803d"}
            $colorC={currentSong.color[2] || currentSong.color[1] || "#d9f99d"}
            onClick={handleClickOutsideReact}>
            <Nav
              libraryStatus={libraryStatus}
              aboutStatus={aboutStatus}
              setLibraryStatus={setLibraryStatus}
            />
            <MainStage>
              <Song currentSong={currentSong} isPlaying={isPlaying} />
              <Player
                currentSong={currentSong}
                currentSongIndex={currentAlbumSongIndex}
                totalSongs={currentAlbumSongs.length}
                songInfo={songInfo}
                setSongInfo={setSongInfo}
                setIsShortcutsModalOpen={setIsShortcutsModalOpen}
              />
            </MainStage>
            <Credit
              songsNumber={songs.length}
              aboutStatus={aboutStatus}
              setAboutStatus={setAboutStatus}
              libraryStatus={libraryStatus}
            />
            <audio
              onLoadedMetadata={updateTimeHandler}
              onTimeUpdate={updateTimeHandler}
              onEnded={songEndHandler}
              onCanPlayThrough={() => {
                if (isPlaying) {
                  play();
                }
              }}
              ref={audioRef as React.RefObject<HTMLAudioElement>}
              src={getAudioSrc(currentSong)}
            />
          </AppContainer>
            );
          })()}
          <Library
            ref={libraryRef}
            songs={songs}
            setCurrentSong={setCurrentSong}
            setSongs={setSongs}
            setLibraryStatus={setLibraryStatus}
            libraryStatus={libraryStatus}
          />
          <About
            ref={aboutRef}
            aboutStatus={aboutStatus}
            setAboutStatus={setAboutStatus}
          />
          <HelpModal
            isOpen={isShortcutsModalOpen}
            onClose={() => setIsShortcutsModalOpen(false)}
          />
        </>
      )}
    </SongChangeProvider>
  );
};

const AppContainer = styled.div<{
  $backgroundImage: string;
  $colorA: string;
  $colorB: string;
  $colorC: string;
}>`
  height: 100dvh;
  min-height: 100dvh;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 1.25rem 1.25rem 0;
  background:
    radial-gradient(
      circle at 15% 20%,
      ${(p) => `${p.$colorA}44`},
      transparent 30%
    ),
    radial-gradient(
      circle at 85% 18%,
      ${(p) => `${p.$colorB}33`},
      transparent 28%
    ),
    linear-gradient(160deg, #06090b 0%, #0b1014 45%, #10181d 100%);

  &::before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background-image: url(${(p) => p.$backgroundImage});
    background-size: cover;
    background-position: center;
    filter: blur(120px) saturate(1.4) brightness(0.55);
    opacity: 0.18;
    transition: background-image 0.8s ease;
    z-index: 0;
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(180deg, rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.42)),
      radial-gradient(
        circle at top,
        ${(p) => `${p.$colorC}14`},
        transparent 35%
      );
    pointer-events: none;
    z-index: 0;
  }

  & > * {
    position: relative;
    z-index: 1;
  }

  @media screen and (max-width: 768px) {
    padding: 3.5rem 1rem 0;
  }
`;

const MainStage = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 1.5rem;
  padding: 1rem 0 7rem;
  min-height: 0;
  width: 100%;

  @media screen and (max-width: 768px) {
    gap: 1.25rem;
    padding: 0.5rem 0 7.5rem;
  }

  @media screen and (max-height: 860px) {
    gap: 1rem;
    padding: 0.5rem 0 6.5rem;
  }

  @media screen and (max-height: 760px) {
    gap: 0.75rem;
    padding: 0.25rem 0 6rem;
  }
`;

export default App;
