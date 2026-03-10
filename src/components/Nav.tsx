import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMusic } from "@fortawesome/free-solid-svg-icons";

type NavProps = {
  libraryStatus: boolean;
  setLibraryStatus: (status: boolean) => void;
  aboutStatus: boolean;
  [x: string]: any;
};

const Nav: React.FC<NavProps> = ({
  libraryStatus,
  setLibraryStatus,
  aboutStatus,
  ...rest
}) => {
  return (
    <NavContainer {...rest}>
      <H1 $isLibraryActive={libraryStatus || aboutStatus}>VI y alrededores</H1>
      <Button
        $aboutStatus={aboutStatus}
        $libraryStatus={libraryStatus}
        onClick={() => setLibraryStatus(!libraryStatus)}
      >
        Tracklist <FontAwesomeIcon icon={faMusic} />
      </Button>
    </NavContainer>
  );
};

const NavContainer = styled.div`
  min-height: 10vh;
  display: flex;
  justify-content: space-around;
  align-items: center;
  @media screen and (max-width: 768px) {
    position: fixed;
    z-index: 10;
    top: 0;
    left: 0;
    width: 100%;
    backdrop-filter: blur(20px);
    background: rgba(255, 255, 255, 0.7);
  }
`;

const H1 = styled.h1<{ $isLibraryActive: boolean }>`
  font-size: 1.3rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: rgb(40, 40, 40);
  transition: all 0.5s ease;

  @media screen and (max-width: 768px) {
    visibility: ${(p) => (p.$isLibraryActive ? "hidden" : "visible")};
    opacity: ${(p) => (p.$isLibraryActive ? "0" : "100")};
    transition: all 0.5s ease;
  }
`;

const Button = styled.button<{
  $aboutStatus: boolean;
  $libraryStatus: boolean;
}>`
  background: rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.1);
  cursor: pointer;
  color: rgb(80, 80, 80);
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  font-size: 0.85rem;
  font-family: inherit;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  opacity: ${(p) => (p.$aboutStatus || p.$libraryStatus ? "0" : "1")};
  pointer-events: ${(p) =>
    p.$aboutStatus || p.$libraryStatus ? "none" : "auto"};

  &:hover {
    background: rgba(0, 0, 0, 0.08);
    border-color: rgba(0, 0, 0, 0.2);
    color: rgb(30, 30, 30);
  }
`;

export default Nav;
