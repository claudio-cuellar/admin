import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if user is logged in
  if (authService.isLoggedIn()) {
    // Additional check: verify token exists in localStorage
    const token = localStorage.getItem('auth_token');
    if (token) {
      return true;
    }
  }

  // Clear any invalid auth state
  authService.logout();
  
  // Redirect to login page with return url
  router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
  return false;
};