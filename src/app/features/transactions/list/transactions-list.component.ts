import { Component } from '@angular/core';
import { TableColumn, TableComponent, TableData } from '@components/table/table.component';

@Component({
  selector: 'app-transactions-list',
  templateUrl: 'transactions-list.component.html',
  imports: [TableComponent],
})
export class TransactionsListComponent {
  headers: TableColumn[] = [
    { key: 'id', label: 'ID', sortable: true, width: '80px' },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'status', label: 'Status', align: 'center' },
  ];

  data: TableData[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      status: 'Inactive',
    },
  ];
  
  constructor() {}
}
