export type FrequencyType =
  | 'ONE_TIME'
  | 'WEEKLY'
  | 'BIWEEKLY'
  | 'MULTIPLE_DAYS_PER_WEEK'
  | 'MONTHLY'
  | 'CUSTOM';

export type Weekday =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

export type MockClientServicePlan = {
  id: string;
  clientId: string;
  frequencyType: FrequencyType;
  weekdays: Weekday[];
  recurrenceStartDate: string;
  startTime?: string;
  defaultHours: number;
  defaultPeopleCount: number;
  clientHourlyRate: number;
  vatRate: number;
  billingNotes?: string;
  operationalNotes?: string;
  active: boolean;
};

export type UpcomingService = {
  plan: MockClientServicePlan;
  serviceDate: string;
};
