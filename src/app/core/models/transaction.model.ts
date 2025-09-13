import { CurrencyCode } from './currency.model';

export type TransactionType = 'IN' | 'OUT';


export interface TransactionPayload {
  transaction_type: TransactionType;
  amount: number;
  date: string;
  category: string;
  notes: string;
  currency?: CurrencyCode;
}

export interface TransactionResponse {
  id: string;
  amount: number;
  category: string;
  category_name: {
    en: string,
    es: string
  };
  date: string;
  notes: string;
  transaction_type: TransactionType;
}

export interface Transaction {
  id?: string;
  transaction_type: TransactionType;
  amount: number;
  date: Date;
  category: string;
  category_name: string;
  notes: string;
  currency?: CurrencyCode;
}
