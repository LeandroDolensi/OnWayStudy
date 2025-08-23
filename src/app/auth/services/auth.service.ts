import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LoginPayload, LoginResponse } from '../models/login.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:80/login';

  constructor(private http: HttpClient) {}

  login(payload: LoginPayload): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrl, payload).pipe(
      tap((response) => {
        // Lógica para armazenar o token, se houver
        console.log('Login bem-sucedido:', response);
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 404) {
      console.error('Erro: Nickname não encontrado.', error.message);
    } else if (error.status === 400) {
      console.error('Erro: Senha incorreta.', error.message);
    } else {
      console.error('Erro desconhecido:', error.message);
    }
    return throwError(
      () => new Error('Falha no login. Por favor, tente novamente.')
    );
  }
}
