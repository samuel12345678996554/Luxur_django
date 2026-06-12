export interface PropertyI {
  id?: number;
  title: string;
  address: string;
  description?: string;
  price?: number;
  area?: number;
  rooms?: number;
  owner?: number | null;

  status:
    | 'AVAILABLE'
    | 'RENTED'
    | 'SOLD'
    | 'MAINTENANCE';
}

export interface PropertyResponseI {
  id?: number;
  title: string;
  address: string;
  description?: string;
  price?: number;
  area?: number;
  rooms?: number;
  owner?: number | null;

  status?:
    | 'AVAILABLE'
    | 'RENTED'
    | 'SOLD'
    | 'MAINTENANCE';
}