import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Transaction, TransactionPayload, TransactionResponse } from '@models/transaction.model';
import { environment } from 'environments/environment';
import { Observable, map } from 'rxjs';

@Injectable({providedIn: 'root'})
export class TransactionsService {
    private http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/expenses`;

    getTransactions(): Observable<Transaction[]> {
        return this.http.get<TransactionResponse[]>(`${this.apiUrl}/transactions/`)
            .pipe(
                map((responses: TransactionResponse[]) => 
                    responses.map(response => this.mapResponseToTransaction(response))
                )
            );
    }

    createTransaction(transaction: TransactionPayload): Observable<Transaction> {
        const language = navigator.language;
        // const preferredLang = language.startsWith('es') ? 'es' : 'en';
        const preferredLang = language.startsWith('es') ? 'es' : 'es';

        return this.http.post<Transaction>(`${this.apiUrl}/transactions/`, transaction);
    }

    private mapResponseToTransaction(response: TransactionResponse): Transaction {
        const language = navigator.language;
        const preferredLang = language.startsWith('es') ? 'es' : 'es';
        
        return {
            id: response.id,
            transaction_type: response.transaction_type,
            amount: response.amount,
            date: new Date(response.date),
            category: response.category,
            category_name: response.category_name[preferredLang] || response.category_name.en,
            notes: response.notes,
            currency: 'USD' // Default currency, could be enhanced to detect from response
        };
    }
}