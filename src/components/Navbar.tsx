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
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  ListItemButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import TableChartIcon from "@mui/icons-material/TableChart";
import SettingsIcon from "@mui/icons-material/Settings";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuIcon from "@mui/icons-material/Menu";
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const value = ["/", "/progression", "/settings"].indexOf(location.pathname);
  const [notifications, setNotifications] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const currentDebt = debtData.find((d) => d.year === 2025)?.totalDebt || 11000;
    const thresholds = [1000, 5000, 10000];
    const crossed = thresholds.filter((t) => currentDebt >= t).length;
    setNotifications(crossed);
  }, [debtData]);

  const navItems = [
    { label: t("home"), icon: <HomeIcon />, to: "/" },
    { label: t("debtProgression"), icon: <TableChartIcon />, to: "/progression" },
    { label: t("settings"), icon: <SettingsIcon />, to: "/settings" },
  ];

  // In drawerContent:
  const drawerContent = (
    <List>
      {navItems.map((item, index) => (
        <ListItem key={item.label} disablePadding>
          <ListItemButton
            component={Link}
            to={item.to}
            selected={value === index}
            onClick={() => setDrawerOpen(false)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );

  return (
    <AppBar position="sticky">
      <Toolbar>
        {isMobile ? (
          <>
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setDrawerOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
              {drawerContent}
            </Drawer>
          </>
        ) : (
          <Tabs
            value={value === -1 ? false : value} // Handle unmatched routes
            textColor="inherit"
            indicatorColor="secondary"
            sx={{ flexGrow: 1 }}
          >
            {navItems.map((item) => (
              <Tooltip title={item.label} key={item.label}>
                <Tab
                  icon={item.icon}
                  label={item.label}
                  component={Link}
                  to={item.to}
                  sx={{ minWidth: 100 }}
                />
              </Tooltip>
            ))}
          </Tabs>
        )}
        <Tooltip title={t("language")}>
          <IconButton
            color="inherit"
            onClick={() => i18n.changeLanguage(i18n.language === "en" ? "sw" : "en")}
          >
            {i18n.language === "en" ? "SW" : "EN"}
          </IconButton>
        </Tooltip>
        <Tooltip title="Notifications">
          <IconButton color="inherit">
            <Badge badgeContent={notifications} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Tooltip>
        <Tooltip title="Toggle Dark Mode">
          <IconButton color="inherit" onClick={toggleDarkMode}>
            <Brightness4Icon />
          </IconButton>
        </Tooltip>
        <Switch checked={darkMode} onChange={toggleDarkMode} color="default" />
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;