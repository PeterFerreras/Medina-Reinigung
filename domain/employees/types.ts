export type EmployeeStatus = 'ACTIVE' | 'INACTIVE';

export type MockEmployee = {
  id: string;
  name: string;
  initials: string;
  hourlyPayRate: number;
  status: EmployeeStatus;
};
