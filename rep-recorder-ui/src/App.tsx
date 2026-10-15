import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Homepage from "./components/homepage";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#e4572e" },
    secondary: { main: "#2b2d42" },
    background: { default: "#f3f4f7", paper: "#ffffff" },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: "system-ui, 'Segoe UI', Roboto, sans-serif",
    button: { textTransform: "none", fontWeight: 600 },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Toaster position="top-right" />
        <Homepage />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
