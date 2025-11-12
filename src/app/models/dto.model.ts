export interface UserCreateDto {
  nickname: string;
  password: string;
}

export interface InstitutionDto {
  name: string;
}

export interface CourseDto {
  name: string;
  acronym: string;
  semesters: number;
  institution: number;
}

export interface DisciplineDto {
  name: string;
  course: number;
  semester?: number | null;
  extra_information?: string | null;
}

export interface ActivityDto {
  name: string;
  discipline: number;
  delivery_date: string;
  status?: string;
  grade_weight?: string | null;
  grade_result?: string | null;
}
