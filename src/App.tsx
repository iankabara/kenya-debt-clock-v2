// src/App.tsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import axios from "axios";
import {
  Container,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Grid,
} from "@mui/material";
import Navbar from "./components/Navbar";
import DebtClock from "./components/DebtClock";
import DebtProgression from "./components/DebtProgression";
import Settings from "./components/Settings";
import { DebtData } from "./types";
import staticDebtData from "./data/staticDebtData.json";
import "./transitions.css";

const API_KEY_EXCHANGE = "YOUR_EXCHANGE_RATE_API_KEY";
const POPULATION_2025 = 54_000_000;

const App: React.FC = () => {
  const [debtData, setDebtData] = useState<DebtData[]>(staticDebtData);
  const [exchangeRate, setExchangeRate] = useState<number>(130);
  const [growthRate, setGrowthRate] = useState<number>(14.87);
  const [useActualData, setUseActualData] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fetchExchangeRate = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://v6.exchangerate-api.com/v6/${API_KEY_EXCHANGE}/latest/USD`
        );
        setExchangeRate(response.data.conversion_rates.KES);
      } catch (error) {
        console.error("Failed to fetch exchange rate", error);
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
          const response = await axios.get(
            "https://api.worldbank.org/v2/country/KE/indicator/DT.DOD.DECT.CD?format=json"
          );
          // Placeholder: Map actual data
          setDebtData(generateDebtProgression(staticDebtData));
        } catch (error) {
          console.error("Failed to fetch actual debt data", error);
          setDebtData(generateDebtProgression(staticDebtData));
        }
      } else {
        setDebtData(generateDebtProgression(staticDebtData));
      }
      setLoading(false);
    };
    fetchDebtData();
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
    <>
      <Navbar darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} debtData={debtData} />
      <Container sx={{ py: 4 }}>
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        )}
        <TransitionGroup>
          <CSSTransition
            key={location.pathname}
            classNames="fade"
            timeout={300}
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
                      <Box sx={{ textAlign: "center", mt: 4 }}>
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
                element={<DebtProgression debtData={debtData} growthRate={growthRate} />}
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
          </CSSTransition>
        </TransitionGroup>
      </Container>
    </>
  );
};

export default App;