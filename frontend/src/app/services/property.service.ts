import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { PropertyI, PropertyResponseI } from '../models/property';

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private baseUrl = 'http://localhost:8000/api/properties';
  private propertiesSubject = new BehaviorSubject<PropertyResponseI[]>([]);
  public properties$ = this.propertiesSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllProperties(): Observable<PropertyResponseI[]> {
    return this.http.get<PaginatedResponse<PropertyResponseI>>(`${this.baseUrl}/`)
      .pipe(
        map(resp => resp.results),
        tap(props => this.propertiesSubject.next(props)),
        catchError(err => {
          console.error('Error fetching properties:', err);
          return throwError(() => err);
        })
      );
  }

  getPropertyById(id: number): Observable<PropertyResponseI> {
    return this.http.get<PropertyResponseI>(`${this.baseUrl}/${id}/`)
      .pipe(
        catchError(err => {
          console.error('Error fetching property:', err);
          return throwError(() => err);
        })
      );
  }

  createProperty(prop: PropertyI): Observable<PropertyResponseI> {
    return this.http.post<PropertyResponseI>(`${this.baseUrl}/`, prop)
      .pipe(
        tap(() => this.refreshProperties()),
        catchError(err => {
          console.error('Error creating property:', err);
          return throwError(() => err);
        })
      );
  }

  updateProperty(id: number, prop: Partial<PropertyI>): Observable<PropertyResponseI> {
    return this.http.put<PropertyResponseI>(`${this.baseUrl}/${id}/`, prop)
      .pipe(
        tap(() => this.refreshProperties()),
        catchError(err => {
          console.error('Error updating property:', err);
          return throwError(() => err);
        })
      );
  }

  partialUpdateProperty(id: number, prop: Partial<PropertyI>): Observable<PropertyResponseI> {
    return this.http.patch<PropertyResponseI>(`${this.baseUrl}/${id}/`, prop)
      .pipe(
        tap(() => this.refreshProperties()),
        catchError(err => {
          console.error('Error partially updating property:', err);
          return throwError(() => err);
        })
      );
  }

  deleteProperty(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}/`)
      .pipe(
        tap(() => this.refreshProperties()),
        catchError(err => {
          console.error('Error deleting property:', err);
          return throwError(() => err);
        })
      );
  }

  refreshProperties(): void {
    this.getAllProperties().subscribe({
      next: (props) => this.propertiesSubject.next(props),
      error: (err) => console.error('Error refreshing properties:', err)
    });
  }
}
