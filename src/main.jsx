// ============================================
// src/main.jsx
// This is the very first file that runs. It takes our <App />
// component and mounts it inside the <div id="root"> in index.html.
// ============================================

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./App.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);