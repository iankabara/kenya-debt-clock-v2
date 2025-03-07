// src/index.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider, createTheme } from "@mui/material";
import { CssBaseline } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Add this line
import "./i18n";

const lightTheme = createTheme({
  palette: { mode: "light", primary: { main: "#006400" }, secondary: { main: "#FF0000" } },
});

const darkTheme = createTheme({
  palette: { mode: "dark", primary: { main: "#32CD32" }, secondary: { main: "#FF4500" } },
});

const Root: React.FC = () => {
  const [darkMode, setDarkMode] = React.useState(false);


  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <App darkMode={darkMode} setDarkMode={setDarkMode} />
      <ToastContainer position="top-right" autoClose={3000} />
    </ThemeProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);