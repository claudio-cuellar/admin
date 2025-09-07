import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { User } from '@models/user.model';
import { environment } from '../../../../environments/environment';

@Injectable({providedIn: 'root'})
export class UserService {
    private http = inject(HttpClient);
    private readonly baseUrl = `${environment.apiUrl}/users`;

    getUserDetails(userId: string): Observable<User> {
        return this.http.get<User>(`${this.baseUrl}/${userId}/`);
    }

    getMyDetails(): Observable<User> {
        return this.http.get<User>(`${this.baseUrl}/me/`);
    }

    updateUserDetails(userId: string, userData: Partial<User>): Observable<User> {
        return this.http.put<User>(`${this.baseUrl}/${userId}/`, userData);
    }

    getCurrentUserDetails(): Observable<User> {
        return this.http.get<User>(`${this.baseUrl}/me/`);
    }

    getAllUsers(): Observable<User[]> {
        return this.http.get<User[]>(`${this.baseUrl}/`);
    }

    deleteUser(userId: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${userId}/`);
    }
}