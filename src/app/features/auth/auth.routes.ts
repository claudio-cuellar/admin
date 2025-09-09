import { Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";

export const authRoutes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'logout',
    component: LoginComponent
  },
  { path: 'login', component: LoginComponent },
];