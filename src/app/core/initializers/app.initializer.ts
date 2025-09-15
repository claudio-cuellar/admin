import { inject } from '@angular/core';
import { AuthService } from '@services/auth/auth.service';
import { GlobalStateService } from '@services/global-state/global-state.service';
import { catchError, of, tap } from 'rxjs';

export function appInitializerFactory() {
  const authService = inject(AuthService);
  const globalState = inject(GlobalStateService);

  return () => {
    // If user is logged in, try to load user info on app start
    if (authService.isLoggedIn()) {
      return authService.loadUserInfo().pipe(
        tap(() => {
          console.log('User info loaded successfully on app initialization');
        }),
        catchError((error) => {
          console.warn('Failed to load user info on app initialization:', error);
          // Don't fail app initialization, just logout
          authService.logout();
          return of(null);
        })
      );
    }
    
    return of(null);
  };
}