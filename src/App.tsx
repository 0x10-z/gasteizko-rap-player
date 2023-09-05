import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import "./App.css";
import { Analytics } from "@vercel/analytics/react";
import Player from "./components/Player";
import Song from "./components/Song";
import Library from "./components/Library";
import About from "./components/About";
import Nav from "./components/Nav";
import Credit from "./components/Credit";
import HelpModal from "./components/HelpModal";
import tracklist from "./tracklist.json";
import { SongChangeProvider } from "./contexts/SongChangeProvider";

// Define types for your state and props if needed
export type SongType = {
  id: string;
  name: string;
  artist: string;
  cover: string;
  audio: string;
  album: string;
  active: boolean;
};

type SongInfoType = {
  currentTime: number;
  duration: number;
};

// Utility Functions
function prettifyString(str: string): string {
  let prettified = str.replace(/[^a-zA-Z0-9]+/g, "-");
  prettified = prettified.replace(/-+/g, "-");
  prettified = prettified.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
  });
  return prettified.trim();
}

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const libraryRef = useRef<HTMLDivElement | null>(null);
  const aboutRef = useRef<HTMLDivElement | null>(null);

  // State Initialization
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] =
    useState<boolean>(false);
  const [songs, setSongs] = useState<SongType[]>(tracklist);
  const [currentSong, setCurrentSong] = useState<SongType>(
    determineInitialSong()
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [libraryStatus, setLibraryStatus] = useState<boolean>(false);
  const [aboutStatus, setAboutStatus] = useState<boolean>(false);
  const [songInfo, setSongInfo] = useState<SongInfoType>({
    currentTime: 0,
    duration: 0,
  });

  // Helper Functions
  function determineInitialSong() {
    const songIdFromURL = location.pathname.substring(1);
    const songFromURL = songIdFromURL
      ? songs.find(
          (song) =>
            prettifyString(song.artist) ===
              prettifyString(songIdFromURL.split("@")[0]) &&
            prettifyString(song.name) ===
              prettifyString(songIdFromURL.split("@")[1])
        )
      : null;
    return songFromURL || songs[Math.floor(Math.random() * songs.length)];
  }

  function getAudioSrc(song: SongType) {
    const parts = song.audio.split("/");
    const lastPart = parts[parts.length - 1].split("?");
    lastPart[0] = encodeURIComponent(lastPart[0]);
    parts[parts.length - 1] = lastPart.join("?");
    return parts.join("/");
  }

  async function updateActiveSongs(nextSong: SongType) {
    setCurrentSong(nextSong);
    const newSongs = songs.map((song) => {
      console.log("Active: " + nextSong.id);
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
  }

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
    let currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    let nextSong = songs[(currentIndex + 1) % songs.length];
    await updateActiveSongs(nextSong);
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Error al reproducir el audio:", error);
      });
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
    navigate(
      `/${prettifyString(currentSong.artist)}@${prettifyString(
        currentSong.name
      )}`
    );
  }, [currentSong, navigate]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideDOM);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideDOM);
    };
  }, [handleClickOutsideDOM]);

  const changeSong = async (direction: "forward" | "backward") => {
    let currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    let nextIndex;

    if (direction === "forward") {
      nextIndex = (currentIndex + 1) % songs.length;
    } else {
      nextIndex = (currentIndex - 1 + songs.length) % songs.length;
    }

    const nextSong = songs[nextIndex];
    await updateActiveSongs(nextSong);

    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Error al reproducir el audio:", error);
      });
    }
  };

  // Render
  return (
    <SongChangeProvider changeSong={changeSong}>
      <AppContainer
        $libraryStatus={libraryStatus}
        $aboutStatus={aboutStatus}
        $backgroundImage={currentSong.cover}
        onClick={handleClickOutsideReact}
      >
        <Nav
          libraryStatus={libraryStatus}
          aboutStatus={aboutStatus}
          setLibraryStatus={setLibraryStatus}
        />
        <Song currentSong={currentSong} isPlaying={isPlaying} />
        <Player
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          currentSong={currentSong}
          audioRef={audioRef}
          songInfo={songInfo}
          setSongInfo={setSongInfo}
          setIsShortcutsModalOpen={setIsShortcutsModalOpen}
        />
        <Library
          ref={libraryRef}
          songs={songs}
          setCurrentSong={setCurrentSong}
          audioRef={audioRef}
          isPlaying={isPlaying}
          setSongs={setSongs}
          setLibraryStatus={setLibraryStatus}
          libraryStatus={libraryStatus}
        />
        <About
          ref={aboutRef}
          aboutStatus={aboutStatus}
          setAboutStatus={setAboutStatus}
        />
        <Credit
          songsNumber={songs.length}
          aboutStatus={aboutStatus}
          setAboutStatus={setAboutStatus}
          libraryStatus={libraryStatus}
        />
        <HelpModal
          isOpen={isShortcutsModalOpen}
          onClose={() => setIsShortcutsModalOpen(false)}
        />
        <audio
          onLoadedMetadata={updateTimeHandler}
          onTimeUpdate={updateTimeHandler}
          onEnded={songEndHandler}
          onCanPlayThrough={() => {
            if (isPlaying && audioRef.current) {
              audioRef.current.play().catch((error) => {
                console.error("Error al reproducir el audio:", error);
              });
            }
          }}
          ref={audioRef}
          src={getAudioSrc(currentSong)}
        />
        <Analytics />
      </AppContainer>
    </SongChangeProvider>
  );
};

const AppContainer = styled.div<{
  $libraryStatus: boolean;
  $aboutStatus: boolean;
  $backgroundImage: string;
}>`
  transition: all 0.5s ease;
  margin-left: ${(p) => (p.$libraryStatus ? "20rem" : "0")};
  margin-right: ${(p) => (p.$aboutStatus ? "20rem" : "0")};
  @media screen and (max-width: 768px) {
    margin-left: 0;
    margin-right: 0;
  }
`;

export default App;
