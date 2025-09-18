import { Routes } from '@angular/router';
import { MainLayoutComponent } from './shared/components/main-layout/main-layout.component';
import { AuthLayoutComponent } from './shared/components/auth-layout/auth-layout.component';
import { AuthGuard } from '@guards/auth.guard';
import { GuestGuard } from '@guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },
  {
    path: '',
    component: AuthLayoutComponent,
    canActivate: [GuestGuard],
    children: [
      {
        path: 'auth',
        loadChildren: () => import('./features/auth/auth.routes').then((m) => m.authRoutes),
      },
    ]
  },
  {
    path: 'main',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/dashboard.routes').then((m) => m.dashboardRoutes)
      },
      {
        path: 'transactions',
        loadChildren: () => import('./features/transactions/transactions.routes').then((m) => m.transactionsRoutes)
      },
      {
        path: 'categories',
        loadChildren: () => import('./features/categories/categories.routes').then((m) => m.categoriesRoutes)
      },
      {
        path: 'user',
        loadChildren: () => import('./features/user/user.routes').then((m) => m.userRoutes)
      },
      {
        path: '**',
        redirectTo: 'dashboard'
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/main/dashboard'
  }
];
