// src/components/Settings.tsx
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Slider,
  Switch,
  FormControlLabel,
} from "@mui/material";

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
}) => (
  <Card sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        Debt Growth Rate: {growthRate.toFixed(2)}% per year
      </Typography>
      <Slider
        value={growthRate}
        onChange={(_, value) => setGrowthRate(value as number)}
        min={0}
        max={20}
        step={0.1}
        color="primary"
        valueLabelDisplay="auto"
      />
      <FormControlLabel
        control={
          <Switch
            checked={useActualData}
            onChange={(e) => setUseActualData(e.target.checked)}
            color="primary"
          />
        }
        label="Use Actual Data (if available)"
      />
    </CardContent>
  </Card>
);

export default Settings;