import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { DisciplineService } from './discipline.service';
import { DisciplineDto } from '../../models/dto.model';
import { Discipline } from '../../models/user.model';
import { API_ENDPOINTS } from '../service_constants';

describe('DisciplineService', () => {
  let service: DisciplineService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DisciplineService],
    });
    service = TestBed.inject(DisciplineService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve a list of disciplines from the API via GET', done => {
    const dummyDiscipline: Discipline[] = [
      {
        id: 1,
        name: 'Discipline 1',
        extra_information: '',
        semester: 1,
        status: 'IN_PROGRESS',
        final_grade: null,
        final_result: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        activities: [],
      },
      {
        id: 2,
        name: 'Discipline 2',
        extra_information: '',
        semester: 1,
        status: 'IN_PROGRESS',
        final_grade: null,
        final_result: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        activities: [],
      },
    ];

    service.getList().subscribe(disciplines => {
      expect(disciplines.length).toBe(2);
      expect(disciplines).toEqual(dummyDiscipline);
      done();
    });

    const request = httpMock.expectOne(API_ENDPOINTS.DISCIPLINES);
    expect(request.request.method).toBe('GET');
    request.flush(dummyDiscipline);
  });

  it('should retrieve a single discipline by ID from the API via GET', done => {
    const dummyDiscipline: Discipline = {
      id: 1,
      name: 'Discipline 1',
      extra_information: '',
      semester: 1,
      status: 'IN_PROGRESS',
      final_grade: null,
      final_result: null,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      activities: [],
    };

    service.getById(1).subscribe(discipline => {
      expect(discipline).toEqual(dummyDiscipline);
      done();
    });

    const request = httpMock.expectOne(`${API_ENDPOINTS.DISCIPLINES}1/`);
    expect(request.request.method).toBe('GET');
    request.flush(dummyDiscipline);
  });

  it('should create a new discipline and return it from the API via POST', done => {
    const newDisciplineDto: DisciplineDto = {
      name: 'New Discipline',
      course: 1,
    };
    const dummyDiscipline: Discipline = {
      id: 3,
      name: 'New Discipline',
      extra_information: '',
      semester: 1,
      status: 'IN_PROGRESS',
      final_grade: null,
      final_result: null,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      activities: [],
    };

    service.create(newDisciplineDto).subscribe(discipline => {
      expect(discipline).toEqual(dummyDiscipline);
      done();
    });

    const request = httpMock.expectOne(API_ENDPOINTS.DISCIPLINES);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(newDisciplineDto);
    request.flush(dummyDiscipline);
  });

  it('should update an existing discipline and return it from the API via PUT', done => {
    const updatedDisciplineDto: DisciplineDto = {
      name: 'Updated Discipline',
      course: 1,
    };
    const dummyDiscipline: Discipline = {
      id: 1,
      name: 'Updated Discipline',
      extra_information: '',
      semester: 1,
      status: 'IN_PROGRESS',
      final_grade: null,
      final_result: null,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      activities: [],
    };

    service.update(1, updatedDisciplineDto).subscribe(discipline => {
      expect(discipline).toEqual(dummyDiscipline);
      done();
    });

    const request = httpMock.expectOne(`${API_ENDPOINTS.DISCIPLINES}1/`);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(updatedDisciplineDto);
    request.flush(dummyDiscipline);
  });

  it('should delete an existing discipline via DELETE', done => {
    service.delete(1).subscribe(response => {
      expect(response).toBeNull();
      done();
    });

    const request = httpMock.expectOne(`${API_ENDPOINTS.DISCIPLINES}1/`);
    expect(request.request.method).toBe('DELETE');
    request.flush(null);
  });
});
