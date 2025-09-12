import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { User } from 'app/core/models/user.model';
import { environment } from 'environments/environment';


@Injectable({providedIn: 'root'})
export class AuthService {
    private http = inject(HttpClient);

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
        return this.http.post<User>(`${this.apiUrl}/token/`, { email, password }).pipe(
            tap((response: any) => {
                this.token.set(response.access);
                this.refresh.set(response.refresh);
                localStorage.setItem('auth_token', response.access);
                localStorage.setItem('auth_refresh', response.refresh);
            })
        );
    }

    logout() {
        this.token.set(null);
        this.refresh.set(null);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_refresh');
    }

    forceRefreshToken() {
        const refresh = this.refresh();

        return this.http.post<User>(`${this.apiUrl}/token/refresh/`, { refresh }).pipe(
            tap((response: any) => {
                this.token.set(response.access);
                this.refresh.set(response.refresh);
                localStorage.setItem('auth_token', response.access);
                localStorage.setItem('auth_refresh', response.refresh);
            })
        );
    }

    getToken(): string {
        return this.token() ?? '';
    }
}