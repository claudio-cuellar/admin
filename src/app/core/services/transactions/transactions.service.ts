import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Transaction } from '@models/transaction.model';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class TransactionsService {
    private http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/expenses`;

    getTransactions(): Observable<Transaction[]> {
        return this.http.get<Transaction[]>(`${this.apiUrl}/transactions/`);
    }
}