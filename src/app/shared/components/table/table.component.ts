import { Component, input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  isHtml?: boolean; // Add this new property
}

export interface TableData {
  [key: string]: any;
}

export interface SortConfig {
  column: string;
  direction: 'asc' | 'desc';
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent {
  // Input signals
  headers = input.required<TableColumn[]>();
  data = input.required<TableData[]>();
  loading = input<boolean>(false);
  striped = input<boolean>(true);
  hoverable = input<boolean>(true);
  bordered = input<boolean>(false);
  responsive = input<boolean>(true);

  // Internal signals
  sortConfig = signal<SortConfig | null>(null);
  
  // Computed signals
  sortedData = computed(() => {
    const data = this.data();
    const sort = this.sortConfig();
    
    if (!sort) {
      return data;
    }
    
    return [...data].sort((a, b) => {
      const aValue = a[sort.column];
      const bValue = b[sort.column];
      
      if (aValue === bValue) return 0;
      
      const comparison = aValue < bValue ? -1 : 1;
      return sort.direction === 'asc' ? comparison : -comparison;
    });
  });
  
  tableClasses = computed(() => {
    const classes = ['table', 'w-full', 'min-w-full', 'divide-y', 'divide-gray-200', 'dark:divide-gray-700'];
    
    if (this.striped()) classes.push('table-striped');
    if (this.hoverable()) classes.push('table-hover');
    if (this.bordered()) classes.push('table-bordered');
    
    return classes.join(' ');
  });
  
  containerClasses = computed(() => {
    const classes = ['table-container', 'shadow-sm', 'border', 'border-gray-200', 'dark:border-gray-700', 'rounded-lg'];
    
    if (this.responsive()) classes.push('overflow-x-auto');
    
    return classes.join(' ');
  });

  // Methods
  onSort(column: TableColumn): void {
    if (!column.sortable) return;
    
    const currentSort = this.sortConfig();
    
    if (currentSort?.column === column.key) {
      // Toggle direction or clear sort
      if (currentSort.direction === 'asc') {
        this.sortConfig.set({ column: column.key, direction: 'desc' });
      } else {
        this.sortConfig.set(null);
      }
    } else {
      // New column sort
      this.sortConfig.set({ column: column.key, direction: 'asc' });
    }
  }
  
  getSortIcon(column: TableColumn): string {
    if (!column.sortable) return '';
    
    const currentSort = this.sortConfig();
    
    if (currentSort?.column !== column.key) {
      return 'sort';
    }
    
    return currentSort.direction === 'asc' ? 'sort-up' : 'sort-down';
  }
  
  getColumnWidth(column: TableColumn): string {
    return column.width || 'auto';
  }
  
  getColumnAlign(column: TableColumn): string {
    return column.align || 'left';
  }
}