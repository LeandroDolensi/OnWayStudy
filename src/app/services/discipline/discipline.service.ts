import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Discipline } from '../../models/user.model';
import { DisciplineDto } from '../../models/dto.model';
import { API_ENDPOINTS } from '../service_constants';

@Injectable({
  providedIn: 'root',
})
export class DisciplineService {
  private http = inject(HttpClient);
  private apiUrl = API_ENDPOINTS.DISCIPLINES;

  getList(): Observable<Discipline[]> {
    return this.http.get<Discipline[]>(this.apiUrl);
  }

  getById(id: number): Observable<Discipline> {
    return this.http.get<Discipline>(`${this.apiUrl}${id}/`);
  }

  create(data: DisciplineDto): Observable<Discipline> {
    return this.http.post<Discipline>(this.apiUrl, data);
  }

  update(id: number, data: DisciplineDto): Observable<Discipline> {
    return this.http.put<Discipline>(`${this.apiUrl}${id}/`, data);
  }

  patch(id: number, data: Partial<DisciplineDto>): Observable<Discipline> {
    return this.http.patch<Discipline>(`${this.apiUrl}${id}/`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
}
