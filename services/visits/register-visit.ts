import { InvoiceStatus, PayrollStatus, Prisma } from '@prisma/client';

import { calculateVisitTotals } from '@/domain/calculations';
import { prisma } from '@/lib/prisma';

import {
  type RegisterVisitStatus,
  type VisitRegistrationInput,
  visitRegistrationSchema,
} from './visit-registration-schema';

const invoiceStatusByVisitStatus: Record<RegisterVisitStatus, InvoiceStatus> = {
  COMPLETED: InvoiceStatus.READY_TO_INVOICE,
  CANCELLED: InvoiceStatus.CANCELLED,
  NO_BILLABLE: InvoiceStatus.NOT_INVOICED,
};

function toDecimal(value: number): Prisma.Decimal {
  return new Prisma.Decimal(value.toFixed(2));
}

function parseScheduledDate(dateKey: string): Date {
  return new Date(`${dateKey}T00:00:00.000Z`);
}

export async function registerVisit(input: VisitRegistrationInput) {
  const parsedInput = visitRegistrationSchema.parse(input);
  const employeeHoursForStorage = parsedInput.employeeHours.filter(
    (entry) => entry.hoursWorked > 0,
  );
  const employeeIds = employeeHoursForStorage.map((entry) => entry.employeeId);

  return prisma.$transaction(async (transaction) => {
    let visit = await transaction.serviceVisit.findUnique({
      where: {
        id: parsedInput.visitId,
      },
      select: {
        id: true,
        clientHourlyRateSnapshot: true,
        vatRateSnapshot: true,
      },
    });

    if (!visit && parsedInput.servicePlanId && parsedInput.scheduledDate) {
      const scheduledDate = parseScheduledDate(parsedInput.scheduledDate);
      const existingVisit = await transaction.serviceVisit.findFirst({
        where: {
          servicePlanId: parsedInput.servicePlanId,
          scheduledDate,
        },
        select: {
          id: true,
          clientHourlyRateSnapshot: true,
          vatRateSnapshot: true,
        },
      });

      if (existingVisit) {
        visit = existingVisit;
      } else {
        const plan = await transaction.clientServicePlan.findUnique({
          where: {
            id: parsedInput.servicePlanId,
          },
          select: {
            id: true,
            clientId: true,
            clientHourlyRate: true,
            vatRate: true,
          },
        });

        if (!plan) {
          throw new Error('ClientServicePlan no encontrado');
        }

        visit = await transaction.serviceVisit.create({
          data: {
            clientId: plan.clientId,
            servicePlanId: plan.id,
            scheduledDate,
            status: 'SCHEDULED',
            clientHourlyRateSnapshot: plan.clientHourlyRate,
            vatRateSnapshot: plan.vatRate,
            invoiceStatus: InvoiceStatus.NOT_INVOICED,
          },
          select: {
            id: true,
            clientHourlyRateSnapshot: true,
            vatRateSnapshot: true,
          },
        });
      }
    }

    if (!visit) {
      throw new Error('ServiceVisit no encontrada');
    }

    const employees =
      employeeIds.length > 0
        ? await transaction.employee.findMany({
            where: {
              id: {
                in: employeeIds,
              },
            },
            select: {
              id: true,
              hourlyPayRate: true,
            },
          })
        : [];
    const payRateByEmployeeId = new Map(
      employees.map((employee) => [employee.id, employee.hourlyPayRate]),
    );
    const missingEmployeeId = employeeIds.find(
      (employeeId) => !payRateByEmployeeId.has(employeeId),
    );

    if (missingEmployeeId) {
      throw new Error(`Employee no encontrado: ${missingEmployeeId}`);
    }

    const totals = calculateVisitTotals({
      visitStatus: parsedInput.status,
      employeeHours: parsedInput.employeeHours.map((entry) => entry.hoursWorked),
      clientHourlyRate: visit.clientHourlyRateSnapshot.toNumber(),
      vatRate: visit.vatRateSnapshot.toNumber(),
    });

    await transaction.serviceVisit.update({
      where: {
        id: visit.id,
      },
      data: {
        status: parsedInput.status,
        billableHours: toDecimal(totals.billableHours),
        subtotalAmount: toDecimal(totals.subtotal),
        vatAmount: toDecimal(totals.vatAmount),
        totalAmount: toDecimal(totals.total),
        notes: parsedInput.notes?.trim() ? parsedInput.notes.trim() : null,
        invoiceStatus: invoiceStatusByVisitStatus[parsedInput.status],
      },
    });

    await transaction.visitEmployeeHour.deleteMany({
      where: {
        visitId: visit.id,
      },
    });

    if (employeeHoursForStorage.length > 0) {
      await transaction.visitEmployeeHour.createMany({
        data: employeeHoursForStorage.map((entry) => ({
          visitId: visit.id,
          employeeId: entry.employeeId,
          hoursWorked: toDecimal(entry.hoursWorked),
          payRateSnapshot: payRateByEmployeeId.get(entry.employeeId)!,
          payrollStatus: PayrollStatus.OPEN,
        })),
      });
    }

    return {
      visitId: visit.id,
      status: parsedInput.status,
      invoiceStatus: invoiceStatusByVisitStatus[parsedInput.status],
      employeeHoursTotal: totals.employeeHoursTotal,
      billableHours: totals.billableHours,
      subtotal: totals.subtotal,
      vatAmount: totals.vatAmount,
      total: totals.total,
    };
  });
}
