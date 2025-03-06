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
} from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { useTranslation } from "react-i18next";
import { DebtData } from "../types";
import Papa from "papaparse";

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

  const forecastYears = 5;

  const forecastData = (withRepayment = false) => {
    const lastDebt = debtData[debtData.length - 1];
    const futureData: DebtData[] = [];
    let currentDebt = lastDebt.totalDebt;
    for (let year = 2026; year <= 2025 + forecastYears; year++) {
      currentDebt = currentDebt * (1 + growthRate / 100) - (withRepayment ? repaymentAmount : 0);
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

  return (
    <Paper sx={{ mt: 4, p: 2 }}>
      <LineChart
        xAxis={[{ data: debtData.map((d) => d.year), label: "Year" }]}
        series={[
          {
            data: debtData.map((d) => d.totalDebt),
            label: "Kenya Debt (B KES)",
            color: "#1976d2",
          },
          ...(comparisonCountry === "Uganda"
            ? [
                {
                  data: ugandaDebtData.map((d) => d.totalDebt),
                  label: "Uganda Debt (B UGX)",
                  color: "#f87171",
                },
              ]
            : []),
        ]}
        height={300}
        margin={{ top: 20, bottom: 50, left: 60, right: 20 }}
      />
      <TextField
        select
        label={t("compareWith")}
        value={comparisonCountry || ""}
        onChange={(e) => setComparisonCountry(e.target.value || null)}
        sx={{ mt: 2, minWidth: 200 }}
      >
        <MenuItem value="">None</MenuItem>
        <MenuItem value="Uganda">Uganda</MenuItem>
      </TextField>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#1976d2" }}>
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
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2, mr: 2 }}
        onClick={exportToCSV}
      >
        {t("exportCSV")}
      </Button>
      <Button
        variant="outlined"
        color="primary"
        sx={{ mt: 2, mr: 2 }}
        onClick={() => setForecastOpen(true)}
      >
        {t("forecast")}
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        sx={{ mt: 2 }}
        onClick={() => setRepaymentOpen(true)}
      >
        {t("repaymentSimulator")}
      </Button>
      <Dialog open={forecastOpen} onClose={() => setForecastOpen(false)}>
        <DialogTitle>{t("forecast")}</DialogTitle>
        <DialogContent>
          <LineChart
            xAxis={[{ data: forecastData().map((d) => d.year), label: "Year" }]}
            series={[
              {
                data: forecastData().map((d) => d.totalDebt),
                label: "Projected Debt (B KES)",
                color: "#dc2626",
              },
            ]}
            height={300}
          />
          <Typography variant="caption" color="text.secondary">
            Based on current growth rate: {growthRate.toFixed(2)}%
          </Typography>
        </DialogContent>
      </Dialog>
      <Dialog open={repaymentOpen} onClose={() => setRepaymentOpen(false)}>
        <DialogTitle>{t("repaymentSimulator")}</DialogTitle>
        <DialogContent>
          <TextField
            label={t("annualRepayment")}
            type="number"
            value={repaymentAmount}
            onChange={(e) => setRepaymentAmount(Number(e.target.value))}
            sx={{ mt: 2, width: "100%" }}
          />
          <LineChart
            xAxis={[{ data: forecastData(true).map((d) => d.year), label: "Year" }]}
            series={[
              {
                data: forecastData(true).map((d) => d.totalDebt),
                label: "Debt with Repayment (B KES)",
                color: "#4caf50",
              },
            ]}
            height={300}
          />
          <Typography variant="caption" color="text.secondary">
            Repayment: {repaymentAmount}B KES/year
          </Typography>
        </DialogContent>
      </Dialog>
    </Paper>
  );
};

export default DebtProgression;