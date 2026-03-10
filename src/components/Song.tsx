import React from "react";
import styled, { css, keyframes } from "styled-components";

type SongType = {
  name: string;
  artist: string;
  album: string;
  cover: string;
  color?: string | null;
};

type SongProps = {
  currentSong: SongType;
  isPlaying: boolean;
};

const Song: React.FC<SongProps> = ({ currentSong, isPlaying }) => {
  return (
    <SongContainer>
      <ImgWrapper>
        <Img
          src={currentSong.cover}
          alt={currentSong.name}
          height={100}
          $isRotating={isPlaying}
          $shadowColor={
            currentSong.color && currentSong.color.length > 0
              ? currentSong.color[currentSong.color.length - 1]
              : "#f1d1f2"
          }
        />
      </ImgWrapper>
      <SongInfo>
        <SongTitle>{currentSong.name}</SongTitle>
        <SongArtist>{currentSong.artist}</SongArtist>
        <SongAlbum>{currentSong.album}</SongAlbum>
      </SongInfo>
    </SongContainer>
  );
};

const SongContainer = styled.div`
  margin-top: 8vh;
  min-height: 50vh;
  max-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const ImgWrapper = styled.div`
  width: 22%;
  padding-bottom: 22%;
  position: relative;

  @media screen and (max-width: 768px) {
    width: 55%;
    padding-bottom: 55%;
  }
`;

const Img = styled.img<{ $isRotating: boolean; $shadowColor: string }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: ${(props) => (props.$isRotating ? "50%" : "16px")};
  animation: ${(props) =>
    props.$isRotating
      ? css`
          ${rotate} 15s linear infinite
        `
      : "none"};
  transition: border-radius 0.5s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.5s ease;
  box-shadow: 0 0 60px 15px ${(props) => props.$shadowColor}33,
    0 8px 32px rgba(0, 0, 0, 0.12);

  &:hover {
    border-radius: 16px;
  }
`;

const SongInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding-top: 1.5rem;
`;

const SongTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  letter-spacing: -0.02em;
  color: rgb(30, 30, 30);
  padding: 0 1rem;
`;

const SongArtist = styled.h3`
  font-size: 1rem;
  font-weight: 500;
  text-align: center;
  color: rgb(100, 100, 100);
`;

const SongAlbum = styled.h3`
  font-size: 0.85rem;
  font-weight: 400;
  text-align: center;
  color: rgb(155, 155, 155);
`;

export default Song;
