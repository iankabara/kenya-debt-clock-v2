// src/components/Settings.tsx
import React from "react";
import {
  Typography,
  Slider,
  Switch,
  FormControlLabel,
  Paper,
} from "@mui/material";
import { useTranslation } from "react-i18next";

interface SettingsProps {
  growthRate: number;
  setGrowthRate: (rate: number) => void;
  useActualData: boolean;
  setUseActualData: (value: boolean) => void;
}

const Settings: React.FC<SettingsProps> = ({
  growthRate,
  setGrowthRate,
  useActualData,
  setUseActualData,
}) => {
  const { t } = useTranslation();

  return (
    <Paper sx={{ maxWidth: 600, mx: "auto", mt: 4, p: 3, bgcolor: "background.paper" }}>
      <Typography variant="h5" color="primary" gutterBottom sx={{ fontWeight: 600 }}>
        {t("settings")}
      </Typography>
      <Typography gutterBottom>{t("growthRate")}</Typography>
      <Slider
        value={growthRate}
        onChange={(_, newValue) => setGrowthRate(newValue as number)}
        min={0}
        max={50}
        step={0.1}
        valueLabelDisplay="auto"
        sx={{ mb: 3 }}
      />
      <FormControlLabel
        control={
          <Switch
            checked={useActualData}
            onChange={(e) => setUseActualData(e.target.checked)}
          />
        }
        label={t("useActualData")}
      />
    </Paper>
  );
};

export default Settings;