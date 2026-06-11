import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';

import { AmenityI, AmenityResponseI } from '../models/amenity';

interface PaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AmenityResponseI[];
}

@Injectable({
  providedIn: 'root'
})
export class AmenityService {
  private apiUrl = 'http://localhost:8000/api/amenities/';

  private amenitiesSubject = new BehaviorSubject<AmenityResponseI[]>([]);
  public amenities$ = this.amenitiesSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllAmenities(): Observable<AmenityResponseI[]> {
    return this.http.get<PaginatedResponse>(this.apiUrl).pipe(
      map(response => response.results || []),
      tap(amenities => this.amenitiesSubject.next(amenities)),
      catchError(error => {
        console.error(error);
        return of([]);
      })
    );
  }

  getAmenityById(id: number): Observable<AmenityResponseI> {
    return this.http.get<AmenityResponseI>(`${this.apiUrl}${id}/`);
  }

  createAmenity(amenity: AmenityI): Observable<AmenityResponseI> {
    return this.http.post<AmenityResponseI>(this.apiUrl, amenity).pipe(
      tap(() => this.getAllAmenities().subscribe())
    );
  }

  updateAmenity(id: number, amenity: AmenityI): Observable<AmenityResponseI> {
    return this.http.put<AmenityResponseI>(`${this.apiUrl}${id}/`, amenity).pipe(
      tap(() => this.getAllAmenities().subscribe())
    );
  }

  deleteAmenity(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`).pipe(
      tap(() => this.getAllAmenities().subscribe())
    );
  }
}