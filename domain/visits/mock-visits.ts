import type { MockServiceVisit } from './types';

export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function addDays(date: Date, days: number): Date {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);

  return nextDate;
}

export function createMockVisits(referenceDate = new Date()): MockServiceVisit[] {
  const today = toDateKey(referenceDate);
  const tomorrow = toDateKey(addDays(referenceDate, 1));

  return [
    {
      id: 'visit-limmat-scheduled',
      clientName: 'Praxis Limmatblick',
      scheduledDate: today,
      estimatedTime: '09:00',
      frequency: 'WEEKLY',
      defaultHours: 3,
      defaultPeopleCount: 2,
      clientHourlyRate: 48,
      status: 'SCHEDULED',
      notes: 'Entrada por la puerta lateral.',
    },
    {
      id: 'visit-helvetia-completed',
      clientName: 'Helvetia Treuhand AG',
      scheduledDate: today,
      estimatedTime: '13:30',
      frequency: 'BIWEEKLY',
      defaultHours: 3,
      defaultPeopleCount: 1,
      clientHourlyRate: 52,
      status: 'COMPLETED',
    },
    {
      id: 'visit-rivera-cancelled',
      clientName: 'Familia Rivera',
      scheduledDate: today,
      estimatedTime: '16:00',
      frequency: 'MONTHLY',
      defaultHours: 2,
      defaultPeopleCount: 1,
      clientHourlyRate: 45,
      status: 'CANCELLED',
      notes: 'Cliente pidio mover la visita.',
    },
    {
      id: 'visit-atelier-no-billable',
      clientName: 'Atelier Nord',
      scheduledDate: today,
      estimatedTime: '18:00',
      frequency: 'ONE_TIME',
      defaultHours: 1.5,
      defaultPeopleCount: 1,
      clientHourlyRate: 50,
      status: 'NO_BILLABLE',
    },
    {
      id: 'visit-seefeld-review',
      clientName: 'Buro Seefeld',
      scheduledDate: today,
      estimatedTime: '11:15',
      frequency: 'MULTIPLE_DAYS_PER_WEEK',
      defaultHours: 2.5,
      defaultPeopleCount: 2,
      clientHourlyRate: 55,
      status: 'NEEDS_REVIEW',
      notes: 'Confirmar material especial.',
    },
    {
      id: 'visit-tomorrow',
      clientName: 'Studio Morgen',
      scheduledDate: tomorrow,
      estimatedTime: '10:00',
      frequency: 'WEEKLY',
      defaultHours: 2,
      defaultPeopleCount: 1,
      clientHourlyRate: 49,
      status: 'SCHEDULED',
    },
  ];
}
