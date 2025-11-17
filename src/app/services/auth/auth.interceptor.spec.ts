import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors, HttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { authInterceptor } from './auth.interceptor';
import { environment } from '../../../environments/environment';

describe('authInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should add the api signature header to all requests', () => {
    httpClient.get(environment.api_url).subscribe();

    const httpRequest = httpMock.expectOne(environment.api_url);
    expect(httpRequest.request.headers.has(environment.api_signature_name)).toEqual(true);
    expect(httpRequest.request.headers.get(environment.api_signature_name)).toEqual(environment.api_signature_value);
  });

  it('should add the Authorization header if the user is authenticated', () => {
    localStorage.setItem('user_nickname', 'test');
    localStorage.setItem('user_password', 'password');

    httpClient.get(environment.api_url).subscribe();

    const httpRequest = httpMock.expectOne(environment.api_url);
    expect(httpRequest.request.headers.has('Authorization')).toEqual(true);
    expect(httpRequest.request.headers.get('Authorization')).toEqual('Basic dGVzdDpwYXNzd29yZA==');
  });

  it('should not add the Authorization header if the user is not authenticated', () => {
    httpClient.get(environment.api_url).subscribe();

    const httpRequest = httpMock.expectOne(environment.api_url);
    expect(httpRequest.request.headers.has('Authorization')).toEqual(false);
  });

  it('should not add any headers to requests that are not to the API', () => {
    httpClient.get('/test').subscribe();

    const httpRequest = httpMock.expectOne('/test');
    expect(httpRequest.request.headers.has(environment.api_signature_name)).toEqual(false);
    expect(httpRequest.request.headers.has('Authorization')).toEqual(false);
  });
});
