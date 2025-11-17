import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { UserCreateDto } from '../../models/dto.model';
import { API_ENDPOINTS } from '../service_constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = API_ENDPOINTS.USERS;

  login(credentials: UserCreateDto): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}login/`, credentials);
  }

  register(userInfo: UserCreateDto): Observable<User> {
    return this.http.post<User>(this.apiUrl, userInfo);
  }
}
