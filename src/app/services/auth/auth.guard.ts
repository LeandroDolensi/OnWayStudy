import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { API_ENDPOINTS } from '../service_constants';
import { User } from '../../models/user.model';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const http = inject(HttpClient);

  const nickname = localStorage.getItem('user_nickname');
  const password = localStorage.getItem('user_password');

  if (!nickname || !password) {
    console.log(
      'AuthGuard: Credenciais não encontradas. Redirecionando para /login.'
    );
    router.navigate(['/login']);
    return false;
  }

  return http.get<User[]>(API_ENDPOINTS.USERS).pipe(
    map((users) => {
      if (users && users.length > 0) {
        return true;
      }

      router.navigate(['/login']);
      return false;
    }),
    catchError((error) => {
      console.error('AuthGuard: Validação da API falhou.', error);

      localStorage.removeItem('user_nickname');
      localStorage.removeItem('user_password');

      router.navigate(['/login']);
      return of(false);
    })
  );
};
