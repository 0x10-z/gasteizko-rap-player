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
      <H1>{currentSong.name}</H1>
      <H2>{currentSong.artist}</H2>
      <H2>{currentSong.album}</H2>
    </SongContainer>
  );
};

const SongContainer = styled.div`
  margin-top: 10vh;
  min-height: 50vh;
  max-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
  width: 20%;
  padding-bottom: 20%;
  position: relative;

  @media screen and (max-width: 768px) {
    width: 50%;
    padding-bottom: 50%;
  }
`;

const Img = styled.img<{ $isRotating: boolean; $shadowColor: string }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  animation: ${(props) =>
    props.$isRotating
      ? css`
          ${rotate} 10s linear infinite
        `
      : "none"};
  transition: border-radius 0.3s ease, animation 0.3s ease;
  box-shadow: 0 0 150px 20px ${(props) => props.$shadowColor};

  &:hover {
    border-radius: 2%;
  }
`;

const H1 = styled.h2`
  padding: 3rem 1rem 1rem 1rem;
  text-align: center;
`;

const H2 = styled.h3`
  font-size: 1rem;
  text-align: center;
`;

export default Song;
