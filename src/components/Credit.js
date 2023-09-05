import React from "react";
import styled from "styled-components";

const Credit = ({
  songsNumber,
  aboutStatus,
  setAboutStatus,
  libraryStatus,
}) => {
  return (
    <CreditContainer $aboutStatus={aboutStatus} $libraryStatus={libraryStatus}>
      <LeftContainer>
        <StyledLink
          href="https://github.com/0x10-z/gasteizko-rap-player/"
          target="_blank">
          Código en Github
        </StyledLink>
      </LeftContainer>
      <CenterContainer>
        <StyledSpan>{songsNumber} temas cargados</StyledSpan>
        <StyledSpan>v{process.env.REACT_APP_BUILD_DATE}</StyledSpan>
      </CenterContainer>
      <RightContainer>
        <StyledLink href="#" onClick={() => setAboutStatus(!aboutStatus)}>
          Sobre este proyecto
        </StyledLink>
      </RightContainer>
    </CreditContainer>
  );
};

const CreditContainer = styled.div`
  user-select: none;
  position: fixed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 20px;
  bottom: 5px;
  z-index: 12;
  opacity: ${(p) => (p.$aboutStatus || p.$libraryStatus ? "0" : "1")};
  transition: opacity 0.3s ease;
`;

const LeftContainer = styled.div``;

const CenterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const RightContainer = styled.div``;

const StyledLink = styled.a`
  color: rgb(155, 155, 155);
  font-size: 0.75rem;
`;

const StyledSpan = styled.span`
  color: rgb(155, 155, 155);
  font-size: 0.75rem;
`;

export default Credit;
