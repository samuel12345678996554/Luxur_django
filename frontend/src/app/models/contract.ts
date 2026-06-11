export interface ContractI {
  id?: number;
  client: number;
  property: number; 
  start_date: string;
  end_date: string;
  total_amount: number;
  status: "ACTIVE" | "INACTIVE" | "COMPLETED" | "CANCELLED";
}

export interface ContractResponseI {
  id?: number;
  client: number;
  client_name?: string;
  property: number;  
  property_title?: string;  
  start_date: string;
  end_date: string;
  total_amount: number;
  status: "ACTIVE" | "INACTIVE" | "COMPLETED" | "CANCELLED";
}