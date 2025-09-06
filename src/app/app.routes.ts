import { Routes } from '@angular/router';
import { MainLayoutComponent } from './shared/components/main-layout/main-layout.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/auth/login',
        pathMatch: 'full'
    },
    {
        path: 'auth', 
        loadChildren: () => import('./features/auth/auth.routes').then((m) => m.authRoutes),
    },
    {
        path: 'dashboard',
        component: MainLayoutComponent,
        children: [
            {
                path: 'overview',
                loadChildren: () => import('./features/dashboard/dashboard.routes').then((m) => m.dashboardRoutes)
            },
            // {
            //     path: 'users',
            //     loadChildren: () => import('./features/users/users.routes').then((m) => m.usersRoutes)
            // },
            // {
            //     path: 'settings',
            //     loadChildren: () => import('./features/settings/settings.routes').then((m) => m.settingsRoutes)
            // }
        ]
    }
];
