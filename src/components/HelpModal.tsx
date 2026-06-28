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
        onClick={(e: MouseEvent) => e.stopPropagation()}>
        <CloseButton onClick={onClose} aria-label="Cerrar">
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
  background: rgba(3, 5, 6, 0.72);
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
  border-radius: 24px;
  backdrop-filter: blur(40px) saturate(180%);
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  background: linear-gradient(
    180deg,
    rgba(12, 18, 22, 0.94),
    rgba(8, 12, 15, 0.96)
  );
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 26px 70px rgba(0, 0, 0, 0.28);
  transform: ${(props) => (props.$isOpen ? "scale(1)" : "scale(0.95)")};
  transition: transform 0.25s ease-in-out;

  h2 {
    font-size: 1.3rem;
    margin-bottom: 1.5rem;
    color: #f3fbf5;
    font-weight: 700;
  }

  ul {
    list-style-type: none;
    padding: 0;

    li {
      margin-bottom: 1rem;
      font-size: 0.95rem;
      color: rgba(205, 217, 208, 0.78);
      line-height: 1.5;

      strong {
        color: #f0f9f2;
      }

      svg {
        margin-right: 10px;
        vertical-align: middle;
        color: rgba(29, 185, 84, 0.9);
      }
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(255, 255, 255, 0.06);
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  color: rgba(234, 244, 237, 0.76);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    color: #ffffff;
  }
`;

export default HelpModal;
