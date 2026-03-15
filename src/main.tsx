import React from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "./theme/ThemeProvider.tsx";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);