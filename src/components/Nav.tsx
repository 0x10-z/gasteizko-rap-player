import { FC } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMusic } from "@fortawesome/free-solid-svg-icons";

type NavProps = {
  libraryStatus: boolean;
  setLibraryStatus: (status: boolean) => void;
  aboutStatus: boolean;
};

const Nav: FC<NavProps> = ({
  libraryStatus,
  setLibraryStatus,
  aboutStatus,
}) => {
  return (
    <NavContainer>
      <BrandBlock $isMuted={libraryStatus || aboutStatus}>
        <BrandTag>Archivo curado</BrandTag>
        <H1>VI y alrededores</H1>
      </BrandBlock>
      <Button
        $aboutStatus={aboutStatus}
        $libraryStatus={libraryStatus}
        onClick={() => setLibraryStatus(!libraryStatus)}
        aria-label="Abrir tracklist"
        aria-expanded={libraryStatus}>
        Coleccion <FontAwesomeIcon icon={faMusic} />
      </Button>
    </NavContainer>
  );
};

const NavContainer = styled.div`
  width: min(1180px, 100%);
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 0.9rem 1rem;
  border-radius: 24px;
  background: rgba(11, 16, 19, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.18);

  @media screen and (max-width: 768px) {
    position: fixed;
    z-index: 20;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    padding: 0.35rem 0.85rem 0.5rem;
    border-radius: 0;
    border-left: none;
    border-right: none;
    border-top: none;
  }
`;

const BrandBlock = styled.div<{ $isMuted: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  transition: opacity 0.3s ease;
  opacity: ${(p) => (p.$isMuted ? 0.45 : 1)};

  @media screen and (max-width: 768px) {
    min-width: 0;
  }
`;

const BrandTag = styled.span`
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: rgba(197, 214, 203, 0.56);
`;

const H1 = styled.h1`
  font-size: 1.45rem;
  font-weight: 800;
  letter-spacing: -0.05em;
  color: #f4faf5;
  line-height: 1;

  @media screen and (max-width: 768px) {
    font-size: 1.15rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const Button = styled.button<{
  $aboutStatus: boolean;
  $libraryStatus: boolean;
}>`
  background: rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  cursor: pointer;
  color: #ecf7ef;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  font-size: 0.84rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  font-family: inherit;
  padding: 0.7rem 1rem;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  transition: all 0.3s ease;
  background: ${(p) =>
    p.$libraryStatus
      ? "linear-gradient(135deg, rgba(29, 185, 84, 0.92), rgba(114, 235, 156, 0.82))"
      : "rgba(255, 255, 255, 0.06)"};
  color: ${(p) => (p.$libraryStatus ? "#041009" : "#ecf7ef")};
  box-shadow: ${(p) =>
    p.$libraryStatus ? "0 14px 28px rgba(29, 185, 84, 0.24)" : "none"};
  opacity: ${(p) => (p.$aboutStatus ? "0.35" : "1")};
  pointer-events: ${(p) => (p.$aboutStatus ? "none" : "auto")};

  &:hover {
    transform: translateY(-1px);
    background: ${(p) =>
      p.$libraryStatus
        ? "linear-gradient(135deg, rgba(29, 185, 84, 0.98), rgba(136, 240, 170, 0.9))"
        : "rgba(255, 255, 255, 0.12)"};
  }

  @media screen and (max-width: 768px) {
    padding: 0.62rem 0.9rem;
    font-size: 0.8rem;
  }
`;

export default Nav;
