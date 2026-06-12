export interface VisitI {
  id?: number;

  // Cliente
  client: number | null;

  // Propiedad
  property: number | null;

  // Visita
  date: string;
  status: 'PENDING' | 'COMPLETED' | 'INTERESTED' | 'NOT_INTERESTED';

  observations: string;
  result: string;
}

export interface VisitResponseI {
  id?: number;

  // Cliente
  client: number;
  client_name?: string;
  client_cedula?: string;

  // Propiedad
  property: number;
  property_title?: string;

  // Visita
  date: string;
  status: 'PENDING' | 'COMPLETED' | 'INTERESTED' | 'NOT_INTERESTED';

  observations: string;
  result: string;
}