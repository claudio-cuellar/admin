import { Routes } from "@angular/router";
import { CategoriesListComponent } from "./list/categories-list.component";

export const categoriesRoutes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  { path: 'list', component: CategoriesListComponent },
];