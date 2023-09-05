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
import tracklist from "./tracklist.json";

// Utility Functions
function prettifyString(str) {
  let prettified = str.replace(/[^a-zA-Z0-9]+/g, "-");
  prettified = prettified.replace(/-+/g, "-");
  prettified = prettified.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
  return prettified.trim();
}

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Refs
  const audioRef = useRef(null);
  const libraryRef = useRef(null);
  const aboutRef = useRef(null);

  // State Initialization
  const [songs, setSongs] = useState(tracklist);
  const [currentSong, setCurrentSong] = useState(determineInitialSong());
  const [isPlaying, setIsPlaying] = useState(false);
  const [libraryStatus, setLibraryStatus] = useState(false);
  const [aboutStatus, setAboutStatus] = useState(false);
  const [songInfo, setSongInfo] = useState({
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

  function getAudioSrc(song) {
    const parts = song.audio.split("/");
    const lastPart = parts[parts.length - 1].split("?");
    lastPart[0] = encodeURIComponent(lastPart[0]);
    parts[parts.length - 1] = lastPart.join("?");
    return parts.join("/");
  }

  async function updateActiveSongs(nextSong) {
    await setCurrentSong(nextSong);
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
  }

  // Event Handlers
  const updateTimeHandler = (e) => {
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    setSongInfo({ ...songInfo, currentTime, duration });
  };

  const songEndHandler = async () => {
    let currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    let nextSong = songs[(currentIndex + 1) % songs.length];
    await updateActiveSongs(nextSong);
    if (isPlaying) {
      audioRef.current.play().catch((error) => {
        console.error("Error al reproducir el audio:", error);
      });
    }
  };

  const handleClickOutside = useCallback(
    (event) => {
      if (libraryStatus && !libraryRef.current.contains(event.target)) {
        setLibraryStatus(false);
      }
      if (aboutStatus && !aboutRef.current.contains(event.target)) {
        setAboutStatus(false);
      }
    },
    [libraryStatus, aboutStatus, libraryRef, aboutRef]
  );

  // Effects
  useEffect(() => {
    navigate(
      `/${prettifyString(currentSong.artist)}@${prettifyString(
        currentSong.name
      )}`
    );
  }, [currentSong, navigate]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  // Render
  return (
    <AppContainer
      $libraryStatus={libraryStatus}
      $aboutStatus={aboutStatus}
      $backgroundImage={currentSong.cover}
      onClick={handleClickOutside}>
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
        setCurrentSong={setCurrentSong}
        audioRef={audioRef}
        songInfo={songInfo}
        setSongInfo={setSongInfo}
        songs={songs}
        setSongs={setSongs}
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
      <audio
        onLoadedMetadata={updateTimeHandler}
        onTimeUpdate={updateTimeHandler}
        onEnded={songEndHandler}
        onCanPlayThrough={() => {
          if (isPlaying) {
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
  );
};

const AppContainer = styled.div`
  transition: all 0.5s ease;
  margin-left: ${(p) => (p.$libraryStatus ? "20rem" : "0")};
  margin-right: ${(p) => (p.$aboutStatus ? "20rem" : "0")};
  @media screen and (max-width: 768px) {
    margin-left: 0;
    margin-right: 0;
  }
`;

export default App;
