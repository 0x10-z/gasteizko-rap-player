import { FC } from "react";
import styled, { css, keyframes } from "styled-components";
import { SongType } from "../types/models";

type SongProps = {
  currentSong: SongType;
  isPlaying: boolean;
};

const Song: FC<SongProps> = ({ currentSong, isPlaying }) => {
  const accentColor = currentSong.color[0] || "#1db954";
  const secondaryColor = currentSong.color[1] || accentColor;
  const glowColor =
    currentSong.color[currentSong.color.length - 1] || secondaryColor;

  return (
    <SongContainer>
      <ArtworkColumn
        $accentColor={accentColor}
        $secondaryColor={secondaryColor}>
        <StatusPill $accentColor={accentColor}>
          {isPlaying ? "Reproduciendo ahora" : "En pausa"}
        </StatusPill>
        <ImgWrapper $glowColor={glowColor}>
          <LabelDisc $isPlaying={isPlaying}>
            <Img
              src={currentSong.cover}
              alt={currentSong.name}
              height={100}
              $shadowColor={glowColor}
            />
          </LabelDisc>
          <PulseDot $isPlaying={isPlaying} $accentColor={accentColor} />
        </ImgWrapper>
      </ArtworkColumn>
      <SongInfo>
        <SongTitle>{currentSong.name}</SongTitle>
        <MetaRow>
          <MetaChip>{currentSong.artist}</MetaChip>
          <MetaChip>{currentSong.album}</MetaChip>
        </MetaRow>
      </SongInfo>
    </SongContainer>
  );
};

const SongContainer = styled.div`
  width: min(1100px, 100%);
  display: grid;
  grid-template-columns: minmax(280px, 34vw) minmax(0, 1fr);
  align-items: center;
  gap: clamp(1.5rem, 3vw, 3.5rem);
  min-height: 0;

  @media screen and (max-width: 900px) {
    grid-template-columns: 1fr;
    justify-items: center;
    text-align: center;
  }

  @media screen and (max-height: 860px) {
    gap: 1.25rem;
  }

  @media screen and (max-height: 760px) {
    gap: 0.9rem;
  }
`;

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const rotateCentered = keyframes`
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
`;

const ArtworkColumn = styled.div<{
  $accentColor: string;
  $secondaryColor: string;
}>`
  position: relative;
  border-radius: 30px;
  padding: clamp(0.8rem, 1.8vw, 1.25rem);
  background:
    linear-gradient(
      160deg,
      rgba(255, 255, 255, 0.1),
      rgba(255, 255, 255, 0.03)
    ),
    linear-gradient(
      145deg,
      ${(p) => `${p.$accentColor}22`},
      ${(p) => `${p.$secondaryColor}11`}
    );
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(24px);

  @media screen and (max-height: 760px) {
    border-radius: 24px;
  }
`;

const ImgWrapper = styled.div<{ $glowColor: string }>`
  width: min(360px, 68vw, 38vh);
  aspect-ratio: 1;
  position: relative;
  border-radius: 50%;
  overflow: hidden;
  background: radial-gradient(
    circle at center,
    rgba(34, 36, 38, 0.96) 0%,
    rgba(12, 14, 16, 0.98) 48%,
    rgba(4, 5, 6, 1) 100%
  );
  box-shadow:
    0 26px 80px rgba(0, 0, 0, 0.36),
    0 0 0 1px rgba(255, 255, 255, 0.08),
    0 0 72px ${(p) => `${p.$glowColor}33`};
  transition:
    box-shadow 0.35s ease,
    transform 0.35s ease;

  &::before {
    content: "";
    position: absolute;
    inset: 4%;
    border-radius: 50%;
    background: repeating-radial-gradient(
      circle at center,
      rgba(255, 255, 255, 0.08) 0 1px,
      rgba(0, 0, 0, 0) 1px 7px
    );
    opacity: 0.26;
    pointer-events: none;
  }

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 8%;
    height: 8%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background: rgba(10, 10, 10, 0.95);
    box-shadow: 0 0 0 6px rgba(255, 255, 255, 0.08);
    pointer-events: none;
  }

  @media screen and (max-width: 768px) {
    width: min(78vw, 340px, 34vh);
  }

  @media screen and (max-height: 760px) {
    width: min(280px, 54vw, 30vh);
  }
`;

const LabelDisc = styled.div<{ $isPlaying: boolean }>`
  width: 42%;
  height: 42%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  border: 10px solid rgba(18, 21, 24, 0.85);
  animation: ${rotateCentered} 26s linear infinite;
  animation-play-state: ${(props) => (props.$isPlaying ? "running" : "paused")};
  transition:
    box-shadow 0.35s ease,
    width 0.35s ease,
    height 0.35s ease;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.08);
  transform-origin: center;
`;

const Img = styled.img<{ $shadowColor: string }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: 50%;
  filter: saturate(1.05) contrast(1.02);
  transition: filter 0.5s ease;
  box-shadow: ${(props) => `0 0 28px ${props.$shadowColor}44`};
`;

const StatusPill = styled.span<{ $accentColor: string }>`
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.45rem 0.75rem;
  border-radius: 999px;
  background: rgba(5, 9, 7, 0.72);
  color: #edfdf1;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;

  &::before {
    content: "";
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background: ${(p) => p.$accentColor};
    box-shadow: 0 0 0.75rem ${(p) => `${p.$accentColor}99`};
  }
`;

const PulseDot = styled.span<{ $isPlaying: boolean; $accentColor: string }>`
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  width: 0.9rem;
  height: 0.9rem;
  border-radius: 50%;
  background: ${(p) => p.$accentColor};
  box-shadow: 0 0 1.2rem ${(p) => `${p.$accentColor}aa`};
  transform: scale(${(p) => (p.$isPlaying ? 1 : 0.8)});
  opacity: ${(p) => (p.$isPlaying ? 1 : 0.55)};
  transition:
    transform 0.25s ease,
    opacity 0.25s ease;
`;

const SongInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.9rem;
  min-width: 0;

  @media screen and (max-width: 900px) {
    align-items: center;
  }

  @media screen and (max-height: 760px) {
    gap: 0.65rem;
  }
`;

const SongTitle = styled.h2`
  font-size: clamp(1.7rem, min(4vw, 4.5vh), 4.1rem);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.05em;
  color: #f7fbf8;
  max-width: min(12ch, 100%);
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;

  @media screen and (max-height: 760px) {
    font-size: clamp(1.45rem, min(3.2vw, 3.4vh), 2.5rem);
    -webkit-line-clamp: 2;
  }
`;

const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;

  @media screen and (max-width: 900px) {
    justify-content: center;
  }
`;

const MetaChip = styled.span`
  display: inline-flex;
  align-items: center;
  min-height: 2.2rem;
  padding: 0.55rem 0.9rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(242, 248, 244, 0.9);
  font-size: 0.92rem;
  backdrop-filter: blur(12px);

  @media screen and (max-height: 760px) {
    min-height: 1.95rem;
    padding: 0.45rem 0.75rem;
    font-size: 0.82rem;
  }
`;

export default Song;
