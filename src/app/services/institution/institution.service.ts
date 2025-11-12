import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Institution } from '../../models/user.model';
import { InstitutionDto } from '../../models/dto.model';
import { API_ENDPOINTS } from '../service_constants';

@Injectable({
  providedIn: 'root',
})
export class InstitutionService {
  private http = inject(HttpClient);
  private apiUrl = API_ENDPOINTS.INSTITUTIONS;

  getList(): Observable<Institution[]> {
    return this.http.get<Institution[]>(this.apiUrl);
  }

  getById(id: number): Observable<Institution> {
    return this.http.get<Institution>(`${this.apiUrl}${id}/`);
  }

  create(data: InstitutionDto): Observable<Institution> {
    return this.http.post<Institution>(this.apiUrl, data);
  }

  update(id: number, data: InstitutionDto): Observable<Institution> {
    return this.http.put<Institution>(`${this.apiUrl}${id}/`, data);
  }

  patch(id: number, data: Partial<InstitutionDto>): Observable<Institution> {
    return this.http.patch<Institution>(`${this.apiUrl}${id}/`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
}
