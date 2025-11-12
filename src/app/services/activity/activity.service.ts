import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Activity } from '../../models/user.model';
import { ActivityDto } from '../../models/dto.model';
import { API_ENDPOINTS } from '../service_constants';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  private http = inject(HttpClient);
  private apiUrl = API_ENDPOINTS.ACTIVITIES;

  getList(): Observable<Activity[]> {
    return this.http.get<Activity[]>(this.apiUrl);
  }

  getById(id: number): Observable<Activity> {
    return this.http.get<Activity>(`${this.apiUrl}${id}/`);
  }

  create(data: ActivityDto): Observable<Activity> {
    return this.http.post<Activity>(this.apiUrl, data);
  }

  update(id: number, data: ActivityDto): Observable<Activity> {
    return this.http.put<Activity>(`${this.apiUrl}${id}/`, data);
  }

  patch(id: number, data: Partial<ActivityDto>): Observable<Activity> {
    return this.http.patch<Activity>(`${this.apiUrl}${id}/`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
}
