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
}

const HelpModal: FC<HelpModalProps> = ({ isOpen, onClose }) => {
  return (
    <ModalBackground $isOpen={isOpen} onClick={onClose}>
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
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: ${(props) => (props.$isOpen ? 1 : 0)};
  pointer-events: ${(props) => (props.$isOpen ? "auto" : "none")};
  transition: opacity 0.2s ease-in-out;
`;

const ModalContent = styled.div<{ $isOpen: boolean }>`
  position: relative;
  width: 70%;
  max-width: 500px;
  background: white;
  padding: 50px;
  border-radius: 10px;
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  background-color: rgba(255, 255, 255, 0.75);
  border-radius: 12px;
  border: 1px solid rgba(209, 213, 219, 0.3);
  transform: ${(props) => (props.$isOpen ? "scale(1)" : "scale(0.9)")};
  transition: transform 0.2s ease-in-out;

  h2 {
    font-size: 1.5em;
    margin-bottom: 20px;
  }

  ul {
    list-style-type: none;
    padding: 0;

    li {
      margin-bottom: 15px;
      font-size: 1.1em;

      svg {
        margin-right: 10px;
        vertical-align: middle;
      }
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
  color: #333;

  &:hover {
    color: #555;
  }
`;

export default HelpModal;
