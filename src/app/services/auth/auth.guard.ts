import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { API_ENDPOINTS } from '../service_constants';
import { User } from '../../models/user.model';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const http = inject(HttpClient);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    const nickname = localStorage.getItem('user_nickname');
    const password = localStorage.getItem('user_password');

    console.log('AuthGuard [Browser]: Running check...');

    if (!nickname || !password) {
      console.log(
        'AuthGuard [Browser]: Credentials not found. Redirecting to /login.'
      );
      router.navigate(['/login']);
      return false;
    }

    return http.get<User[]>(API_ENDPOINTS.USERS).pipe(
      map((users) => {
        if (users && users.length > 0) {
          console.log('AuthGuard [Browser]: Success. Allowing navigation.');
          return true;
        }

        console.log(
          'AuthGuard [Browser]: API returned 200 but no user. Redirecting.'
        );
        router.navigate(['/login']);
        return false;
      }),
      catchError((error) => {
        console.error('AuthGuard [Browser]: API validation failed.', error);

        localStorage.removeItem('user_nickname');
        localStorage.removeItem('user_password');

        router.navigate(['/login']);
        return of(false);
      })
    );
  } else {
    console.log('AuthGuard [Server]: Server render. Redirecting to /login.');
    router.navigate(['/login']);
    return false;
  }
};
