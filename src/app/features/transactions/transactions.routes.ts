import { Routes } from "@angular/router";
import { TransactionsListComponent } from "./list/transactions-list.component";
import { TransactionsCreateComponent } from "./create/transactions-create.component";

export const transactionsRoutes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  { path: 'list', component: TransactionsListComponent },
  { path: 'create', component: TransactionsCreateComponent },
];