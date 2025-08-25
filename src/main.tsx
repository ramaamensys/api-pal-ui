import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { DoctorAuthProvider } from "@/hooks/useDoctorAuth";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DoctorAuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </DoctorAuthProvider>
  </React.StrictMode>
);
