// src/components/DebtClock.tsx
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Tooltip,
  TextField,
  InputAdornment,
  Box,
} from "@mui/material";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
} from "@mui/lab";
import { PieChart } from "@mui/x-charts/PieChart";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { DebtData } from "../types";

interface DebtClockProps {
  debtData: DebtData[];
  exchangeRate: number;
}

const milestones = [
  { threshold: 1000, label: "1 Trillion KES" },
  { threshold: 5000, label: "5 Trillion KES" },
  { threshold: 10000, label: "10 Trillion KES" },
];

const gdpData = { 2000: 1300, 2025: 7500 };

const DebtClock: React.FC<DebtClockProps> = ({ debtData, exchangeRate }) => {
  const { t } = useTranslation();
  const currentDebtData = debtData.find((d) => d.year === 2025);
  const initialDebt = (currentDebtData?.totalDebt || 11000) * 1_000_000_000;
  const [liveDebt, setLiveDebt] = useState(initialDebt);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveDebt((prev) => prev + 100000);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const pieData = [
    { id: 0, value: currentDebtData?.externalDebt || 5500, label: "External" },
    { id: 1, value: currentDebtData?.internalDebt || 5500, label: "Internal" },
  ];

  const debtToGDP = (((liveDebt / 1_000_000_000) / gdpData[2025]) * 100).toFixed(1);

  return (
    <Card sx={{ maxWidth: 600, mx: "auto", mt: 4, bgcolor: "background.paper" }}>
      <CardContent>
        <Tooltip title="Debt increases in real-time (simulated)">
          <Typography variant="h5" color="secondary" gutterBottom sx={{ fontWeight: 600 }}>
            {t("totalDebt")}:{" "}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {(liveDebt / 1_000_000_000).toFixed(2)}B KES
            </motion.span>
          </Typography>
        </Tooltip>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          {t("debtPerCitizen")}: ~{Math.round(liveDebt / 54_000_000).toLocaleString()} KES
        </Typography>
        <TextField
          label={t("debtInUSD")}
          value={((liveDebt / 1_000_000_000) / exchangeRate).toFixed(2)}
          InputProps={{
            endAdornment: <InputAdornment position="end">B USD</InputAdornment>,
            readOnly: true,
          }}
          fullWidth
          sx={{ mb: 2 }}
          variant="outlined"
        />
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          {t("debtToGDP")}: {debtToGDP}%
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <PieChart
            series={[{ data: pieData, innerRadius: 40, outerRadius: 100 }]}
            height={200}
            width={300}
          />
        </Box>
        <Timeline sx={{ mt: 2 }}>
          {milestones.map((milestone) => (
            <TimelineItem key={milestone.threshold}>
              <TimelineSeparator>
                <TimelineDot
                  color={
                    (liveDebt / 1_000_000_000) >= milestone.threshold ? "secondary" : "grey"
                  }
                />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                {milestone.label} ({(milestone.threshold / exchangeRate).toFixed(2)}B USD)
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </CardContent>
    </Card>
  );
};

export default DebtClock;