import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({providedIn: 'root'})
export class ReportsService {
    private http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/reports`;
    
    getIncomeVsExpenseSummary() {
        return this.http.get(`${this.apiUrl}/income-vs-expense-summary/`);
    }

    getExpensesByCategory() {
        return this.http.get(`${this.apiUrl}/expenses-by-category/`);
    }
}