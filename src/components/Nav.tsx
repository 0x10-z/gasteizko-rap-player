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
  }
`;

const H1 = styled.h1<{ $isLibraryActive: boolean }>`
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
  background: transparent;
  border: none;
  cursor: pointer;
  color: inherit;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  opacity: ${(p) => (p.$aboutStatus || p.$libraryStatus ? "0" : "100")};
  border: 2px solid rgb(65, 65, 65);
  padding: 0.5rem;
  transition: all 0.3s ease;
  &:hover {
    background: rgb(65, 65, 65);
    color: white;
  }
`;

export default Nav;
