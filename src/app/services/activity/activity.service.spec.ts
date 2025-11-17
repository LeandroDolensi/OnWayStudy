import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ActivityService } from './activity.service';
import { ActivityDto } from '../../models/dto.model';
import { Activity } from '../../models/user.model';
import { API_ENDPOINTS } from '../service_constants';

describe('ActivityService', () => {
  let service: ActivityService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ActivityService],
    });
    service = TestBed.inject(ActivityService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve a list of activities from the API via GET', done => {
    const dummyActivities: Activity[] = [
      {
        id: 1,
        name: 'Activity 1',
        status: 'PENDING',
        grade_weight: '1.0',
        expected_grade: '1.0',
        grade_result: '1.0',
        delivery_date: '2024-01-01T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      {
        id: 2,
        name: 'Activity 2',
        status: 'PENDING',
        grade_weight: '1.0',
        expected_grade: '1.0',
        grade_result: '1.0',
        delivery_date: '2024-01-01T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    ];

    service.getList().subscribe(activities => {
      expect(activities.length).toBe(2);
      expect(activities).toEqual(dummyActivities);
      done();
    });

    const request = httpMock.expectOne(API_ENDPOINTS.ACTIVITIES);
    expect(request.request.method).toBe('GET');
    request.flush(dummyActivities);
  });

  it('should retrieve a single activity by ID from the API via GET', done => {
    const dummyActivity: Activity = {
      id: 1,
      name: 'Activity 1',
      status: 'PENDING',
      grade_weight: '1.0',
      expected_grade: '1.0',
      grade_result: '1.0',
      delivery_date: '2024-01-01T00:00:00Z',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    };

    service.getById(1).subscribe(activity => {
      expect(activity).toEqual(dummyActivity);
      done();
    });

    const request = httpMock.expectOne(`${API_ENDPOINTS.ACTIVITIES}1/`);
    expect(request.request.method).toBe('GET');
    request.flush(dummyActivity);
  });

  it('should create a new activity and return it from the API via POST', done => {
    const newActivityDto: ActivityDto = {
      name: 'New Activity',
      status: 'PENDING',
      grade_weight: '1.0',
      grade_result: '1.0',
      delivery_date: '2024-01-01T00:00:00Z',
      discipline: 1,
    };
    const dummyActivity: Activity = {
      id: 3,
      name: 'New Activity',
      status: 'PENDING',
      grade_weight: '1.0',
      expected_grade: null,
      grade_result: '1.0',
      delivery_date: '2024-01-01T00:00:00Z',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    };

    service.create(newActivityDto).subscribe(activity => {
      expect(activity).toEqual(dummyActivity);
      done();
    });

    const request = httpMock.expectOne(API_ENDPOINTS.ACTIVITIES);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(newActivityDto);
    request.flush(dummyActivity);
  });

  it('should update an existing activity and return it from the API via PUT', done => {
    const updatedActivityDto: ActivityDto = {
      name: 'Updated Activity',
      status: 'PENDING',
      grade_weight: '1.0',
      grade_result: '1.0',
      delivery_date: '2024-01-01T00:00:00Z',
      discipline: 1,
    };
    const dummyActivity: Activity = {
      id: 1,
      name: 'Updated Activity',
      status: 'PENDING',
      grade_weight: '1.0',
      expected_grade: null,
      grade_result: '1.0',
      delivery_date: '2024-01-01T00:00:00Z',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    };

    service.update(1, updatedActivityDto).subscribe(activity => {
      expect(activity).toEqual(dummyActivity);
      done();
    });

    const request = httpMock.expectOne(`${API_ENDPOINTS.ACTIVITIES}1/`);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(updatedActivityDto);
    request.flush(dummyActivity);
  });

  it('should delete an existing activity via DELETE', done => {
    service.delete(1).subscribe(response => {
      expect(response).toBeNull();
      done();
    });

    const request = httpMock.expectOne(`${API_ENDPOINTS.ACTIVITIES}1/`);
    expect(request.request.method).toBe('DELETE');
    request.flush(null);
  });
});
