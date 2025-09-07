import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { User } from '@models/user.model';
import { environment } from '../../../../environments/environment';

@Injectable({providedIn: 'root'})
export class AuthService {
    private http = inject(HttpClient);

    private token = signal<string | null>(null);
    private readonly apiUrl = environment.apiUrl;

    // Computed
    readonly isLoggedIn = computed(() => this.token() !== null);

    constructor() {
        this.initializeAuthState();
    }

    private initializeAuthState() {
        const storedToken = localStorage.getItem('auth_token');
        if (storedToken) {
            this.token.set(storedToken);
        }
    }    

    login(email: string, password: string): Observable<User> {
        return this.http.post<User>(`${this.apiUrl}/users/token/`, { email, password }).pipe(
            tap((response: any) => {
                this.token.set(response.access);
                localStorage.setItem('auth_token', response.access);
            })
        );
    }

    logout() {
        console.log(`logging out`);
        this.token.set(null);
        localStorage.removeItem('auth_token');
    }

    getToken(): string {
        return this.token() ?? '';
    }
}