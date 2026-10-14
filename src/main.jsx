import React from "react";
import ReactDOM from "react-dom/client";
import { CareerPage } from "./CareerPage";
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/header.css";
import "./styles/section-tabs.css";
import "./styles/career-page.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CareerPage />
  </React.StrictMode>,
);
