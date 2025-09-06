import { computed, inject, Injectable, signal } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { User } from '@models/user.model';
import { environment } from '../../../../environments/environment';

@Injectable({providedIn: 'root'})
export class AuthService {
    private http = inject(HttpClient);
    private token = signal<string | null>(null);
    private user = signal<User | null>(null);
    private readonly apiUrl = environment.apiUrl;

    // Computed
    readonly isLoggedIn = computed(() => this.token() !== null);
    readonly userName = computed(() => this.user()?.name ?? 'Guest');
    

    login(email: string, password: string): Observable<User> {
        return this.http.post<User>(`${this.apiUrl}/users/token/`, { email, password }).pipe(
            map((response: any) => {
                console.log(response);
                return {
                    user: response.user
                };
            }),
            tap((response: any) => {
                this.token.set(response.token);
                this.user.set(response.user);

                localStorage.setItem('auth_token', response.token);
            })
        );
    }

    logout() {
        this.token.set(null);
        this.user.set(null);
        localStorage.removeItem('auth_token');
    }

    getToken(): string {
        return this.token() ?? '';
    }

    getUser(): User {
        return this.user() ?? {} as User;
    }
}