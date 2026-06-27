import { Prisma } from '@prisma/client';
import { describe, expect, it } from 'vitest';

import {
  mapPendingBillingVisitRecord,
  type PendingBillingVisitRecord,
} from '../../services/billing/mappers';

const date = new Date('2026-06-05T00:00:00.000Z');

function createBillingVisitRecord(): PendingBillingVisitRecord {
  return {
    id: 'visit-1',
    clientId: 'client-1',
    servicePlanId: 'plan-1',
    scheduledDate: date,
    startedAt: null,
    finishedAt: null,
    status: 'COMPLETED',
    clientHourlyRateSnapshot: new Prisma.Decimal('52.5'),
    vatRateSnapshot: new Prisma.Decimal('8.1'),
    billableHours: new Prisma.Decimal('5.5'),
    subtotalAmount: new Prisma.Decimal('288.75'),
    vatAmount: new Prisma.Decimal('23.39'),
    totalAmount: new Prisma.Decimal('312.14'),
    invoiceStatus: 'READY_TO_INVOICE',
    bexioInvoiceId: null,
    notes: 'Notas de la visita',
    createdById: null,
    createdAt: date,
    updatedAt: date,
    client: {
      id: 'client-1',
      bexioContactId: null,
      displayName: 'Helvetia Treuhand AG',
      contactType: null,
      companyName: null,
      firstName: null,
      lastName: null,
      email: null,
      phone: null,
      mobile: null,
      address: null,
      street: null,
      houseNo: null,
      postcode: null,
      city: null,
      country: null,
      language: null,
      correspondenceType: null,
      category: null,
      remarks: null,
      status: 'ACTIVE',
      createdAt: date,
      updatedAt: date,
    },
    employeeHours: [
      {
        id: 'hour-1',
        visitId: 'visit-1',
        employeeId: 'employee-1',
        hoursWorked: new Prisma.Decimal('3'),
        payRateSnapshot: new Prisma.Decimal('28'),
        payrollStatus: 'OPEN',
        createdAt: date,
        updatedAt: date,
        employee: {
          id: 'employee-1',
          name: 'Ana Medina',
          initials: 'AM',
          email: null,
          phone: null,
          hourlyPayRate: new Prisma.Decimal('28'),
          status: 'ACTIVE',
          createdAt: date,
          updatedAt: date,
        },
      },
      {
        id: 'hour-2',
        visitId: 'visit-1',
        employeeId: 'employee-2',
        hoursWorked: new Prisma.Decimal('2.5'),
        payRateSnapshot: new Prisma.Decimal('29'),
        payrollStatus: 'OPEN',
        createdAt: date,
        updatedAt: date,
        employee: {
          id: 'employee-2',
          name: 'Luis Keller',
          initials: 'LK',
          email: null,
          phone: null,
          hourlyPayRate: new Prisma.Decimal('29'),
          status: 'ACTIVE',
          createdAt: date,
          updatedAt: date,
        },
      },
    ],
    servicePlan: {
      id: 'plan-1',
      clientId: 'client-1',
      frequencyType: 'WEEKLY',
      weekdays: ['FRIDAY'],
      recurrenceStartDate: date,
      startTime: '08:00',
      defaultHours: new Prisma.Decimal('5.5'),
      defaultPeopleCount: 2,
      clientHourlyRate: new Prisma.Decimal('52.5'),
      vatRate: new Prisma.Decimal('8.1'),
      billingNotes: 'Limpieza oficinas',
      operationalNotes: null,
      active: true,
      createdAt: date,
      updatedAt: date,
    },
  };
}

describe('billing mappers', () => {
  it('maps Prisma decimals and dates to the pending billing domain shape', () => {
    const mappedVisit = mapPendingBillingVisitRecord(createBillingVisitRecord());

    expect(mappedVisit).toEqual({
      id: 'visit-1',
      clientId: 'client-1',
      clientName: 'Helvetia Treuhand AG',
      serviceDate: '2026-06-05',
      description: 'Limpieza oficinas',
      employeeNames: ['Ana Medina', 'Luis Keller'],
      peopleCount: 2,
      billableHours: 5.5,
      clientHourlyRate: 52.5,
      vatRate: 8.1,
      visitStatus: 'COMPLETED',
      invoiceStatus: 'READY_TO_INVOICE',
    });
  });
});
