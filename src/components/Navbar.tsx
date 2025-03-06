// src/components/Navbar.tsx
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  IconButton,
  Switch,
  Badge,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import TableChartIcon from "@mui/icons-material/TableChart";
import SettingsIcon from "@mui/icons-material/Settings";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useTranslation } from "react-i18next";
import { DebtData } from "../types";

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  debtData: DebtData[];
}

const Navbar: React.FC<NavbarProps> = ({ darkMode, toggleDarkMode, debtData }) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const value = ["/", "/progression", "/settings"].indexOf(location.pathname);
  const [notifications, setNotifications] = useState(0);

  useEffect(() => {
    const currentDebt = debtData.find((d) => d.year === 2025)?.totalDebt || 11000;
    const thresholds = [1000, 5000, 10000];
    const crossed = thresholds.filter((t) => currentDebt >= t).length;
    setNotifications(crossed);
  }, [debtData]);

  return (
    <AppBar position="static">
      <Toolbar>
        <Tabs value={value} textColor="inherit" indicatorColor="secondary" sx={{ flexGrow: 1 }}>
          <Tab icon={<HomeIcon />} label={t("home")} component={Link} to="/" />
          <Tab
            icon={<TableChartIcon />}
            label={t("debtProgression")}
            component={Link}
            to="/progression"
          />
          <Tab
            icon={<SettingsIcon />}
            label={t("settings")}
            component={Link}
            to="/settings"
          />
        </Tabs>
        <IconButton
          color="inherit"
          onClick={() => i18n.changeLanguage(i18n.language === "en" ? "sw" : "en")}
        >
          {i18n.language === "en" ? "SW" : "EN"}
        </IconButton>
        <IconButton color="inherit">
          <Badge badgeContent={notifications} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <IconButton color="inherit" onClick={toggleDarkMode}>
          <Brightness4Icon />
        </IconButton>
        <Switch checked={darkMode} onChange={toggleDarkMode} color="default" />
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;