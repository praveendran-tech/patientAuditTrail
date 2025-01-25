// src/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
  palette: {
    primary: {
      main: "#3498DB", // Blue color for primary buttons
    },
    secondary: {
      main: "#2ECC71", // Green color for secondary buttons
    },
  },
});

export default theme;
