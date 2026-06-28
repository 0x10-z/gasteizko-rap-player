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
    <CreditContainer $aboutStatus={aboutStatus} $libraryStatus={libraryStatus}>
      <StyledSpan>{songsNumber} temas</StyledSpan>
      <LinksRow>
        <StyledLink
          href="https://github.com/0x10-z/gasteizko-rap-player/"
          target="_blank">
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
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 12;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  padding: 0.75rem 1rem;
  border-radius: 0;
  background: rgba(8, 13, 16, 0.76);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(18px);
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.22);
  opacity: ${(p) => (p.$aboutStatus || p.$libraryStatus ? "0" : "1")};
  transition: opacity 0.3s ease;
  pointer-events: ${(p) =>
    p.$aboutStatus || p.$libraryStatus ? "none" : "auto"};

  @media screen and (max-width: 768px) {
    padding: 0.75rem 1rem calc(0.75rem + env(safe-area-inset-bottom));
  }
`;

const LinksRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Separator = styled.span`
  color: rgba(190, 205, 196, 0.42);
  font-size: 0.7rem;
`;

const StyledLink = styled.a`
  color: rgba(226, 237, 229, 0.82);
  font-size: 0.74rem;
  text-decoration: none;
  transition: color 0.2s ease;
  letter-spacing: 0.02em;

  &:hover {
    color: #ffffff;
  }
`;

const StyledSpan = styled.span`
  color: rgba(190, 205, 196, 0.68);
  font-size: 0.74rem;
  letter-spacing: 0.02em;
`;

export default Credit;
