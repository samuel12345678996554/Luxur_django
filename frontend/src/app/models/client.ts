export interface ClientI {
  id?: number;                     // Opcional, usado en actualización
  name: string;
  address: string;
  phone: string;
  email: string;
  password: string;                // Se envía solo al crear usuario
  status: "ACTIVE" | "INACTIVE";  // Estado del cliente
}

// Interfaz para recibir datos del backend (respuesta de API)
export interface ClientResponseI {
  id?: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  status: "ACTIVE" | "INACTIVE";  // Estado del cliente
  created_at?: string;             // Fecha de creación (si el backend lo envía)
  updated_at?: string;             // Fecha de actualización (si el backend lo envía)
}