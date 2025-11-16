import { environment } from '../../environments/environment';

const BASE_API_URL = `${environment.api_url}/api`;

export const API_ENDPOINTS = {
  USERS: `${BASE_API_URL}/users/`,
  INSTITUTIONS: `${BASE_API_URL}/institutions/`,
  COURSES: `${BASE_API_URL}/courses/`,
  DISCIPLINES: `${BASE_API_URL}/disciplines/`,
  ACTIVITIES: `${BASE_API_URL}/activities/`,
};
