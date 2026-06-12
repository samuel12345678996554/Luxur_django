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
  contract_type?: 'RENT' | 'SALE';

  client_name?: string;
  client_cedula?: string;

  property_title?: string;

  amount: number;
  date: string;
  method: string;
}