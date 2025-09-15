import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, tap, catchError, throwError, of, switchMap, map } from 'rxjs';

import { User } from 'app/core/models/user.model';
import { environment } from 'environments/environment';
import { GlobalStateService } from '../global-state/global-state.service';
import { UserService } from '../user/user.service';

@Injectable({providedIn: 'root'})
export class AuthService {
    private http = inject(HttpClient);
    private globalState = inject(GlobalStateService);
    private userService = inject(UserService);

    private token = signal<string | null>(null);
    private refresh = signal<string | null>(null);

    private readonly apiUrl = `${environment.apiUrl}/users`;

    // Computed
    readonly isLoggedIn = computed(() => this.token() !== null);

    constructor() {
        this.initializeAuthState();
    }

    private initializeAuthState() {
        const storedToken = localStorage.getItem('auth_token');
        const refreshToken = localStorage.getItem('auth_refresh');
        
        if (storedToken) {
            this.token.set(storedToken);
            this.refresh.set(refreshToken);
        }
    }

    login(email: string, password: string): Observable<User> {
        this.globalState.setLoading(true);
        this.globalState.clearError();

        return this.http.post<any>(`${this.apiUrl}/token/`, { email, password }).pipe(
            switchMap((response) => {
                // Store tokens
                this.token.set(response.access);
                this.refresh.set(response.refresh);
                localStorage.setItem('auth_token', response.access);
                localStorage.setItem('auth_refresh', response.refresh);

                // Fetch user details after successful login
                return this.loadUserInfo();
            }),
            tap((user) => {
                this.globalState.setUser(user);
                this.globalState.setLoading(false);
            }),
            catchError((error) => {
                this.globalState.setError('Login failed. Please check your credentials.');
                this.globalState.setLoading(false);
                return throwError(() => error);
            })
        );
    }

    logout() {
        this.token.set(null);
        this.refresh.set(null);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_refresh');
        this.globalState.resetState();
    }

    forceRefreshToken(): Observable<any> {
        const refresh = this.refresh();

        return this.http.post<any>(`${this.apiUrl}/token/refresh/`, { refresh }).pipe(
            tap((response) => {
                this.token.set(response.access);
                this.refresh.set(response.refresh);
                localStorage.setItem('auth_token', response.access);
                localStorage.setItem('auth_refresh', response.refresh);
            }),
            catchError((error) => {
                this.logout();
                return throwError(() => error);
            })
        );
    }

    getToken(): string {
        return this.token() ?? '';
    }

    // Load user information
    loadUserInfo(): Observable<User> {
        this.globalState.setLoading(true);
        
        return this.userService.getCurrentUserDetails().pipe(
            tap((user) => {
                this.globalState.setUser(user);
                this.globalState.setLoading(false);
            }),
            catchError((error) => {
                this.globalState.setError('Failed to load user information.');
                this.globalState.setLoading(false);
                return throwError(() => error);
            })
        );
    }

    // Check if user is authenticated and has valid user info
    isAuthenticatedWithUserInfo(): Observable<boolean> {
        if (!this.isLoggedIn()) {
            return of(false);
        }

        // If we already have user info, return true
        if (this.globalState.currentUser) {
            return of(true);
        }

        // Try to load user info
        return this.loadUserInfo().pipe(
            map(() => true),
            catchError(() => {
                this.logout();
                return of(false);
            })
        );
    }
}