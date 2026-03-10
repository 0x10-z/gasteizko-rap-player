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
import { customToast } from "./components/CustomToast";
import { prettifyString, getAudioSrc } from "./utils";
import { SongType, SongInfoType } from "./types/models";

const App: React.FC = () => {
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;

  const location = useLocation();

  const { audioRef, isPlaying, play, pause, setIsPlaying } = useAudioPlayer();

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
    [songs]
  );

  // Event Handlers
  const updateTimeHandler = (
    e: React.SyntheticEvent<HTMLAudioElement, Event>
  ) => {
    const target = e.currentTarget;
    const currentTime = target.currentTime;
    const duration = target.duration;
    setSongInfo({ ...songInfo, currentTime, duration });
  };

  const songEndHandler = async () => {
    if (currentSong) {
      const currentIndex = songs.findIndex((song) => song.id === currentSong.id);
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
    [aboutStatus, libraryStatus]
  );

  const handleClickOutsideReact: React.MouseEventHandler<HTMLDivElement> = (
    event
  ) => {
    handleClickOutsideDOM(event as unknown as MouseEvent);
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
        location.pathname.substring(1)
      );

      if (extractedData) {
        const { artist, name } = extractedData;
        const songFromURL = songs.find(
          (song) =>
            prettifyString(song.artist) === artist &&
            prettifyString(song.name) === name
        );

        if (songFromURL) {
          return setActiveAndReturn(songFromURL);
        }
      }

      return setActiveAndReturn(
        songs[Math.floor(Math.random() * songs.length)]
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
          (song) => song.id === currentSong.id
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
          pause();

          audioRef.current.src = getAudioSrc(nextSong);

          setTimeout(() => {
            if (audioRef.current) {
              const promise = audioRef.current.play();
              if (promise !== undefined) {
                promise.catch((error) => {
                  if (error.name !== "AbortError") {
                    customToast.error("Upss! algo está pasando.", {
                      trace: error.toString(),
                    });
                  }
                  setIsPlaying(false);
                });
              }
            }
          }, 100);
        }
      }
    },
    [songs, currentSong, audioRef, updateActiveSongs, pause, setIsPlaying]
  );

  useEffect(() => {
    if (currentSong) {
      navigateRef.current(
        `/${prettifyString(currentSong.artist)}@${prettifyString(
          currentSong.name
        )}`
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
        <AppContainer
          $backgroundImage={currentSong.cover}
          onClick={handleClickOutsideReact}
        >
          <Nav
            data-testid="navigation"
            libraryStatus={libraryStatus}
            aboutStatus={aboutStatus}
            setLibraryStatus={setLibraryStatus}
          />
          <Song currentSong={currentSong} isPlaying={isPlaying} />
          <Player
            data-testid="player"
            currentSong={currentSong}
            songInfo={songInfo}
            setSongInfo={setSongInfo}
            setIsShortcutsModalOpen={setIsShortcutsModalOpen}
          />
          <Credit
            data-testid="credit"
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
        <Library
          data-testid="library"
          ref={libraryRef}
          songs={songs}
          setCurrentSong={setCurrentSong}
          setSongs={setSongs}
          setLibraryStatus={setLibraryStatus}
          libraryStatus={libraryStatus}
        />
        <About
          data-testid="about"
          ref={aboutRef}
          aboutStatus={aboutStatus}
          setAboutStatus={setAboutStatus}
        />
        <HelpModal
          data-testid="help-modal"
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
}>`
  height: 100vh;
  overflow: hidden;
  position: relative;
  background: #fff;

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
    filter: blur(100px) saturate(1.8) brightness(1.1);
    opacity: 0.25;
    transition: background-image 0.8s ease;
    z-index: 0;
  }

  & > * {
    position: relative;
    z-index: 1;
  }
`;

export default App;
