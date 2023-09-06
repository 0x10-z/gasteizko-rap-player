import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import WebFontLoader from "webfontloader";

WebFontLoader.load({
  google: {
    families: ["Lato:400,700"],
  },
});

const root = document.getElementById("root");
const appRoot = ReactDOM.createRoot(root as HTMLElement);

appRoot.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();