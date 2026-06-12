export interface ContractI {
  id?: number;

  client: number;
  property: number;

  contract_type: 'RENT' | 'SALE';

  start_date: string;
  end_date: string;

  total_amount: number;

  status: 'ACTIVE' | 'INACTIVE' | 'COMPLETED' | 'CANCELLED';
}

export interface ContractResponseI {
  id?: number;

  client: number;
  client_name?: string;
  client_cedula?: string;

  property: number;
  property_title?: string;

  contract_type: 'RENT' | 'SALE';

  start_date: string;
  end_date: string;

  total_amount: number;

  status: 'ACTIVE' | 'INACTIVE' | 'COMPLETED' | 'CANCELLED';
}