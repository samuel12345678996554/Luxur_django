import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { ClientResponseI } from '../models/client';

interface PaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ClientResponseI[];
}

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = 'http://localhost:8000/api/clients/';
  private clientsSubject = new BehaviorSubject<ClientResponseI[]>([]);
  public clients$ = this.clientsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllClients(): Observable<ClientResponseI[]> {
    return this.http.get<PaginatedResponse>(this.apiUrl).pipe(
      map(response => {
        console.log('Respuesta del backend:', response);
        // Extraer solo los results
        return response.results || [];
      }),
      tap(clients => {
        console.log('Clientes procesados:', clients);
        this.clientsSubject.next(clients);
      }),
      catchError(error => {
        console.error('Error al obtener clientes:', error);
        return [];
      })
    );
  }

  getClientById(id: number): Observable<ClientResponseI> {
    return this.http.get<ClientResponseI>(`${this.apiUrl}${id}/`);
  }

  createClient(client: any): Observable<ClientResponseI> {
    return this.http.post<ClientResponseI>(this.apiUrl, client).pipe(
      tap(() => this.getAllClients().subscribe())
    );
  }

  updateClient(id: number, client: any): Observable<ClientResponseI> {
    return this.http.put<ClientResponseI>(`${this.apiUrl}${id}/`, client).pipe(
      tap(() => this.getAllClients().subscribe())
    );
  }

  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`).pipe(
      tap(() => this.getAllClients().subscribe())
    );
  }
}