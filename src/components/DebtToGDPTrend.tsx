// src/components/DebtToGDPTrend.tsx
import React from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { Typography, Paper, Box } from "@mui/material";
import { DebtData } from "../types";

interface DebtToGDPTrendProps {
  debtData: DebtData[];
}

const gdpData = { 2000: 1300, 2025: 7500 }; // Simplified GDP data (B KES)

const DebtToGDPTrend: React.FC<DebtToGDPTrendProps> = ({ debtData }) => {
  const trendData = debtData.map((d) => ({
    year: d.year,
    debtToGDP: ((d.totalDebt / (gdpData[d.year as keyof typeof gdpData] || gdpData[2025])) * 100).toFixed(1),
  }));

  return (
    <Paper sx={{ mt: 4, p: 3, bgcolor: "background.paper" }}>
      <Typography variant="h5" color="primary" gutterBottom sx={{ fontWeight: 600 }}>
        Debt-to-GDP Trend
      </Typography>
      <Box sx={{ height: 300 }}>
        <LineChart
          xAxis={[{ data: trendData.map((d) => d.year), label: "Year" }]}
          series={[
            {
              data: trendData.map((d) => parseFloat(d.debtToGDP)),
              label: "Debt-to-GDP (%)",
              color: "#006400",
            },
          ]}
          height={300}
          margin={{ top: 20, bottom: 50, left: 60, right: 20 }}
        />
      </Box>
    </Paper>
  );
};

export default DebtToGDPTrend;