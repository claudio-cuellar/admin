import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyService } from '@services/currency/currency.service';
import { Currency, CurrencyCode } from '@models/currency.model';

@Component({
  selector: 'app-currency-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative">
      <select 
        [value]="currencyService.getCurrentCurrency()"
        (change)="onCurrencyChange($event)"
        class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
        @for (currency of currencies; track currency.code) {
          <option [value]="currency.code">
            {{ currency.symbol }} {{ currency.name }} ({{ currency.code }})
          </option>
        }
      </select>
    </div>
  `
})
export class CurrencySelectorComponent {
  currencyService = inject(CurrencyService);
  currencies: Currency[] = this.currencyService.getAllCurrencies();

  onCurrencyChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.currencyService.setCurrentCurrency(target.value as CurrencyCode);
  }
}