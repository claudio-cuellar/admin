export interface Currency {
  code: string;
  name: string;
  symbol: string;
  locale: string;
  decimalPlaces: number;
}

export type CurrencyCode = 'BOB' | 'USD' | 'EUR';

export const SUPPORTED_CURRENCIES: Record<CurrencyCode, Currency> = {
  BOB: {
    code: 'BOB',
    name: 'Bolivian Boliviano',
    symbol: 'Bs.',
    locale: 'es-BO',
    decimalPlaces: 2
  },
  USD: {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    locale: 'en-US',
    decimalPlaces: 2
  },
  EUR: {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    locale: 'de-DE',
    decimalPlaces: 2
  }
};