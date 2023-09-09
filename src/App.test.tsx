import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";

describe("<App />", () => {
  beforeEach(() => {
    render(
      <Router>
        <App />
      </Router>
    );
  });

  test("renders without crashing", () => {
    const linkElement = screen.getByText(/VI y alrededores/i);
    expect(linkElement).toBeInTheDocument();
  });

  test("renders Nav component", () => {
    const navElement = screen.getByTestId("navigation");
    expect(navElement).toBeInTheDocument();
  });

  test("renders Player component", () => {
    const playerElement = screen.getByTestId("player");
    expect(playerElement).toBeInTheDocument();
  });

  test("renders Library component", () => {
    const libraryElement = screen.getByTestId("library");
    expect(libraryElement).toBeInTheDocument();
  });

  test("renders About component", () => {
    const aboutElement = screen.getByTestId("about");
    expect(aboutElement).toBeInTheDocument();
  });

  test("renders Credit component", () => {
    const creditElement = screen.getByTestId("credit");
    expect(creditElement).toBeInTheDocument();
  });

  test("renders HelpModal component", () => {
    const helpModalElement = screen.getByTestId("help-modal");
    expect(helpModalElement).toBeInTheDocument();
  });

  // ... tus otros tests
});
