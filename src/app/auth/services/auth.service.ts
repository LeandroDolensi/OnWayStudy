import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LoginPayload, LoginResponse } from '../models/login.model';
import { RegisterPayload } from '../models/login.model'; // Crie este modelo

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:80'; // URL base da API

  constructor(private http: HttpClient) {}

  // Método de Login
  login(payload: LoginPayload): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, payload).pipe(
      tap((response) => {
        console.log('Login bem-sucedido:', response);
      }),
      catchError(this.handleError)
    );
  }

  // Novo método de Cadastro
  register(payload: RegisterPayload): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/user`, payload).pipe(
      tap((response) => {
        console.log('Cadastro realizado com sucesso:', response);
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    // Tratamento de erro genérico. Pode ser melhorado.
    console.error(`Erro ${error.status}: ${error.message}`);
    return throwError(
      () => new Error('Ocorreu um erro. Por favor, tente novamente.')
    );
  }
}
