import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { UserService } from './user.service';
import { UserCreateDto } from '../../models/dto.model';
import { User } from '../../models/user.model';
import { API_ENDPOINTS } from '../service_constants';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve a list of users from the API via GET', done => {
    const dummyUsers: User[] = [
      {
        id: 1,
        nickname: 'user1',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        institutions: [],
      },
      {
        id: 2,
        nickname: 'user2',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        institutions: [],
      },
    ];

    service.getList().subscribe(users => {
      expect(users.length).toBe(2);
      expect(users).toEqual(dummyUsers);
      done();
    });

    const request = httpMock.expectOne(API_ENDPOINTS.USERS);
    expect(request.request.method).toBe('GET');
    request.flush(dummyUsers);
  });

  it('should retrieve a single user by ID from the API via GET', done => {
    const dummyUser: User = {
      id: 1,
      nickname: 'user1',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      institutions: [],
    };

    service.getById(1).subscribe(user => {
      expect(user).toEqual(dummyUser);
      done();
    });

    const request = httpMock.expectOne(`${API_ENDPOINTS.USERS}1/`);
    expect(request.request.method).toBe('GET');
    request.flush(dummyUser);
  });

  it('should create a new user and return it from the API via POST', done => {
    const newUserDto: UserCreateDto = {
      nickname: 'newUser',
      password: 'password',
    };
    const dummyUser: User = {
      id: 3,
      nickname: 'newUser',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      institutions: [],
    };

    service.create(newUserDto).subscribe(user => {
      expect(user).toEqual(dummyUser);
      done();
    });

    const request = httpMock.expectOne(API_ENDPOINTS.USERS);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(newUserDto);
    request.flush(dummyUser);
  });

  it('should update an existing user and return it from the API via PUT', done => {
    const updatedUserDto: UserCreateDto = {
      nickname: 'updatedUser',
      password: 'password',
    };
    const dummyUser: User = {
      id: 1,
      nickname: 'updatedUser',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      institutions: [],
    };

    service.update(1, updatedUserDto).subscribe(user => {
      expect(user).toEqual(dummyUser);
      done();
    });

    const request = httpMock.expectOne(`${API_ENDPOINTS.USERS}1/`);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(updatedUserDto);
    request.flush(dummyUser);
  });

  it('should delete an existing user via DELETE', done => {
    service.delete(1).subscribe(response => {
      expect(response).toBeNull();
      done();
    });

    const request = httpMock.expectOne(`${API_ENDPOINTS.USERS}1/`);
    expect(request.request.method).toBe('DELETE');
    request.flush(null);
  });
});
