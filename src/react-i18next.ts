// src/react-i18next.d.ts
import "react-i18next";

declare module "react-i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: {
      translation: {
        home: string;
        debtProgression: string;
        settings: string;
        totalDebt: string;
        debtPerCitizen: string;
        debtInUSD: string;
        growthRate: string;
        useActualData: string;
        forecast: string;
        exportCSV: string;
        compareWith: string;
        notes: string;
        milestones: string;
        repaymentSimulator: string;
        annualRepayment: string;
        simulate: string;
        debtToGDP: string;
      };
    };
  }
}