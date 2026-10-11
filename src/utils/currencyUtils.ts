export interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
  flag: string;
  rateToUsd: number; // 1 USD = rate units of target currency
  formatPrefix?: string;
  formatSuffix?: string;
}

export const SUPPORTED_CURRENCIES: Record<string, CurrencyInfo> = {
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    flag: '🇺🇸',
    rateToUsd: 1.0,
    formatPrefix: '$',
  },
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    flag: '🇮🇳',
    rateToUsd: 86.5,
    formatPrefix: '₹',
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    flag: '🇪🇺',
    rateToUsd: 0.92,
    formatPrefix: '€',
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    flag: '🇬🇧',
    rateToUsd: 0.78,
    formatPrefix: '£',
  },
  CAD: {
    code: 'CAD',
    symbol: 'CA$',
    name: 'Canadian Dollar',
    flag: '🇨🇦',
    rateToUsd: 1.38,
    formatPrefix: 'CA$',
  },
  AUD: {
    code: 'AUD',
    symbol: 'A$',
    name: 'Australian Dollar',
    flag: '🇦🇺',
    rateToUsd: 1.54,
    formatPrefix: 'A$',
  },
  SGD: {
    code: 'SGD',
    symbol: 'S$',
    name: 'Singapore Dollar',
    flag: '🇸🇬',
    rateToUsd: 1.34,
    formatPrefix: 'S$',
  },
  JPY: {
    code: 'JPY',
    symbol: '¥',
    name: 'Japanese Yen',
    flag: '🇯🇵',
    rateToUsd: 152.0,
    formatPrefix: '¥',
  },
  AED: {
    code: 'AED',
    symbol: 'AED',
    name: 'UAE Dirham',
    flag: '🇦🇪',
    rateToUsd: 3.67,
    formatPrefix: 'AED ',
  },
  CHF: {
    code: 'CHF',
    symbol: 'CHF',
    name: 'Swiss Franc',
    flag: '🇨🇭',
    rateToUsd: 0.88,
    formatPrefix: 'CHF ',
  },
};

export const DEFAULT_CURRENCY = 'USD';

/**
 * Converts a baseline USD amount to the target currency amount.
 */
export function convertFromUsd(amountInUsd: number, targetCurrency: string): number {
  const info = SUPPORTED_CURRENCIES[targetCurrency] || SUPPORTED_CURRENCIES.USD;
  return Math.round(amountInUsd * info.rateToUsd);
}

/**
 * Converts a target currency amount back to baseline USD amount.
 */
export function convertToUsd(amountInCurrency: number, sourceCurrency: string): number {
  const info = SUPPORTED_CURRENCIES[sourceCurrency] || SUPPORTED_CURRENCIES.USD;
  if (!info.rateToUsd || info.rateToUsd <= 0) return amountInCurrency;
  return Math.round(amountInCurrency / info.rateToUsd);
}

/**
 * Formats a number with appropriate locale commas (e.g. Indian numbering for INR).
 */
export function formatNumberWithLocale(amount: number, currencyCode: string): string {
  if (currencyCode === 'INR') {
    // Indian numbering format: e.g. 1,00,000
    try {
      return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(amount);
    } catch {
      return amount.toLocaleString();
    }
  }
  return amount.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

/**
 * Formats a monthly stipend given an original USD monthly amount.
 */
export function formatSalary(
  amountInUsd: number,
  targetCurrency: string = 'USD',
  period: 'month' | 'year' | 'auto' = 'month'
): string {
  const info = SUPPORTED_CURRENCIES[targetCurrency] || SUPPORTED_CURRENCIES.USD;
  const prefix = info.formatPrefix || info.symbol;

  if (!amountInUsd || amountInUsd <= 0) {
    return 'Competitive / Unpaid';
  }

  // If amount is large (> 25000), it's likely an annual figure
  const isAnnual = period === 'year' || (period === 'auto' && amountInUsd > 25000);

  if (isAnnual) {
    const annualUsd = period === 'year' ? amountInUsd : amountInUsd;
    const converted = Math.round(annualUsd * info.rateToUsd);

    if (targetCurrency === 'INR') {
      // Show in Lakhs Per Annum (LPA) if applicable
      const lakhs = (converted / 100000).toFixed(1);
      return `${prefix}${lakhs} LPA`;
    }
    return `${prefix}${formatNumberWithLocale(converted, targetCurrency)}/year`;
  }

  // Monthly stipend
  const converted = Math.round(amountInUsd * info.rateToUsd);
  return `${prefix}${formatNumberWithLocale(converted, targetCurrency)}/month`;
}

/**
 * Gets currency symbol safely
 */
export function getCurrencySymbol(currencyCode: string): string {
  return SUPPORTED_CURRENCIES[currencyCode]?.symbol || '$';
}
