export interface VisitI {
  id?: number;
  client: number | null;
  date: string;
  observations: string;
}

export interface VisitResponseI {
  id?: number;
  client: number;
  client_name?: string;
  date: string;
  observations: string;
}