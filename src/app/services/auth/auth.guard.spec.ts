import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CanActivateFn, Router } from '@angular/router';
import { authGuard } from './auth.guard';
import { API_ENDPOINTS } from '../service_constants';
import { User } from '../../models/user.model';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';

describe('authGuard', () => {
  let httpMock: HttpTestingController;
  let router: Router;

  const executeGuard: CanActivateFn = (...guardParameters) =>
      TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
    });

    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should return true if user is authenticated', (done) => {
    localStorage.setItem('user_nickname', 'test');
    localStorage.setItem('user_password', 'password');

    const dummyUsers: User[] = [{ id: 1, nickname: 'test', created_at: '', updated_at: '', institutions: [] }];

    (executeGuard({} as any, {} as any) as Observable<boolean>).subscribe(result => {
      expect(result).toBe(true);
      done();
    });

    const req = httpMock.expectOne(API_ENDPOINTS.USERS);
    expect(req.request.method).toBe('GET');
    req.flush(dummyUsers);
  });

  it('should return false and redirect to login if user is not authenticated', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');

    (executeGuard({} as any, {} as any) as boolean);
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });

  it('should return false and redirect to login if API returns an error', (done) => {
    localStorage.setItem('user_nickname', 'test');
    localStorage.setItem('user_password', 'password');
    const navigateSpy = jest.spyOn(router, 'navigate');

    (executeGuard({} as any, {} as any) as Observable<boolean>).subscribe(result => {
      expect(result).toBe(false);
      expect(navigateSpy).toHaveBeenCalledWith(['/login']);
      done();
    });

    const req = httpMock.expectOne(API_ENDPOINTS.USERS);
    expect(req.request.method).toBe('GET');
    req.flush('Something went wrong', { status: 500, statusText: 'Server Error' });
  });
});
