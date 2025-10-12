import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Styles
import "./styles/web3modal-override.css";
import "./utils/web3modal-customizer";

// Config & Context
import { config } from "./config/web3modal";
import { WalletProvider } from "./context/WalletContext";
import { MLMProvider } from "./context/MLMContext";
import { ToastProvider } from "./components/common/ToastNotification";

// Components & Pages
import Navbar from "./components/Navbar";
import MLMDashboard from "./pages/MLMDashboard";
import MyHolding from "./pages/MyHolding";
import MyTeam from "./pages/MyTeam";
import SwapPage from "./pages/SwapPage";
import RewardsPage from "./pages/RewardsPage";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import ReferrersPage from "./pages/ReferrersPage";

// Theme configuration
const theme = createTheme({
  palette: {
    primary: {
      main: "#0a0214ffff",
      light: "#eae7edff",
      dark: "#ebecf0ff",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#00bcd4",
      light: "#62efff",
      dark: "#008ba3",
      contrastText: "#000000",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
    error: { main: "#f44336" },
    warning: { main: "#ff9800" },
    info: { main: "#2196f3" },
    success: { main: "#4caf50" },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: "none" },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 30,
          padding: "10px 24px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
        },
        containedPrimary: {
          "&:hover": { boxShadow: "0 6px 15px rgba(212, 209, 216, 0.3)" },
        },
        containedSecondary: {
          "&:hover": { boxShadow: "0 6px 15px rgba(0, 188, 212, 0.3)" },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: { borderRadius: 16 },
        elevation1: { boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)" },
        elevation3: { boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1)" },
      },
    },
  },
});

// React Query Client
const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <WalletProvider>
            <ToastProvider>
              <MLMProvider>
                <Router>
                  <Navbar />
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/dashboard" element={<MLMDashboard />} />

                    <Route path="/admin" element={<Admin />} />
                    <Route path="/referrers" element={<ReferrersPage />} />

                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Router>
              </MLMProvider>
            </ToastProvider>
          </WalletProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
}

export default App;
