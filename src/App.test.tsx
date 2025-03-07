// src/App.test.tsx
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material";
import { ToastContainer } from "react-toastify";
import App from "./App";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#006400" },
    secondary: { main: "#FF0000" },
  },
});

test("renders Kenya Debt Clock title", () => {
  const mockSetDarkMode = jest.fn(); // Mock function for setDarkMode
  render(
    <ThemeProvider theme={lightTheme}>
      <Router>
        <App darkMode={false} setDarkMode={mockSetDarkMode} />
        <ToastContainer />
      </Router>
    </ThemeProvider>
  );
  const titleElement = screen.getByText(/Kenya Debt Clock V2/i);
  expect(titleElement).toBeInTheDocument();
});