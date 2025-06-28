import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import CollegeProvider from "./components/utils/GlobalContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CollegeProvider>
      <App />
    </CollegeProvider>
  </StrictMode>
);
