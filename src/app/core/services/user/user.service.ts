import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { User } from 'app/core/models/user.model';
import { environment } from '../../../../environments/environment';

@Injectable({providedIn: 'root'})
export class UserService {
    private http = inject(HttpClient);
    private readonly baseUrl = `${environment.apiUrl}/users`;

    getUserImage(userId: string): Observable<Blob> {
        return this.http.get(`${this.baseUrl}/${userId}/profile-picture/?v=${Date.now()}`, { responseType: 'blob' });
    }

    updateUserDetails(userData: FormData): Observable<User> {
        return this.http.patch<User>(`${this.baseUrl}/me/update/`, userData);
    }

    getCurrentUserDetails(): Observable<User> {
        return this.http.get<User>(`${this.baseUrl}/me/`);
    }
}