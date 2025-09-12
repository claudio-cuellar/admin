import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Category } from '@models/categories.model';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class CategoriesService {
    private http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/expenses`;
    
    getCategories(): Observable<Category[]> {
        return this.http.get<Category[]>(`${this.apiUrl}/categories/`);
    }
}