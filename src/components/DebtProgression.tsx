// src/components/DebtProgression.tsx
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  TextField,
  MenuItem,
  Box,
  Grid,
} from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { DataGrid, GridCellParams } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";
import { DebtData } from "../types";
import Papa from "papaparse";
import "./DebtProgression.css"; // Import CSS

interface DebtProgressionProps {
  debtData: DebtData[];
  growthRate: number;
}

const ugandaDebtData: DebtData[] = [
  { year: 2000, totalDebt: 200, externalDebt: 150, internalDebt: 50, budgetDeficit: 5 },
  { year: 2025, totalDebt: 4000, externalDebt: 3000, internalDebt: 1000, budgetDeficit: -200 },
];

const DebtProgression: React.FC<DebtProgressionProps> = ({ debtData, growthRate }) => {
  const { t } = useTranslation();
  const [forecastOpen, setForecastOpen] = useState(false);
  const [repaymentOpen, setRepaymentOpen] = useState(false);
  const [comparisonCountry, setComparisonCountry] = useState<string | null>(null);
  const [notes, setNotes] = useState<{ [year: number]: string }>({});
  const [repaymentAmount, setRepaymentAmount] = useState<number>(0);
  const [interestRate, setInterestRate] = useState<number>(5);

  const forecastYears = 5;

  const forecastData = (withRepayment = false) => {
    const lastDebt = debtData[debtData.length - 1];
    const futureData: DebtData[] = [];
    let currentDebt = lastDebt.totalDebt;
    for (let year = 2026; year <= 2025 + forecastYears; year++) {
      currentDebt = withRepayment
        ? currentDebt * (1 + interestRate / 100) - repaymentAmount
        : currentDebt * (1 + growthRate / 100);
      futureData.push({
        year,
        totalDebt: Math.max(currentDebt, 0),
        externalDebt: currentDebt / 2,
        internalDebt: currentDebt / 2,
        budgetDeficit: 0,
        debtPerCitizen: (currentDebt * 1_000_000_000) / 54_000_000,
      });
    }
    return [...debtData, ...futureData];
  };

  const exportToCSV = () => {
    const csv = Papa.unparse(debtData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "kenya_debt_progression.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const heatmapData = debtData.map((d) => ({
    id: d.year,
    year: d.year,
    totalDebt: d.totalDebt,
    externalDebt: d.externalDebt,
    internalDebt: d.internalDebt,
  }));

  const columns = [
    { field: "year", headerName: "Year", width: 100 },
    { field: "totalDebt", headerName: "Total Debt (B KES)", width: 150 },
    { field: "externalDebt", headerName: "External (B KES)", width: 150 },
    { field: "internalDebt", headerName: "Internal (B KES)", width: 150 },
  ];

  const getHeatmapClassName = (params: GridCellParams): string => {
    const maxDebt = Math.max(...heatmapData.map((d) => d.totalDebt));
    const value = params.value as number;
    const ratio = value / maxDebt;
    if (ratio < 0.2) return "heatmap-cell-0";
    if (ratio < 0.4) return "heatmap-cell-1";
    if (ratio < 0.6) return "heatmap-cell-2";
    if (ratio < 0.8) return "heatmap-cell-3";
    return "heatmap-cell-4";
  };

  return (
    <Paper sx={{ mt: 4, p: 3, bgcolor: "background.paper" }}>
      <Typography variant="h5" color="primary" gutterBottom sx={{ fontWeight: 600 }}>
        {t("debtProgression")}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <LineChart
            xAxis={[{ data: debtData.map((d) => d.year), label: "Year" }]}
            series={[
              {
                data: debtData.map((d) => d.totalDebt),
                label: "Kenya Debt (B KES)",
                color: "#006400",
              },
              ...(comparisonCountry === "Uganda"
                ? [
                    {
                      data: ugandaDebtData.map((d) => d.totalDebt),
                      label: "Uganda Debt (B UGX)",
                      color: "#FF0000",
                    },
                  ]
                : []),
            ]}
            height={300}
            margin={{ top: 20, bottom: 50, left: 60, right: 20 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            select
            label={t("compareWith")}
            value={comparisonCountry || ""}
            onChange={(e) => setComparisonCountry(e.target.value || null)}
            sx={{ minWidth: 200, mb: 2 }}
            fullWidth
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="Uganda">Uganda</MenuItem>
          </TextField>
          <Typography variant="subtitle1" gutterBottom>
            Debt Heatmap
          </Typography>
          <Box sx={{ height: 200 }}>
            <DataGrid
              rows={heatmapData}
              columns={columns}
              disableRowSelectionOnClick
              getCellClassName={getHeatmapClassName}
            />
          </Box>
        </Grid>
      </Grid>
      <TableContainer sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "primary.main" }}>
              <TableCell sx={{ color: "white" }}>Year</TableCell>
              <TableCell sx={{ color: "white" }}>Total Debt (B KES)</TableCell>
              <TableCell sx={{ color: "white" }}>External (B KES)</TableCell>
              <TableCell sx={{ color: "white" }}>Internal (B KES)</TableCell>
              <TableCell sx={{ color: "white" }}>Budget Deficit (B KES)</TableCell>
              <TableCell sx={{ color: "white" }}>Debt/Citizen (KES)</TableCell>
              <TableCell sx={{ color: "white" }}>{t("notes")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {debtData.map((data) => (
              <TableRow key={data.year} hover>
                <TableCell>{data.year}</TableCell>
                <TableCell>{data.totalDebt.toFixed(2)}</TableCell>
                <TableCell>{data.externalDebt.toFixed(2)}</TableCell>
                <TableCell>{data.internalDebt.toFixed(2)}</TableCell>
                <TableCell>{data.budgetDeficit.toFixed(2)}</TableCell>
                <TableCell>
                  {data.debtPerCitizen ? data.debtPerCitizen.toFixed(0) : "-"}
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    value={notes[data.year] || ""}
                    onChange={(e) =>
                      setNotes({ ...notes, [data.year]: e.target.value })
                    }
                    placeholder={t("notes")}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ mt: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Button variant="contained" color="primary" onClick={exportToCSV}>
          {t("exportCSV")}
        </Button>
        <Button variant="outlined" color="primary" onClick={() => setForecastOpen(true)}>
          {t("forecast")}
        </Button>
        <Button variant="outlined" color="secondary" onClick={() => setRepaymentOpen(true)}>
          {t("repaymentSimulator")}
        </Button>
      </Box>
      <Dialog open={forecastOpen} onClose={() => setForecastOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{t("forecast")}</DialogTitle>
        <DialogContent>
          <LineChart
            xAxis={[{ data: forecastData().map((d) => d.year), label: "Year" }]}
            series={[
              {
                data: forecastData().map((d) => d.totalDebt),
                label: "Projected Debt (B KES)",
                color: "#FF0000",
              },
            ]}
            height={300}
          />
          <Typography variant="caption" color="text.secondary">
            Based on current growth rate: {growthRate.toFixed(2)}%
          </Typography>
        </DialogContent>
      </Dialog>
      <Dialog open={repaymentOpen} onClose={() => setRepaymentOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{t("repaymentSimulator")}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label={t("annualRepayment")}
                type="number"
                value={repaymentAmount}
                onChange={(e) => setRepaymentAmount(Number(e.target.value))}
                fullWidth
                sx={{ mt: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Interest Rate (%)"
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                fullWidth
                sx={{ mt: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <LineChart
                xAxis={[{ data: forecastData(true).map((d) => d.year), label: "Year" }]}
                series={[
                  {
                    data: forecastData(true).map((d) => d.totalDebt),
                    label: "Debt with Repayment (B KES)",
                    color: "#32CD32",
                  },
                ]}
                height={300}
              />
            </Grid>
          </Grid>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            Repayment: {repaymentAmount}B KES/year, Interest Rate: {interestRate}%
          </Typography>
        </DialogContent>
      </Dialog>
    </Paper>
  );
};

export default DebtProgression;