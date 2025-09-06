import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class LoginService {
    private http = inject(HttpClient);

    isAuthenticated = signal(false);
    token = signal<string | null>(null);

    login(username: string, password: string): Observable<string> {
        return this.http.post<string>('http://localhost:3000/login', { username, password }).pipe(
            tap((response: any) => {
                this.token.set(response.token);
                this.isAuthenticated.set(true);
            })
        );
    }

    constructor() { }
    
}