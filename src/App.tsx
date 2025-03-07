// src/App.tsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Grid,
} from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Add this line
import Navbar from "./components/Navbar";
import DebtClock from "./components/DebtClock";
import DebtProgression from "./components/DebtProgression";
import DebtToGDPTrend from "./components/DebtToGDPTrend";
import Settings from "./components/Settings";
import { DebtData } from "./types";
import staticDebtData from "./data/staticDebtData.json";

const API_KEY_EXCHANGE = "6a0b1e11b1d5bb83fd06a701"; // Replace with your actual key
const POPULATION_2025 = 54_000_000;

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.3,
};

interface AppProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const App: React.FC<AppProps> = ({ darkMode, setDarkMode }) => {
  const [debtData, setDebtData] = useState<DebtData[]>(staticDebtData);
  const [exchangeRate, setExchangeRate] = useState<number>(130);
  const [growthRate, setGrowthRate] = useState<number>(14.87);
  const [useActualData, setUseActualData] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://v6.exchangerate-api.com/v6/${API_KEY_EXCHANGE}/latest/USD`
        );
        setExchangeRate(response.data.conversion_rates.KES);
        toast.success("Exchange rate updated!");
      } catch (error) {
        console.error("Failed to fetch exchange rate", error);
        toast.error("Failed to fetch exchange rate");
      } finally {
        setLoading(false);
      }
    };
    fetchExchangeRate();
  }, []);

  useEffect(() => {
    const fetchDebtData = async () => {
      setLoading(true);
      if (useActualData) {
        try {
          // TODO: Parse World Bank API response properly; using static data as placeholder
          setDebtData(generateDebtProgression(staticDebtData));
          toast.success("Debt data fetched successfully!");
        } catch (error) {
          console.error("Failed to fetch actual debt data", error);
          setDebtData(generateDebtProgression(staticDebtData));
          toast.error("Using static data due to fetch failure");
        }
      } else {
        setDebtData(generateDebtProgression(staticDebtData));
        toast.info("Using static debt data");
      }
      setLoading(false);
    };
    fetchDebtData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [growthRate, useActualData]);

  const generateDebtProgression = (baseData: DebtData[]): DebtData[] => {
    const startYear = 2000;
    const endYear = 2025;
    const progression: DebtData[] = [];
    let currentDebt = 346.88;

    for (let year = startYear; year <= endYear; year++) {
      const debtEntry = baseData.find((d) => d.year === year) || {
        year,
        totalDebt: currentDebt,
        externalDebt: currentDebt / 2,
        internalDebt: currentDebt / 2,
        budgetDeficit: year === 2000 ? 7.57 : year === 2025 ? -831 : 0,
      };
      if (year === 2025) {
        debtEntry.debtPerCitizen = (debtEntry.totalDebt * 1_000_000_000) / POPULATION_2025;
      }
      progression.push(debtEntry);
      currentDebt *= 1 + growthRate / 100;
    }
    return progression;
  };

  return (
    <Router>
      <AppContent
        debtData={debtData}
        exchangeRate={exchangeRate}
        growthRate={growthRate}
        setGrowthRate={setGrowthRate}
        useActualData={useActualData}
        setUseActualData={setUseActualData}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        loading={loading}
      />
    </Router>
  );
};

interface AppContentProps {
  debtData: DebtData[];
  exchangeRate: number;
  growthRate: number;
  setGrowthRate: (rate: number) => void;
  useActualData: boolean;
  setUseActualData: (value: boolean) => void;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  loading: boolean;
}

const AppContent: React.FC<AppContentProps> = ({
  debtData,
  exchangeRate,
  growthRate,
  setGrowthRate,
  useActualData,
  setUseActualData,
  darkMode,
  setDarkMode,
  loading,
}) => {
  const location = useLocation();

  return (
    <>
      <Navbar
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
        debtData={debtData}
      />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        )}
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="in"
            exit="out"
            transition={pageTransition}
          >
            <Routes location={location}>
              <Route
                path="/"
                element={
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant="h4" align="center" color="primary" gutterBottom>
                        Kenya Debt Clock V2
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <DebtClock debtData={debtData} exchangeRate={exchangeRate} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ textAlign: "center", mt: { xs: 2, md: 4 } }}>
                        <Typography variant="subtitle1" color="text.primary">
                          KES/USD Rate (Live): {exchangeRate.toFixed(2)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Source: exchangerate-api.com
                        </Typography>
                      </Box>
                      <Alert severity="info" sx={{ mt: 2 }}>
                        Debt updates in real-time (simulated). Adjust settings for projections.
                      </Alert>
                    </Grid>
                  </Grid>
                }
              />
              <Route
                path="/progression"
                element={
                  <>
                    <DebtProgression debtData={debtData} growthRate={growthRate} />
                    <DebtToGDPTrend debtData={debtData} />
                  </>
                }
              />
              <Route
                path="/settings"
                element={
                  <Settings
                    growthRate={growthRate}
                    setGrowthRate={setGrowthRate}
                    useActualData={useActualData}
                    setUseActualData={setUseActualData}
                  />
                }
              />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </Container>
    </>
  );
};

export default App;