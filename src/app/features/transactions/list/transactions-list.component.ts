import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TableColumn, TableComponent, TableData } from '@components/table/table.component';
import { ContainerComponent } from '@components/container/container.component';
import { Transaction, TransactionType } from '@models/transaction.model';
import { TransactionsService } from '@services/transactions/transactions.service';
import { CategoriesService } from '@services/categories/categories.service';
import { CurrencyService } from '@services/currency/currency.service';
import { Category } from '@models/categories.model';
import { take } from 'rxjs';
import { FilterPipe } from '@pipes/filter.pipe';
import { SumPipe } from '@pipes/sum.pipe';

@Component({
  selector: 'app-transactions-list',
  standalone: true,
  templateUrl: 'transactions-list.component.html',
  imports: [
    RouterModule,
    CommonModule,
    ContainerComponent,
    FilterPipe,
    SumPipe,
    TableComponent
  ],
})
export class TransactionsListComponent implements OnInit {
  private transactionService = inject(TransactionsService);
  private categoriesService = inject(CategoriesService);
  public currencyService = inject(CurrencyService);

  loading = false;
  transactions: Transaction[] = [];
  categories: Category[] = [];

  headers: TableColumn[] = [
    { key: 'id', label: 'ID', sortable: true, width: '80px', align: 'center' },
    { key: 'transaction_type', label: 'Type', sortable: true, width: '100px', align: 'center', isHtml: true },
    { key: 'amount', label: 'Amount', sortable: true, width: '120px', align: 'right', isHtml: true },
    { key: 'category_name', label: 'Category', sortable: true, width: '150px' },
    { key: 'date', label: 'Date', sortable: true, width: '120px', align: 'center' },
    { key: 'notes', label: 'Notes', sortable: false },
  ];

  data: TableData[] = [];

  ngOnInit() {
    this.loadData();
  }

  private loadData(): void {
    this.loading = true;
    
    // Load categories first, then transactions
    this.categoriesService.getCategories()
      .pipe(take(1))
      .subscribe({
        next: (categories) => {
          this.categories = categories;
          this.loadTransactions();
        },
        error: (error) => {
          console.error('Error loading categories:', error);
          this.loadTransactions(); // Load transactions anyway
        }
      });
  }

  private loadTransactions(): void {
    this.transactionService.getTransactions()
      .pipe(take(1))
      .subscribe({
        next: (transactions) => {
          this.transactions = transactions;
          this.data = this.mapTransactionsToTableData(transactions);
          console.log(this.data);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading transactions:', error);
          this.loading = false;
        }
      });
  }

  private mapTransactionsToTableData(transactions: Transaction[]): TableData[] {
    return transactions.map((transaction: any) => {
      const categoryName = this.getCategoryName(transaction.category);
      
      return {
        id: transaction.id,
        transaction_type: this.formatTransactionType(transaction.transaction_type),
        amount: this.formatAmount(transaction.amount, transaction.transaction_type),
        category_name: categoryName,
        date: this.formatDate(transaction.date),
        notes: transaction.notes || '-',
        // Store original data for potential actions
        _original: transaction
      };
    });
  }

  private getCategoryName(categoryId: string | number): string {
    if (!categoryId) return 'Unknown';
    
    // Search in main categories
    for (const category of this.categories) {
      if (category.id === categoryId.toString()) {
        return category.name;
      }
      // Search in subcategories
      if (category.subcategories) {
        for (const subcategory of category.subcategories) {
          if (subcategory.id === categoryId.toString()) {
            return `${category.name} > ${subcategory.name}`;
          }
        }
      }
    }
    
    return `Category ${categoryId}`;
  }

  private formatTransactionType(type: TransactionType): string {
    const typeConfig = {
      'IN': { label: 'Ingreso', class: 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300', icon: '💰' },
      'OUT': { label: 'Egreso', class: 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300', icon: '💸' }
    };
    
    const config = typeConfig[type] || typeConfig['OUT'];
    return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.class}">
              <span class="mr-1">${config.icon}</span>
              ${config.label}
            </span>`;
  }

  private formatAmount(amount: number, type: TransactionType, currency?: string): string {
    const currencyCode = currency as any || this.currencyService.getCurrentCurrency();
    const formattedAmount = this.currencyService.formatAmount(Math.abs(amount), currencyCode);
    
    const colorClass = type === 'IN' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
    const sign = type === 'IN' ? '+' : '-';
    
    return `<span class="font-semibold ${colorClass}">${sign}${formattedAmount}</span>`;
  }

  private formatDate(date: string | Date): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(dateObj);
  }

  // Method to refresh data
  refreshData(): void {
    this.loadData();
  }
}
