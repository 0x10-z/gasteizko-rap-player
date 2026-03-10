import { FC, MouseEvent } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpaceShuttle,
  faArrowRight,
  faArrowLeft,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  [x: string]: any;
}

const HelpModal: FC<HelpModalProps> = ({ isOpen, onClose, ...rest }) => {
  return (
    <ModalBackground $isOpen={isOpen} onClick={onClose} {...rest}>
      <ModalContent
        $isOpen={isOpen}
        onClick={(e: MouseEvent) => e.stopPropagation()}
      >
        <CloseButton onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </CloseButton>
        <h2>Atajos del Teclado</h2>
        <ul>
          <li>
            <FontAwesomeIcon icon={faSpaceShuttle} size="lg" />{" "}
            <strong>Barra espaciadora:</strong> Reproduce o pausa la canción.
          </li>
          <li>
            <FontAwesomeIcon icon={faArrowRight} size="lg" />{" "}
            <strong>Flecha derecha:</strong> Siguiente canción.
          </li>
          <li>
            <FontAwesomeIcon icon={faArrowLeft} size="lg" />{" "}
            <strong>Flecha izquierda:</strong> Canción anterior.
          </li>
          <li>
            <FontAwesomeIcon icon={faArrowRight} size="lg" />
            <FontAwesomeIcon icon={faArrowLeft} size="lg" />{" "}
            <strong>Mantener flechas:</strong> Avanza o retrocede la canción
            actual.
          </li>
        </ul>
      </ModalContent>
    </ModalBackground>
  );
};

const ModalBackground = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: ${(props) => (props.$isOpen ? 1 : 0)};
  pointer-events: ${(props) => (props.$isOpen ? "auto" : "none")};
  transition: opacity 0.25s ease-in-out;
  z-index: 200;
`;

const ModalContent = styled.div<{ $isOpen: boolean }>`
  position: relative;
  width: 90%;
  max-width: 460px;
  padding: 2.5rem;
  border-radius: 16px;
  backdrop-filter: blur(40px) saturate(180%);
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  transform: ${(props) => (props.$isOpen ? "scale(1)" : "scale(0.95)")};
  transition: transform 0.25s ease-in-out;

  h2 {
    font-size: 1.3rem;
    margin-bottom: 1.5rem;
    color: rgb(30, 30, 30);
    font-weight: 700;
  }

  ul {
    list-style-type: none;
    padding: 0;

    li {
      margin-bottom: 1rem;
      font-size: 0.95rem;
      color: rgb(100, 100, 100);
      line-height: 1.5;

      strong {
        color: rgb(40, 40, 40);
      }

      svg {
        margin-right: 10px;
        vertical-align: middle;
        color: rgb(150, 150, 150);
      }
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.05);
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  color: rgb(150, 150, 150);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.08);
    color: rgb(50, 50, 50);
  }
`;

export default HelpModal;
