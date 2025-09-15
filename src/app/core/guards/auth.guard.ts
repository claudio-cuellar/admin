import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import { GlobalStateService } from '@services/global-state/global-state.service';
import { map, catchError, of, tap } from 'rxjs';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const globalState = inject(GlobalStateService);
  const router = inject(Router);

  // Check if user is logged in and has user info
  return authService.isAuthenticatedWithUserInfo().pipe(
    tap((isAuthenticated) => {
      if (!isAuthenticated) {
        // Clear any invalid auth state
        authService.logout();
        // Redirect to login page with return url
        router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
      }
    }),
    catchError(() => {
      // On error, logout and redirect to login
      authService.logout();
      router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
      return of(false);
    })
  )
};