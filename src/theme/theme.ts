// src/theme/theme.ts
import { createTheme } from '@mui/material/styles';

const shadows = [
  "none", // 0 - No shadow
  "0px 1px 3px rgba(0,0,0,0.12)", // 1 - Very light
  "0px 2px 6px rgba(0,0,0,0.08)", // 2 - Subtle
  "0px 4px 10px rgba(0,0,0,0.10)", // 3 - Premium depth
  ...Array(21).fill("none"), // Fill the rest with "none"
];

const theme = createTheme({
  palette: {
    primary: {
      main: '#6264A7', // Microsoft Teams-like color
      contrastText: '#FFFFFF', // white text on primary elements
    },
    secondary: {
      main: '#1E90FF', // Highlight color for special actions (dodger blue)
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FAFAFA', // Glossy, premium background 
      paper: '#FFFFFF',   // Used for cards, modals
    },
    text: {
      primary: '#212121', // Dark text for clean readability
      secondary: '#5F6368', // Subtle secondary text
    },
  },

  shape: {
    borderRadius: "25px"
  },

  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: { fontWeight: 700, fontSize: '2rem' },
    h2: { fontWeight: 600, fontSize: '1.5rem' },
    body1: { fontSize: '1rem' },
  },

  shadows: shadows as any,

  components: {
    // Apply subtle glossy background and shadow globally

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          boxShadow: '0px 1px 3px rgba(0,0,0,0.12)',
          borderRadius: '12px', // smooth rounded corners
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none', // keep button text clean
          fontWeight: 500,
        },
      },
    },
  },
});

export default theme;
