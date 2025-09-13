import { Injectable, inject } from '@angular/core';
import { CurrencyService } from '../currency/currency.service';
import { CurrencyCode } from '@models/currency.model';

@Injectable({
  providedIn: 'root'
})
export class AppInitializationService {
  private currencyService = inject(CurrencyService);

  initialize(): Promise<void> {
    return new Promise((resolve) => {
      // Detect user locale
      const userLocale = this.detectUserLocale();
      
      // Map locale to currency
      const currency = this.mapLocaleToCurrency(userLocale);
      
      // Initialize currency service with detected currency
      this.currencyService.initializeWithLocale(currency, userLocale);
      
      console.log(`App initialized with locale: ${userLocale}, currency: ${currency}`);
      resolve();
    });
  }

  private detectUserLocale(): string {
    // Try multiple sources for locale detection
    const sources = [
      navigator.language,
      navigator.languages?.[0],
      (navigator as any).userLanguage,
      (navigator as any).browserLanguage,
      'en-US' // fallback
    ];

    for (const locale of sources) {
      if (locale && typeof locale === 'string') {
        return locale;
      }
    }

    return 'en-US';
  }

  private mapLocaleToCurrency(locale: string): CurrencyCode {
    const normalizedLocale = locale.toLowerCase();
    
    // Map locales to currencies based on common patterns
    if (normalizedLocale.includes('es-bo') || normalizedLocale.includes('bolivia')) {
      return 'BOB';
    }
    
    if (normalizedLocale.startsWith('es-') || normalizedLocale.includes('spain')) {
      return 'EUR';
    }
    
    if (normalizedLocale.startsWith('de-') || 
        normalizedLocale.startsWith('fr-') || 
        normalizedLocale.startsWith('it-') || 
        normalizedLocale.includes('europe')) {
      return 'EUR';
    }
    
    // Default to USD for English and other locales
    return 'USD';
  }
}