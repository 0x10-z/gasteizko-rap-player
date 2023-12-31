import React from "react";
import styled, { css, keyframes } from "styled-components";

type SongType = {
  name: string;
  artist: string;
  album: string;
  cover: string;
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

// Definir la animación de rotación
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

const Img = styled.img<{ $isRotating: boolean }>`
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
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.8);

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
