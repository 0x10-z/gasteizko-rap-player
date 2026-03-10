import { FC } from "react";
import styled from "styled-components";

type CreditProps = {
  songsNumber: number;
  aboutStatus: boolean;
  setAboutStatus: (status: boolean) => void;
  libraryStatus: boolean;
};

const Credit: FC<CreditProps> = ({
  songsNumber,
  aboutStatus,
  setAboutStatus,
  libraryStatus,
}) => {
  return (
    <CreditContainer
      $aboutStatus={aboutStatus}
      $libraryStatus={libraryStatus}
    >
      <StyledSpan>{songsNumber} temas</StyledSpan>
      <LinksRow>
        <StyledLink
          href="https://github.com/0x10-z/gasteizko-rap-player/"
          target="_blank"
        >
          Github
        </StyledLink>
        <Separator>·</Separator>
        <StyledSpan>v{import.meta.env.VITE_BUILD_DATE}</StyledSpan>
        <Separator>·</Separator>
        <StyledLink href="#" onClick={() => setAboutStatus(!aboutStatus)}>
          Sobre este proyecto
        </StyledLink>
      </LinksRow>
    </CreditContainer>
  );
};

const CreditContainer = styled.div<{
  $aboutStatus: boolean;
  $libraryStatus: boolean;
}>`
  user-select: none;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 16px;
  z-index: 12;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  opacity: ${(p) => (p.$aboutStatus || p.$libraryStatus ? "0" : "1")};
  transition: opacity 0.3s ease;
  pointer-events: ${(p) =>
    p.$aboutStatus || p.$libraryStatus ? "none" : "auto"};

  @media screen and (max-width: 768px) {
    bottom: 8px;
  }
`;

const LinksRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Separator = styled.span`
  color: rgb(160, 160, 160);
  font-size: 0.7rem;
`;

const StyledLink = styled.a`
  color: rgb(130, 130, 130);
  font-size: 0.7rem;
  text-decoration: none;
  transition: color 0.2s ease;
  letter-spacing: 0.02em;

  &:hover {
    color: rgb(80, 80, 80);
  }
`;

const StyledSpan = styled.span`
  color: rgb(140, 140, 140);
  font-size: 0.7rem;
  letter-spacing: 0.02em;
`;

export default Credit;
