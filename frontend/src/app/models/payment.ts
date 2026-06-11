export interface PaymentI {
  id?: number;
  contract: number | null;
  amount: number;
  date: string;
  method: string;
}

export interface PaymentResponseI {
  id?: number;
  contract: number;
  contract_info?: string;
  client_name?: string;
  amount: number;
  date: string;
  method: string;
}