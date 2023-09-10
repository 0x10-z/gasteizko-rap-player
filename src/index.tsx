import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import WebFontLoader from "webfontloader";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "./contexts/ThemeContext";

WebFontLoader.load({
  google: {
    families: ["Lato:400,700"],
  },
});

const root = document.getElementById("root");
const appRoot = ReactDOM.createRoot(root as HTMLElement);

appRoot.render(
  <ThemeProvider>
    <React.StrictMode>
      <ToastContainer />
      <Analytics />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  </ThemeProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
