import React from "react";
import styled from "styled-components";

const About = ({ aboutStatus, setAboutStatus }) => {
  return (
    <>
      <AboutContainer $aboutStatus={aboutStatus}>
        <H1>Sobre este proyecto</H1>
        <P>
          Esta plataforma nace de un profundo respeto y admiración por la música
          rap que resonó en Vitoria y sus alrededores durante los años 2000.
          Aquellos tiempos, marcados por ritmos y letras inolvidables, formaron
          una parte esencial de nuestra infancia y juventud. Con esta web, no
          solo buscamos rendir homenaje a esos artistas y sus creaciones, sino
          también ofrecer un espacio de reencuentro con esos momentos. Es
          importante mencionar que no buscamos infringir derechos ni molestar a
          los artistas involucrados. Si algún artista prefiere no estar
          representado aquí, solo necesita ponerse en contacto con uno de los
          autores, ya sea Iker Ocio o Jonzo, y atenderemos su petición de
          inmediato.
        </P>
        <H2>Motivación detrás del proyecto</H2>
        <P>
          La música tiene el poder de transportarnos en el tiempo, de revivir
          emociones y momentos que creíamos olvidados. Con esta plataforma,
          aspiramos a que aquellos que, como nosotros, crecieron al ritmo del
          rap de Euskadi, puedan sumergirse en un viaje nostálgico y
          reencontrarse con aquellas canciones que marcaron una era dorada del
          rap en la región.
        </P>
        <H2>Sobre los archivos y su formato</H2>
        <P>
          Conscientes de la importancia de la eficiencia y el respeto por el
          consumo de datos en la era digital, hemos optado por exportar todos
          los archivos musicales al formato m4a. Esta decisión permite una
          reproducción de alta calidad mientras se mantiene un tamaño de archivo
          reducido, garantizando así una experiencia de usuario óptima.
        </P>
        <H2>Tecnología y diseño</H2>
        <P>
          Esta web ha sido desarrollada utilizando React, una de las bibliotecas
          más populares y potentes para la creación de interfaces de usuario. Al
          no contar con un backend, toda la lógica y el contenido se ejecutan
          directamente en el navegador del usuario, lo que garantiza una
          experiencia fluida y rápida.
        </P>
      </AboutContainer>
      <CloseButton
        $aboutStatus={aboutStatus}
        onClick={() => setAboutStatus(false)}
      >
        X
      </CloseButton>
    </>
  );
};

const AboutContainer = styled.div`
  position: fixed;
  z-index: 99;
  background: white;
  top: 0;
  right: 0;
  width: 30rem; // Aumentar el ancho
  height: 100%;
  background-color: white;
  box-shadow: -2px 2px 50px rgb(204, 204, 204); // Change shadow direction
  user-select: none;
  overflow: scroll;
  overflow-x: hidden;
  transform: translateX(
    ${(p) => (p.$aboutStatus ? "0%" : "100%")}
  ); // Modify transform for right side
  transition: all 0.5s ease;
  opacity: ${(p) => (p.$aboutStatus ? "100" : "0")};
  scrollbar-width: thin;
  scrollbar-color: rgba(155, 155, 155, 0.5) transparent;
  &::-webkit-scrollbar {
    width: 15px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(155, 155, 155, 0.5);
    border-radius: 20px;
    border: transparent;
  }
  @media screen and (max-width: 768px) {
    width: 100%;
    z-index: 9;
  }
`;

const H1 = styled.h2`
  padding: 1rem;
  background-color: rgba(
    0,
    0,
    0,
    0.8
  ); // Fondo oscuro con un poco de transparencia
  color: white; // Cambiar el color del texto a blanco
`;

const H2 = styled.h3`
  padding: 1rem 2rem;
  background-color: rgba(
    0,
    0,
    0,
    0.7
  ); // Fondo ligeramente menos oscuro para diferenciar de H1
  color: white; // Cambiar el color del texto a blanco
`;

const P = styled.p`
  margin: 1rem 2rem;
  line-height: 1.5;
`;

const CloseButton = styled.button`
  position: fixed;
  bottom: 1rem;
  z-index: 100;
  right: 2rem;
  background-color: rgba(
    0,
    0,
    0,
    0.7
  ); // Fondo rojo con un poco de transparencia
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: white; // Cambiar el color del texto a blanco para que contraste con el fondo rojo
  display: ${(p) => (p.$aboutStatus ? "flex" : "none")};
  border-radius: 50%; // Hacerlo redondo
  width: 40px; // Tamaño fijo para el botón
  height: 40px; // Tamaño fijo para el botón
  align-items: center; // Centrar verticalmente
  justify-content: center; // Centrar horizontalmente
  transition: background-color 0.3s ease; // Transición suave para el hover

  &:hover {
    background-color: rgba(0, 0, 0, 1); // Fondo rojo sólido en hover
  }
`;

export default About;
