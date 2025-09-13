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

export interface Transaction {
  id?: string;
  transaction_type: TransactionType;
  amount: number;
  date: Date;
  category: string;
  notes: string;
  currency?: CurrencyCode;
}
