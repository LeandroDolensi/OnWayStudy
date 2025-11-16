export type ActivityStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

export interface Activity {
  id: number;
  name: string;
  status: ActivityStatus;
  grade_weight: string | null;
  expected_grade: string | null;
  grade_result: string | null;
  delivery_date: string;
  created_at: string;
  updated_at: string | null;
}

export type DisciplineFinalStatusChoices = 'FAILED' | 'RECOVERY' | 'APPROVED';
export type DisciplineStatusChoice =
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'WAITING'
  | 'AWAITING_PREREQUISITE';

export interface Discipline {
  id: number;
  name: string;
  extra_information: string | null;
  semester: number | null;
  status: DisciplineStatusChoice;
  final_grade: string | null;
  final_result: DisciplineFinalStatusChoices | null;
  created_at: string;
  updated_at: string | null;
  activities: Activity[];
}

export interface Course {
  id: number;
  name: string;
  acronym: string;
  semesters: number;
  created_at: string;
  updated_at: string | null;
  disciplines: Discipline[];
}

export interface Institution {
  id: number;
  name: string;
  created_at: string;
  updated_at: string | null;
  courses: Course[];
}

export interface User {
  id: number;
  nickname: string;
  created_at: string;
  updated_at: string | null;
  institutions: Institution[];
}
