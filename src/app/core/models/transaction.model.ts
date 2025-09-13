export type TransactionType = 'IN' | 'OUT';

export interface TransactionPayload {
  transaction_type: TransactionType;
  amount: number;
  date: string;
  category: string;
  notes: string;
}

export interface Transaction {
  transaction_type: TransactionType;
  amount: number;
  date: Date;
  category: string;
  notes: string;
}
