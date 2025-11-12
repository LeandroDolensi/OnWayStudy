import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { UserCreateDto } from '../../models/dto.model';
import { API_ENDPOINTS } from '../service_constants';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = API_ENDPOINTS.USERS;

  getList(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}${id}/`);
  }

  create(userData: UserCreateDto): Observable<User> {
    return this.http.post<User>(this.apiUrl, userData);
  }

  update(id: number, userData: UserCreateDto): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}${id}/`, userData);
  }

  patch(id: number, userData: Partial<UserCreateDto>): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}${id}/`, userData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
}
