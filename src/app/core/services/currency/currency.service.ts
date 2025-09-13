import { Injectable, signal } from '@angular/core';
import { Currency, CurrencyCode, SUPPORTED_CURRENCIES } from '@models/currency.model';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private currentCurrency = signal<CurrencyCode>('USD');
  private userLocale = signal<string>('en-US');
  
  getCurrentCurrency(): CurrencyCode {
    return this.currentCurrency();
  }
  
  getUserLocale(): string {
    return this.userLocale();
  }
  
  setCurrentCurrency(currencyCode: CurrencyCode): void {
    this.currentCurrency.set(currencyCode);
    // Save to localStorage for persistence
    localStorage.setItem('selectedCurrency', currencyCode);
  }
  
  initializeWithLocale(currencyCode: CurrencyCode, locale: string): void {
    this.userLocale.set(locale);
    
    // Check if user has a saved preference
    const savedCurrency = localStorage.getItem('selectedCurrency') as CurrencyCode;
    if (savedCurrency && SUPPORTED_CURRENCIES[savedCurrency]) {
      this.currentCurrency.set(savedCurrency);
    } else {
      // Use locale-detected currency
      this.currentCurrency.set(currencyCode);
      localStorage.setItem('selectedCurrency', currencyCode);
    }
  }
  
  getCurrencyInfo(currencyCode?: CurrencyCode): Currency {
    const code = currencyCode || this.currentCurrency();
    return SUPPORTED_CURRENCIES[code];
  }
  
  getAllCurrencies(): Currency[] {
    return Object.values(SUPPORTED_CURRENCIES);
  }
  
  formatAmount(amount: number, currencyCode?: CurrencyCode): string {
    const currency = this.getCurrencyInfo(currencyCode);
    // Use detected user locale or currency's default locale
    const locale = this.userLocale() || currency.locale;
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: currency.decimalPlaces,
      maximumFractionDigits: currency.decimalPlaces
    }).format(amount);
  }
  
  constructor() {
    // Basic initialization - will be enhanced by AppInitializationService
    const savedCurrency = localStorage.getItem('selectedCurrency') as CurrencyCode;
    if (savedCurrency && SUPPORTED_CURRENCIES[savedCurrency]) {
      this.currentCurrency.set(savedCurrency);
    }
  }
}