import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { Analytics } from "@vercel/analytics/react";
import { AudioPlayerProvider } from "./contexts/AudioPlayerContext";

const root = document.getElementById("root");
const appRoot = ReactDOM.createRoot(root as HTMLElement);

appRoot.render(
  <React.StrictMode>
    <AudioPlayerProvider>
      <ToastContainer />
      <Analytics />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AudioPlayerProvider>
  </React.StrictMode>
);
