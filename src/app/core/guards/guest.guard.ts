import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';

export const GuestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  
  if (state.url.indexOf('logout') > -1) {
    authService.logout();
    router.navigate(['/auth/login']);
    return false;
  }

  if (!authService.isLoggedIn()) {
    return true;
  }

  // Redirect authenticated users to dashboard
  router.navigate(['/main/dashboard']);
  return false;
};