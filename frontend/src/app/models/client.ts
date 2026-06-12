export interface ClientI {
  id?: number;
  cedula: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  password: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface ClientResponseI {
  id?: number;
  cedula: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  status: "ACTIVE" | "INACTIVE";
  created_at?: string;
  updated_at?: string;
}