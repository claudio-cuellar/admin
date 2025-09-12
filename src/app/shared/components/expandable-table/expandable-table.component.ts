import { Component, input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ExpandableTableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  isHtml?: boolean; // Add this new property
}

export interface ExpandableTableData {
  [key: string]: any;
  children?: ExpandableTableData[];
  childrenColumns?: ExpandableTableColumn[];
}

export interface SortConfig {
  column: string;
  direction: 'asc' | 'desc';
}

@Component({
  selector: 'app-expandable-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expandable-table.component.html',
  styleUrls: ['./expandable-table.component.css']
})
export class ExpandableTableComponent {
  // Input signals
  headers = input.required<ExpandableTableColumn[]>();
  data = input.required<ExpandableTableData[]>();
  loading = input<boolean>(false);
  striped = input<boolean>(true);
  hoverable = input<boolean>(true);
  bordered = input<boolean>(false);
  responsive = input<boolean>(true);
  expandable = input<boolean>(true);

  // Internal signals
  sortConfig = signal<SortConfig | null>(null);
  expandedRows = signal<Set<number>>(new Set());
  
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
    const classes = ['table', 'w-full'];
    
    if (this.striped()) classes.push('table-striped');
    if (this.hoverable()) classes.push('table-hover');
    if (this.bordered()) classes.push('table-bordered');
    
    return classes.join(' ');
  });
  
  containerClasses = computed(() => {
    const classes = ['table-container'];
    
    if (this.responsive()) classes.push('overflow-x-auto');
    
    return classes.join(' ');
  });

  // Methods
  onSort(column: ExpandableTableColumn): void {
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
  
  toggleRow(index: number): void {
    if (!this.expandable()) return;
    
    const expanded = this.expandedRows();
    const newExpanded = new Set(expanded);
    
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    
    this.expandedRows.set(newExpanded);
  }
  
  isRowExpanded(index: number): boolean {
    return this.expandedRows().has(index);
  }
  
  hasChildren(row: ExpandableTableData): boolean {
    return Array.isArray(row.children) && row.children.length > 0;
  }
  
  getSortIcon(column: ExpandableTableColumn): string {
    if (!column.sortable) return '';
    
    const currentSort = this.sortConfig();
    
    if (currentSort?.column !== column.key) {
      return 'sort';
    }
    
    return currentSort.direction === 'asc' ? 'sort-up' : 'sort-down';
  }
  
  getColumnWidth(column: ExpandableTableColumn): string {
    return column.width || 'auto';
  }
  
  getColumnAlign(column: ExpandableTableColumn): string {
    return column.align || 'left';
  }
}