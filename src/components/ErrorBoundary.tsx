import { Component, type ReactNode } from "react";
import styled from "styled-components";

type Props = { children: ReactNode };
type State = { hasError: boolean };

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container>
          <Title>Algo ha fallado</Title>
          <Message>Recarga la página para volver a intentarlo.</Message>
          <ReloadButton onClick={() => window.location.reload()}>
            Recargar
          </ReloadButton>
        </Container>
      );
    }
    return this.props.children;
  }
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 1rem;
  font-family: inherit;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  color: rgb(40, 40, 40);
`;

const Message = styled.p`
  color: rgb(120, 120, 120);
  font-size: 0.95rem;
`;

const ReloadButton = styled.button`
  padding: 0.6rem 1.5rem;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.04);
  cursor: pointer;
  font-size: 0.9rem;
  font-family: inherit;
  color: rgb(60, 60, 60);
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.08);
  }
`;

export default ErrorBoundary;
