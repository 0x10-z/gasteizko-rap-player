import { forwardRef } from "react";
import styled from "styled-components";

type AboutProps = {
  aboutStatus: boolean;
  setAboutStatus: (status: boolean) => void;
  [x: string]: any;
};

const About = forwardRef<HTMLDivElement, AboutProps>(
  ({ aboutStatus, setAboutStatus, ...rest }, ref) => {
    return (
      <>
        <AboutContainer ref={ref} $aboutStatus={aboutStatus} {...rest}>
          <Header>Sobre este proyecto</Header>
          <P>
            Esta plataforma nace de un profundo respeto y admiración por la
            música rap que resonó en Vitoria y sus alrededores durante los años
            <Remark href="#">2000-2010</Remark>. Aquellos tiempos, marcados por
            ritmos y letras inolvidables, formaron una parte esencial de nuestra
            infancia y juventud. Con esta web, no solo buscamos rendir homenaje
            a esos artistas y sus creaciones, sino también ofrecer un espacio de
            reencuentro con esos momentos. Es importante mencionar que no
            buscamos infringir derechos ni molestar a los artistas involucrados.
            Si algún artista prefiere no estar representado aquí, solo necesita
            ponerse en contacto con uno de los autores, ya sea{" "}
            <Remark href="https://ikerocio.com" target="_blank">
              Iker Ocio Zuazo
            </Remark>{" "}
            o
            <Remark
              href="https://www.instagram.com/jonzoonegraphics/"
              target="_blank"
            >
              JonzoOne
            </Remark>
            , y atenderemos su petición de inmediato.
          </P>
          <SectionTitle>Motivación detrás del proyecto</SectionTitle>
          <P>
            La música tiene el poder de transportarnos en el tiempo, de revivir
            emociones y momentos que creíamos olvidados. Con esta plataforma,
            aspiramos a que aquellos que, como nosotros, crecieron al ritmo del
            rap de Euskadi, puedan sumergirse en un viaje nostálgico y
            reencontrarse con aquellas canciones que marcaron una era dorada del
            rap en la región.
          </P>
          <SectionTitle>Sobre los archivos y su formato</SectionTitle>
          <P>
            Conscientes de la importancia de la eficiencia y el respeto por el
            consumo de datos en la era digital, hemos optado por exportar todos
            los archivos musicales al formato <Remark href="#">m4a</Remark>.
            Esta decisión permite una reproducción de alta calidad mientras se
            mantiene un tamaño de archivo reducido, garantizando así una
            experiencia de usuario óptima.
          </P>
          <SectionTitle>Tecnología y diseño</SectionTitle>
          <P>
            Esta web ha sido desarrollada utilizando{" "}
            <Remark href="#">React</Remark>, una de las bibliotecas más
            populares y potentes para la creación de interfaces de usuario. Al
            no contar con un backend, toda la lógica y el contenido se ejecutan
            directamente en el navegador del usuario, lo que garantiza una
            experiencia fluida y rápida.
          </P>
        </AboutContainer>
        <CloseButton
          $aboutStatus={aboutStatus}
          onClick={() => setAboutStatus(false)}
        >
          &times;
        </CloseButton>
      </>
    );
  }
);

const Remark = styled.a`
  font-style: normal;
  background: rgba(0, 0, 0, 0.06);
  color: rgb(30, 30, 30);
  padding: 0.1rem 0.35rem;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  margin: 0 0.15rem;

  &:hover {
    background: rgba(0, 0, 0, 0.12);
  }
`;

const AboutContainer = styled.div<{ $aboutStatus: boolean }>`
  position: fixed;
  z-index: 99;
  top: 0;
  right: 0;
  width: 28rem;
  height: 100%;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  border-left: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.08);
  user-select: none;
  overflow-y: auto;
  overflow-x: hidden;
  transform: translateX(${(p) => (p.$aboutStatus ? "0%" : "100%")});
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: ${(p) => (p.$aboutStatus ? "1" : "0")};
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.12) transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.12);
    border-radius: 20px;
  }

  @media screen and (max-width: 768px) {
    width: 100%;
    z-index: 9;
  }
`;

const Header = styled.h2`
  padding: 1.5rem 1.5rem 1rem;
  font-size: 1.4rem;
  font-weight: 700;
  color: rgb(30, 30, 30);
`;

const SectionTitle = styled.h3`
  padding: 1.25rem 1.5rem 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: rgb(60, 60, 60);
`;

const P = styled.p`
  margin: 0.5rem 1.5rem 1rem;
  line-height: 1.7;
  font-size: 0.9rem;
  color: rgb(120, 120, 120);
`;

const CloseButton = styled.button<{ $aboutStatus: boolean }>`
  position: fixed;
  bottom: 2rem;
  z-index: 100;
  right: 2rem;
  background: rgba(0, 0, 0, 0.06);
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: rgb(100, 100, 100);
  display: ${(p) => (p.$aboutStatus ? "flex" : "none")};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.12);
    color: rgb(30, 30, 30);
  }
`;

export default About;
