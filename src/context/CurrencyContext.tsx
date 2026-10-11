import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CurrencyInfo,
  SUPPORTED_CURRENCIES,
  DEFAULT_CURRENCY,
  formatSalary,
  convertFromUsd,
  convertToUsd,
  getCurrencySymbol,
} from '../utils/currencyUtils.ts';

interface CurrencyContextType {
  currency: string;
  setCurrency: (currencyCode: string) => void;
  currencyInfo: CurrencyInfo;
  currencySymbol: string;
  formatSalary: (amountInUsd: number, period?: 'month' | 'year' | 'auto') => string;
  convertFromUsd: (amountInUsd: number) => number;
  convertToUsd: (amountInCurrency: number) => number;
  supportedCurrencies: CurrencyInfo[];
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('app_preferred_currency');
      if (saved && SUPPORTED_CURRENCIES[saved]) {
        return saved;
      }
    } catch {}
    return DEFAULT_CURRENCY;
  });

  const setCurrency = (newCurrency: string) => {
    if (SUPPORTED_CURRENCIES[newCurrency]) {
      setCurrencyState(newCurrency);
      try {
        localStorage.setItem('app_preferred_currency', newCurrency);
      } catch {}
    }
  };

  const currencyInfo = SUPPORTED_CURRENCIES[currency] || SUPPORTED_CURRENCIES.USD;
  const currencySymbol = currencyInfo.symbol;

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        currencyInfo,
        currencySymbol,
        formatSalary: (amount, period) => formatSalary(amount, currency, period),
        convertFromUsd: (amount) => convertFromUsd(amount, currency),
        convertToUsd: (amount) => convertToUsd(amount, currency),
        supportedCurrencies: Object.values(SUPPORTED_CURRENCIES),
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export function useCurrency(): CurrencyContextType {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
