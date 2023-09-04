import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import "./App.css";
import { Analytics } from "@vercel/analytics/react";

// Import components
import Player from "./components/Player";
import Song from "./components/Song";
import Library from "./components/Library";
import Nav from "./components/Nav";
import Credit from "./components/Credit";
// Import data
import tracklist from "./tracklist.json";

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

  // Ref
  const audioRef = useRef(null);

  // State
  const [songs, setSongs] = useState(tracklist);

  const songIdFromURL = location.pathname.substring(1);
  const songToPlay = songIdFromURL
    ? songs.find(
        (song) =>
          prettifyString(song.artist) ===
            prettifyString(songIdFromURL.split("@")[0]) &&
          prettifyString(song.name) ===
            prettifyString(songIdFromURL.split("@")[1])
      )
    : null;

  const initialSong =
    songToPlay || songs[Math.floor(Math.random() * songs.length)];

  const [currentSong, setCurrentSong] = useState(initialSong);

  const [isPlaying, setIsPlaying] = useState(false);
  const [libraryStatus, setLibraryStatus] = useState(false);
  const [songInfo, setSongInfo] = useState({
    currentTime: 0,
    duration: 0,
  });

  // Functions
  const updateTimeHandler = (e) => {
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    setSongInfo({ ...songInfo, currentTime, duration });
  };

  const songEndHandler = async () => {
    let currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    let nextSong = songs[(currentIndex + 1) % songs.length];
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

    if (isPlaying) {
      audioRef.current.play().catch((error) => {
        console.error("Error al reproducir el audio:", error);
      });
    }
  };

  const parts = currentSong.audio.split("/");
  const lastPart = parts[parts.length - 1].split("?");
  lastPart[0] = encodeURIComponent(lastPart[0]);
  parts[parts.length - 1] = lastPart.join("?");
  const audioSrc = parts.join("/");

  // UseNavigate code
  useEffect(() => {
    navigate(
      `/${prettifyString(currentSong.artist)}@${prettifyString(
        currentSong.name
      )}`
    );
  }, [currentSong, navigate]);

  return (
    <AppContainer
      $libraryStatus={libraryStatus}
      $backgroundImage={currentSong.cover}
    >
      <Nav libraryStatus={libraryStatus} setLibraryStatus={setLibraryStatus} />
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
        songs={songs}
        setCurrentSong={setCurrentSong}
        audioRef={audioRef}
        isPlaying={isPlaying}
        setSongs={setSongs}
        libraryStatus={libraryStatus}
      />
      <Credit songsNumber={songs.length} />
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
        src={audioSrc}
      />
      <Analytics />
    </AppContainer>
  );
};

const AppContainer = styled.div`
  transition: all 0.5s ease;
  margin-left: ${(p) => (p.$libraryStatus ? "20rem" : "0")};
  @media screen and (max-width: 768px) {
    margin-left: 0;
  }
`;

export default App;
