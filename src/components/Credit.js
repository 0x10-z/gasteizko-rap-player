import React from "react";
import styled from "styled-components";

const Credit = ({ songsNumber, aboutStatus, setAboutStatus }) => {
  return (
    <CreditContainer $aboutStatus={aboutStatus}>
      <Link
        href="https://github.com/WilsonLe/react-music-player"
        target="_blank"
      >
        Basado en react-music-player
      </Link>
      <span>{songsNumber} temas cargados</span>
      <span>v{process.env.REACT_APP_BUILD_DATE}</span>
      <Button onClick={() => setAboutStatus(!aboutStatus)}>
        Sobre este proyecto
      </Button>
    </CreditContainer>
  );
};

const CreditContainer = styled.div`
  user-select: none;
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  opacity: ${(p) => (p.$aboutStatus ? "0" : "100")};
  transition: opacity 0.3s ease;
  justify-content: flex-end;
  z-index: 12;
  bottom: 5px;
  right: 5px;
  color: rgb(155, 155, 155);
  font-size: 0.75rem;
`;

const Link = styled.a`
  color: rgb(155, 155, 155);
`;

const Button = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  text-decoration: underline; // Underline to make it look like a link
  color: rgb(155, 155, 155); // Same color as the Link styled component
  padding: 0.5rem;
  transition: all 0.3s ease;
  &:hover {
    background: rgb(65, 65, 65);
    color: white;
    text-decoration: none; // Remove underline on hover for a cleaner look
  }
`;

export default Credit;
