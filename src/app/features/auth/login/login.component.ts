import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import { GlobalStateService } from '@services/global-state/global-state.service';
import { take, takeUntil, Subject } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnDestroy {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private globalState = inject(GlobalStateService);
  private destroy$ = new Subject<void>();

  loginForm: FormGroup;
  returnUrl: string = '/main/dashboard';

  // Observable properties for template
  isLoading$ = this.globalState.isLoading$;
  error$ = this.globalState.error$;

  constructor(private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [false]
    });

    // Get return URL from route parameters
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/main/dashboard';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;
      
      this.authService.login(formData.email, formData.password).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: () => {
          // Navigate to return URL or dashboard
          this.router.navigate([this.returnUrl]);
        },
        error: (error) => {
          console.error('Login error:', error);
          // Error is handled by the global state service
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      this.loginForm.markAllAsTouched();
    }
  }

  // Helper methods for template
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
  get remember() { return this.loginForm.get('remember'); }
}
