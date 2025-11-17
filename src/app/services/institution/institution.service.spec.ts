import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { InstitutionService } from './institution.service';
import { InstitutionDto } from '../../models/dto.model';
import { Institution } from '../../models/user.model';
import { API_ENDPOINTS } from '../service_constants';

describe('InstitutionService', () => {
  let service: InstitutionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [InstitutionService],
    });
    service = TestBed.inject(InstitutionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve a list of institutions from the API via GET', done => {
    const dummyInstitutions: Institution[] = [
      {
        id: 1,
        name: 'Institution 1',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        courses: [],
      },
      {
        id: 2,
        name: 'Institution 2',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        courses: [],
      },
    ];

    service.getList().subscribe(institutions => {
      expect(institutions.length).toBe(2);
      expect(institutions).toEqual(dummyInstitutions);
      done();
    });

    const request = httpMock.expectOne(API_ENDPOINTS.INSTITUTIONS);
    expect(request.request.method).toBe('GET');
    request.flush(dummyInstitutions);
  });

  it('should retrieve a single institution by ID from the API via GET', done => {
    const dummyInstitution: Institution = {
      id: 1,
      name: 'Institution 1',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      courses: [],
    };

    service.getById(1).subscribe(institution => {
      expect(institution).toEqual(dummyInstitution);
      done();
    });

    const request = httpMock.expectOne(`${API_ENDPOINTS.INSTITUTIONS}1/`);
    expect(request.request.method).toBe('GET');
    request.flush(dummyInstitution);
  });

  it('should create a new institution and return it from the API via POST', done => {
    const newInstitutionDto: InstitutionDto = {
      name: 'New Institution',
    };
    const dummyInstitution: Institution = {
      id: 3,
      name: 'New Institution',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      courses: [],
    };

    service.create(newInstitutionDto).subscribe(institution => {
      expect(institution).toEqual(dummyInstitution);
      done();
    });

    const request = httpMock.expectOne(API_ENDPOINTS.INSTITUTIONS);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(newInstitutionDto);
    request.flush(dummyInstitution);
  });

  it('should update an existing institution and return it from the API via PUT', done => {
    const updatedInstitutionDto: InstitutionDto = {
      name: 'Updated Institution',
    };
    const dummyInstitution: Institution = {
      id: 1,
      name: 'Updated Institution',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      courses: [],
    };

    service.update(1, updatedInstitutionDto).subscribe(institution => {
      expect(institution).toEqual(dummyInstitution);
      done();
    });

    const request = httpMock.expectOne(`${API_ENDPOINTS.INSTITUTIONS}1/`);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(updatedInstitutionDto);
    request.flush(dummyInstitution);
  });

  it('should delete an existing institution via DELETE', done => {
    service.delete(1).subscribe(response => {
      expect(response).toBeNull();
      done();
    });

    const request = httpMock.expectOne(`${API_ENDPOINTS.INSTITUTIONS}1/`);
    expect(request.request.method).toBe('DELETE');
    request.flush(null);
  });
});
