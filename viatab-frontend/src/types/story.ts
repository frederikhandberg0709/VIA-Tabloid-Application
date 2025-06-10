export enum Department {
  ENGINEERING = "ENGINEERING",
  BUSINESS = "BUSINESS",
  DESIGN = "DESIGN",
  HEALTH = "HEALTH",
}

export interface Story {
  id?: number;
  headline: string;
  content: string;
  department: Department;
  createdAt?: string;
  updatedAt?: string;
}

export const DEPARTMENT_LABELS: Record<Department, string> = {
  [Department.ENGINEERING]: "Engineering & Technology",
  [Department.BUSINESS]: "Business & Management",
  [Department.DESIGN]: "Design & Media",
  [Department.HEALTH]: "Health Sciences",
};
