export type VisitStatus =
  | 'SCHEDULED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'RESCHEDULED'
  | 'NO_BILLABLE'
  | 'NEEDS_REVIEW';

export type VisitFrequency =
  | 'ONE_TIME'
  | 'WEEKLY'
  | 'BIWEEKLY'
  | 'MULTIPLE_DAYS_PER_WEEK'
  | 'MONTHLY'
  | 'CUSTOM';

export type MockServiceVisit = {
  id: string;
  clientName: string;
  scheduledDate: string;
  estimatedTime: string;
  frequency: VisitFrequency;
  defaultHours: number;
  defaultPeopleCount: number;
  clientHourlyRate: number;
  vatRate: number;
  status: VisitStatus;
  notes?: string;
};
