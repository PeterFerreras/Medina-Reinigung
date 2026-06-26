import { Prisma } from '@prisma/client';
import { describe, expect, it } from 'vitest';

import {
  mapClientRecord,
  mapClientServicePlanRecord,
} from '../../services/clients/mappers';

describe('client service mappers', () => {
  it('maps nullable client fields to UI-friendly values', () => {
    const mappedClient = mapClientRecord({
      id: 'client-1',
      bexioContactId: null,
      displayName: 'Example Client',
      contactType: null,
      companyName: null,
      firstName: null,
      lastName: null,
      email: 'client@example.test',
      phone: null,
      mobile: null,
      address: null,
      street: null,
      houseNo: null,
      postcode: null,
      city: 'Zürich',
      country: 'CH',
      language: 'DE',
      correspondenceType: null,
      category: null,
      remarks: null,
      status: 'ACTIVE',
      createdAt: new Date('2026-06-01T00:00:00.000Z'),
      updatedAt: new Date('2026-06-01T00:00:00.000Z'),
    });

    expect(mappedClient).toEqual({
      id: 'client-1',
      displayName: 'Example Client',
      email: 'client@example.test',
      city: 'Zürich',
      country: 'CH',
      language: 'DE',
      status: 'ACTIVE',
    });
  });

  it('maps Decimal and Date service plan fields for the UI', () => {
    const mappedPlan = mapClientServicePlanRecord({
      id: 'plan-1',
      clientId: 'client-1',
      frequencyType: 'BIWEEKLY',
      weekdays: ['MONDAY'],
      recurrenceStartDate: new Date('2026-06-15T00:00:00.000Z'),
      startTime: '09:00',
      defaultHours: new Prisma.Decimal('3.5'),
      defaultPeopleCount: 2,
      clientHourlyRate: new Prisma.Decimal('58.25'),
      vatRate: new Prisma.Decimal('8.1'),
      billingNotes: null,
      operationalNotes: 'Side entrance',
      active: true,
      createdAt: new Date('2026-06-01T00:00:00.000Z'),
      updatedAt: new Date('2026-06-01T00:00:00.000Z'),
    });

    expect(mappedPlan).toEqual({
      id: 'plan-1',
      clientId: 'client-1',
      frequencyType: 'BIWEEKLY',
      weekdays: ['MONDAY'],
      recurrenceStartDate: '2026-06-15',
      startTime: '09:00',
      defaultHours: 3.5,
      defaultPeopleCount: 2,
      clientHourlyRate: 58.25,
      vatRate: 8.1,
      operationalNotes: 'Side entrance',
      active: true,
    });
  });
});
