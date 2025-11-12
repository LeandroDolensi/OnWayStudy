import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const apiUrl = environment.api_url;

  if (!req.url.startsWith(apiUrl)) {
    return next(req);
  }

  const nickname = localStorage.getItem('user_nickname');
  const password = localStorage.getItem('user_password');

  let headers = req.headers;

  headers = headers.set(
    environment.api_signature_name,
    environment.api_signature_value
  );

  if (nickname && password) {
    const basicAuthToken = btoa(`${nickname}:${password}`);
    headers = headers.set('Authorization', `Basic ${basicAuthToken}`);
  }

  const authReq = req.clone({ headers });
  return next(authReq);
};
