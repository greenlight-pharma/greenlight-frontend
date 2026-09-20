import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles.css";
import "./care2.css";

createRoot(document.getElementById("root")!).render(<React.StrictMode><BrowserRouter basename="/vytal-care2/app"><App /></BrowserRouter></React.StrictMode>);
