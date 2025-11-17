import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { CourseService } from './course.service';
import { CourseDto } from '../../models/dto.model';
import { Course } from '../../models/user.model';
import { API_ENDPOINTS } from '../service_constants';

describe('CourseService', () => {
  let service: CourseService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CourseService],
    });
    service = TestBed.inject(CourseService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve a list of courses from the API via GET', done => {
    const dummyCourses: Course[] = [
      {
        id: 1,
        name: 'Course 1',
        acronym: 'C1',
        semesters: 8,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        disciplines: [],
      },
      {
        id: 2,
        name: 'Course 2',
        acronym: 'C2',
        semesters: 6,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        disciplines: [],
      },
    ];

    service.getList().subscribe(courses => {
      expect(courses.length).toBe(2);
      expect(courses).toEqual(dummyCourses);
      done();
    });

    const request = httpMock.expectOne(API_ENDPOINTS.COURSES);
    expect(request.request.method).toBe('GET');
    request.flush(dummyCourses);
  });

  it('should retrieve a single course by ID from the API via GET', done => {
    const dummyCourse: Course = {
      id: 1,
      name: 'Course 1',
      acronym: 'C1',
      semesters: 8,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      disciplines: [],
    };

    service.getById(1).subscribe(course => {
      expect(course).toEqual(dummyCourse);
      done();
    });

    const request = httpMock.expectOne(`${API_ENDPOINTS.COURSES}1/`);
    expect(request.request.method).toBe('GET');
    request.flush(dummyCourse);
  });

  it('should create a new course and return it from the API via POST', done => {
    const newCourseDto: CourseDto = {
      name: 'New Course',
      acronym: 'NC',
      semesters: 8,
      institution: 1,
    };
    const dummyCourse: Course = {
      id: 3,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      ...newCourseDto,
      disciplines: [],
    };

    service.create(newCourseDto).subscribe(course => {
      expect(course).toEqual(dummyCourse);
      done();
    });

    const request = httpMock.expectOne(API_ENDPOINTS.COURSES);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(newCourseDto);
    request.flush(dummyCourse);
  });

  it('should update an existing course and return it from the API via PUT', done => {
    const updatedCourseDto: CourseDto = {
      name: 'Updated Course',
      acronym: 'UC',
      semesters: 8,
      institution: 1,
    };
    const dummyCourse: Course = {
      id: 1,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      ...updatedCourseDto,
      disciplines: [],
    };

    service.update(1, updatedCourseDto).subscribe(course => {
      expect(course).toEqual(dummyCourse);
      done();
    });

    const request = httpMock.expectOne(`${API_ENDPOINTS.COURSES}1/`);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(updatedCourseDto);
    request.flush(dummyCourse);
  });

  it('should delete an existing course via DELETE', done => {
    service.delete(1).subscribe(response => {
      expect(response).toBeNull();
      done();
    });

    const request = httpMock.expectOne(`${API_ENDPOINTS.COURSES}1/`);
    expect(request.request.method).toBe('DELETE');
    request.flush(null);
  });
});
