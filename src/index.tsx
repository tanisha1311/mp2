// index.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root")!);
const basename = process.env.NODE_ENV === "production" ? "/mp2" : "/";

root.render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
