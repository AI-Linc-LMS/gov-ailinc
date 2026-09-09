import { createTheme } from "@mui/material/styles";

/**
 * The MUI base theme. `components/providers/ThemeProvider.tsx` spreads this and
 * overrides only `primary`, `background` and `text` from the tenant settings, so
 * every other palette slot below is what the app actually renders. That is why
 * `secondary` matters: it used to be MUI's stock crimson-pink, and it
 * reached the screen through `color="secondary"` chips and buttons and through
 * `theme.palette.secondary.main` in the scorecard widget. It is now the
 * institutional teal that the government palette reserves for a secondary accent.
 * `primary` is the fallback for a tenant that ships no branding, so it is the
 * institutional blue rather than MUI's stock #1976d2.
 */
export const theme = createTheme({
  palette: {
    primary: {
      main: "#1b4f8a",
      light: "#4a7fbb",
      dark: "#164274",
      contrastText: "#fff",
    },
    secondary: {
      main: "#0f6b7a",
      light: "#3f8f9e",
      dark: "#0b5260",
      contrastText: "#fff",
    },
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },
    text: {
      primary: "rgba(0, 0, 0, 0.87)",
      secondary: "rgba(0, 0, 0, 0.6)",
    },
  },
  typography: {
    fontFamily: [
      '"Satoshi"',
      '"Satoshi Variable"',
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
          padding: "8px 16px",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        },
      },
    },
  },
});
