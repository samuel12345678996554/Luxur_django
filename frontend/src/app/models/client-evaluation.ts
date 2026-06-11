export interface ClientEvaluationI {
  id?: number;
  client: number | null;
  rating: number;
  comments: string;
}

export interface ClientEvaluationResponseI {
  id?: number;
  client: number;
  client_name?: string;
  rating: number;
  comments: string;
  date?: string;
}