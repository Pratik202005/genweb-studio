import React from "react";
import ReactDOM from "react-dom";
import "./App.css";
import App from "./App";

// Suppress benign ResizeObserver loop error overlay in CRA dev mode
window.addEventListener("error", (e) => {
  if (
    typeof e?.message === "string" &&
    (e.message.includes("ResizeObserver loop completed with undelivered notifications") ||
     e.message.includes("ResizeObserver loop limit exceeded"))
  ) {
    e.stopImmediatePropagation();
    e.preventDefault();
  }
});

// Rendering the App component into the root element of your HTML
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
