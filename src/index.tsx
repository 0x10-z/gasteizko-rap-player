import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { Analytics } from "@vercel/analytics/react";
import { AudioPlayerProvider } from "./contexts/AudioPlayerContext";
import ErrorBoundary from "./components/ErrorBoundary";

const root = document.getElementById("root");
const appRoot = ReactDOM.createRoot(root as HTMLElement);

appRoot.render(
  <StrictMode>
    <ErrorBoundary>
      <AudioPlayerProvider>
        <ToastContainer />
        <Analytics />
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AudioPlayerProvider>
    </ErrorBoundary>
  </StrictMode>
);
