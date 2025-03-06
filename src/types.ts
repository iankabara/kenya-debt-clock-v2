// src/types.ts
export interface DebtData {
    year: number;
    totalDebt: number; // in KES billions
    externalDebt: number; // in KES billions
    internalDebt: number; // in KES billions
    budgetDeficit: number; // in KES billions
    debtPerCitizen?: number; // in KES
  }
  
  export interface ExchangeRate {
    KES: number; // KES per USD
  }
  
  export interface ApiResponse {
    debtData: DebtData[];
    exchangeRate?: ExchangeRate;
  }