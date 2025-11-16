import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from '../../models/user.model';
import { CourseDto } from '../../models/dto.model';
import { API_ENDPOINTS } from '../service_constants';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private http = inject(HttpClient);
  private apiUrl = API_ENDPOINTS.COURSES;

  getList(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl);
  }

  getById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}${id}/`);
  }

  create(data: CourseDto): Observable<Course> {
    return this.http.post<Course>(this.apiUrl, data);
  }

  update(id: number, data: CourseDto): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}${id}/`, data);
  }

  patch(id: number, data: Partial<CourseDto>): Observable<Course> {
    return this.http.patch<Course>(`${this.apiUrl}${id}/`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
}
