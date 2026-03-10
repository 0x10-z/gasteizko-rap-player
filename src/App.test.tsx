import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import { AudioPlayerProvider } from "./contexts/AudioPlayerContext";

describe("<App />", () => {
  beforeEach(() => {
    render(
      <AudioPlayerProvider>
        <Router>
          <App />
        </Router>
      </AudioPlayerProvider>
    );
  });

  test("renders without crashing", () => {
    const linkElement = screen.getByText(/VI y alrededores/i);
    expect(linkElement).toBeInTheDocument();
  });

  test("renders Nav component", () => {
    const tracklistButton = screen.getByRole("button", { name: /abrir tracklist/i });
    expect(tracklistButton).toBeInTheDocument();
  });

  test("renders Player component", () => {
    const playButton = screen.getByRole("button", { name: /reproducir|pausar/i });
    expect(playButton).toBeInTheDocument();
  });

  test("renders Library component", () => {
    const searchInput = screen.getByPlaceholderText(/busca un tema/i);
    expect(searchInput).toBeInTheDocument();
  });

  test("renders About component", () => {
    const aboutHeading = screen.getByRole("heading", { name: /sobre este proyecto/i });
    expect(aboutHeading).toBeInTheDocument();
  });

  test("renders Credit component", () => {
    const githubLink = screen.getByRole("link", { name: /github/i });
    expect(githubLink).toBeInTheDocument();
  });

  test("renders song progress slider", () => {
    const slider = screen.getByRole("slider", { name: /progreso/i });
    expect(slider).toBeInTheDocument();
  });
});
