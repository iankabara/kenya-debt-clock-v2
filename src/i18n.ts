// src/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        home: "Home",
        debtProgression: "Debt Progression",
        settings: "Settings",
        totalDebt: "Total Debt (2025)",
        debtPerCitizen: "Debt per Citizen",
        debtInUSD: "Debt in USD",
        growthRate: "Debt Growth Rate",
        useActualData: "Use Actual Data (if available)",
        forecast: "Forecast to 2030",
        exportCSV: "Export to CSV",
        compareWith: "Compare with",
        notes: "Notes",
        milestones: "Debt Milestones",
        repaymentSimulator: "Debt Repayment Simulator",
        annualRepayment: "Annual Repayment (B KES)",
        simulate: "Simulate",
        debtToGDP: "Debt-to-GDP Ratio",
      },
    },
    sw: {
      translation: {
        home: "Nyumbani",
        debtProgression: "Maendeleo ya Deni",
        settings: "Mipangilio",
        totalDebt: "Jumla ya Deni (2025)",
        debtPerCitizen: "Deni kwa Mtu",
        debtInUSD: "Deni kwa USD",
        growthRate: "Kiwango cha Ukuaji wa Deni",
        useActualData: "Tumia Data Halisi (ikiwa inapatikana)",
        forecast: "Utabiri hadi 2030",
        exportCSV: "Hamisha kwa CSV",
        compareWith: "Linganisha na",
        notes: "Maelezo",
        milestones: "Hatua za Deni",
        repaymentSimulator: "Simulizi ya Kulipa Deni",
        annualRepayment: "Malipo ya Kila Mwaka (B KES)",
        simulate: "Chukua Simulizi",
        debtToGDP: "Uwiano wa Deni kwa Pato la Taifa",
      },
    },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;