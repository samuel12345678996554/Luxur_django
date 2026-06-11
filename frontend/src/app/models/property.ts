export interface PropertyI {
  id?: number;
  title: string;
  address: string;
  description?: string;
  price?: number;
  area?: number;
  rooms?: number;
  owner?: number | null; 
  status: "ACTIVE" | "INACTIVE";
}

export interface PropertyResponseI {
  id?: number;
  title: string;
  address: string;
  price?: number;
  area?: number;
  rooms?: number;
  owner?: number | null;
  status?: "ACTIVE" | "INACTIVE";
}
