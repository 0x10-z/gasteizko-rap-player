import React from "react";
import styled, { css, keyframes } from "styled-components";

const Song = ({ currentSong, isPlaying }) => {
  return (
    <SongContainer>
      <Img
        src={currentSong.cover}
        alt={currentSong.name}
        $isRotating={isPlaying}
      ></Img>
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

const Img = styled.img`
  width: 20%;
  border-radius: 50%;
  animation: ${(props) =>
    props.$isRotating
      ? css`
          ${rotate} 6s linear infinite
        `
      : "none"};

  @media screen and (max-width: 768px) {
    width: 50%;
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
