import { PrismaClient } from '@prisma/client';

import { calculateVisitTotals } from '../domain/calculations';

const prisma = new PrismaClient();
const vatRate = 8.1;

type SeedEmployee = {
  id: string;
  name: string;
  initials: string;
  email: string;
  phone: string;
  hourlyPayRate: number;
};

type SeedVisit = {
  id: string;
  clientId: string;
  servicePlanId?: string;
  scheduledDate: string;
  startedAt?: string;
  finishedAt?: string;
  status:
    | 'SCHEDULED'
    | 'COMPLETED'
    | 'CANCELLED'
    | 'RESCHEDULED'
    | 'NO_BILLABLE'
    | 'NEEDS_REVIEW';
  invoiceStatus:
    | 'NOT_INVOICED'
    | 'READY_TO_INVOICE'
    | 'INVOICED'
    | 'SENT_TO_BEXIO'
    | 'PAID'
    | 'CANCELLED';
  clientHourlyRate: number;
  vatRate: number;
  notes?: string;
  bexioInvoiceId?: string;
  employeeHours: Array<{
    employeeId: string;
    hoursWorked: number;
    payRateSnapshot: number;
    payrollStatus?: 'OPEN' | 'APPROVED' | 'PAID' | 'LOCKED';
  }>;
};

function date(value: string): Date {
  return new Date(`${value}T00:00:00.000Z`);
}

function dateTime(value: string): Date {
  return new Date(value);
}

async function seedUsers() {
  return prisma.user.upsert({
    where: { email: 'admin@cleanops.local' },
    update: {
      name: 'CleanOps Admin',
      role: 'ADMIN',
      active: true,
    },
    create: {
      id: 'seed-user-admin',
      name: 'CleanOps Admin',
      email: 'admin@cleanops.local',
      role: 'ADMIN',
      active: true,
    },
  });
}

async function seedClients() {
  const clients = [
    {
      id: 'seed-client-mueller',
      bexioContactId: 'seed-bexio-mueller',
      displayName: 'Familie Müller',
      contactType: 'Privat',
      firstName: 'Anna',
      lastName: 'Müller',
      email: 'familie.mueller@example.test',
      phone: '+41 44 555 10 01',
      mobile: '+41 79 555 10 01',
      address: 'Seestrasse 14, 8002 Zürich',
      street: 'Seestrasse',
      houseNo: '14',
      postcode: '8002',
      city: 'Zürich',
      country: 'CH',
      language: 'DE',
      correspondenceType: 'EMAIL',
      category: 'Privathaushalt',
      remarks: 'Schlüssel im Schlüsselsafe.',
      status: 'ACTIVE' as const,
    },
    {
      id: 'seed-client-crystal-travel',
      bexioContactId: 'seed-bexio-crystal-travel',
      displayName: 'Crystal Travel AG',
      contactType: 'Firma',
      companyName: 'Crystal Travel AG',
      email: 'office@crystal-travel.example.test',
      phone: '+41 44 555 20 02',
      address: 'Bahnhofstrasse 88, 8001 Zürich',
      street: 'Bahnhofstrasse',
      houseNo: '88',
      postcode: '8001',
      city: 'Zürich',
      country: 'CH',
      language: 'DE',
      correspondenceType: 'EMAIL',
      category: 'Büro',
      remarks: 'Reinigung ausserhalb der Öffnungszeiten.',
      status: 'ACTIVE' as const,
    },
    {
      id: 'seed-client-bentz',
      bexioContactId: 'seed-bexio-bentz',
      displayName: 'Bentz Fam.',
      contactType: 'Privat',
      firstName: 'Reto',
      lastName: 'Bentz',
      email: 'bentz.family@example.test',
      phone: '+41 44 555 30 03',
      address: 'Im Hof 7, 8700 Küsnacht',
      street: 'Im Hof',
      houseNo: '7',
      postcode: '8700',
      city: 'Küsnacht',
      country: 'CH',
      language: 'DE',
      correspondenceType: 'EMAIL',
      category: 'Privathaushalt',
      status: 'ACTIVE' as const,
    },
    {
      id: 'seed-client-bossart',
      bexioContactId: 'seed-bexio-bossart',
      displayName: 'Bossart Marlene',
      contactType: 'Privat',
      firstName: 'Marlene',
      lastName: 'Bossart',
      email: 'marlene.bossart@example.test',
      mobile: '+41 79 555 40 04',
      address: 'Rosenweg 3, 8050 Zürich',
      street: 'Rosenweg',
      houseNo: '3',
      postcode: '8050',
      city: 'Zürich',
      country: 'CH',
      language: 'DE',
      correspondenceType: 'EMAIL',
      category: 'Privathaushalt',
      remarks: 'Bitte Bad gründlich kontrollieren.',
      status: 'ACTIVE' as const,
    },
  ];

  for (const client of clients) {
    await prisma.client.upsert({
      where: { id: client.id },
      update: client,
      create: client,
    });
  }
}

async function seedEmployees() {
  const employees: SeedEmployee[] = [
    {
      id: 'seed-employee-ana',
      name: 'Ana Medina',
      initials: 'AM',
      email: 'ana.medina@cleanops.local',
      phone: '+41 79 555 50 01',
      hourlyPayRate: 28,
    },
    {
      id: 'seed-employee-luis',
      name: 'Luis Pérez',
      initials: 'LP',
      email: 'luis.perez@cleanops.local',
      phone: '+41 79 555 50 02',
      hourlyPayRate: 30,
    },
    {
      id: 'seed-employee-marta',
      name: 'Marta Gómez',
      initials: 'MG',
      email: 'marta.gomez@cleanops.local',
      phone: '+41 79 555 50 03',
      hourlyPayRate: 29,
    },
    {
      id: 'seed-employee-elena',
      name: 'Elena Ruiz',
      initials: 'ER',
      email: 'elena.ruiz@cleanops.local',
      phone: '+41 79 555 50 04',
      hourlyPayRate: 27.5,
    },
  ];

  for (const employee of employees) {
    await prisma.employee.upsert({
      where: { id: employee.id },
      update: {
        name: employee.name,
        initials: employee.initials,
        email: employee.email,
        phone: employee.phone,
        hourlyPayRate: employee.hourlyPayRate,
        status: 'ACTIVE',
      },
      create: {
        ...employee,
        status: 'ACTIVE',
      },
    });
  }
}

async function seedServicePlans() {
  const plans = [
    {
      id: 'seed-plan-mueller-weekly',
      clientId: 'seed-client-mueller',
      frequencyType: 'WEEKLY' as const,
      weekdays: ['MONDAY' as const],
      recurrenceStartDate: date('2026-06-01'),
      startTime: '09:00',
      defaultHours: 3,
      defaultPeopleCount: 2,
      clientHourlyRate: 52,
      vatRate,
      billingNotes: 'Monatlich zusammenfassen.',
      operationalNotes: 'Staubsauger vor Ort.',
      active: true,
    },
    {
      id: 'seed-plan-crystal-biweekly',
      clientId: 'seed-client-crystal-travel',
      frequencyType: 'BIWEEKLY' as const,
      weekdays: ['TUESDAY' as const],
      recurrenceStartDate: date('2026-06-02'),
      startTime: '18:30',
      defaultHours: 4,
      defaultPeopleCount: 2,
      clientHourlyRate: 58,
      vatRate,
      billingNotes: 'Referenz Crystal Travel AG im Rechnungstext.',
      operationalNotes: 'Nach 18:00 über Hintereingang.',
      active: true,
    },
    {
      id: 'seed-plan-bentz-multi',
      clientId: 'seed-client-bentz',
      frequencyType: 'MULTIPLE_DAYS_PER_WEEK' as const,
      weekdays: ['WEDNESDAY' as const, 'FRIDAY' as const],
      recurrenceStartDate: date('2026-06-03'),
      startTime: '10:00',
      defaultHours: 2.5,
      defaultPeopleCount: 1,
      clientHourlyRate: 50,
      vatRate,
      operationalNotes: 'Katzen im Wohnzimmer.',
      active: true,
    },
    {
      id: 'seed-plan-bossart-monthly',
      clientId: 'seed-client-bossart',
      frequencyType: 'MONTHLY' as const,
      weekdays: ['THURSDAY' as const],
      recurrenceStartDate: date('2026-06-04'),
      startTime: '13:30',
      defaultHours: 3,
      defaultPeopleCount: 1,
      clientHourlyRate: 54,
      vatRate,
      billingNotes: 'Bitte detaillierte Leistungsbeschreibung.',
      operationalNotes: 'Bad und Küche priorisieren.',
      active: true,
    },
  ];

  for (const plan of plans) {
    await prisma.clientServicePlan.upsert({
      where: { id: plan.id },
      update: plan,
      create: plan,
    });
  }
}

async function upsertVisit(adminUserId: string, visit: SeedVisit) {
  const employeeHours = visit.employeeHours.map((entry) => entry.hoursWorked);
  const totals = calculateVisitTotals({
    visitStatus: visit.status,
    employeeHours,
    clientHourlyRate: visit.clientHourlyRate,
    vatRate: visit.vatRate,
  });

  await prisma.serviceVisit.upsert({
    where: { id: visit.id },
    update: {
      clientId: visit.clientId,
      servicePlanId: visit.servicePlanId,
      scheduledDate: date(visit.scheduledDate),
      startedAt: visit.startedAt ? dateTime(visit.startedAt) : null,
      finishedAt: visit.finishedAt ? dateTime(visit.finishedAt) : null,
      status: visit.status,
      clientHourlyRateSnapshot: visit.clientHourlyRate,
      vatRateSnapshot: visit.vatRate,
      billableHours: totals.billableHours,
      subtotalAmount: totals.subtotal,
      vatAmount: totals.vatAmount,
      totalAmount: totals.total,
      invoiceStatus: visit.invoiceStatus,
      bexioInvoiceId: visit.bexioInvoiceId,
      notes: visit.notes,
      createdById: adminUserId,
    },
    create: {
      id: visit.id,
      clientId: visit.clientId,
      servicePlanId: visit.servicePlanId,
      scheduledDate: date(visit.scheduledDate),
      startedAt: visit.startedAt ? dateTime(visit.startedAt) : undefined,
      finishedAt: visit.finishedAt ? dateTime(visit.finishedAt) : undefined,
      status: visit.status,
      clientHourlyRateSnapshot: visit.clientHourlyRate,
      vatRateSnapshot: visit.vatRate,
      billableHours: totals.billableHours,
      subtotalAmount: totals.subtotal,
      vatAmount: totals.vatAmount,
      totalAmount: totals.total,
      invoiceStatus: visit.invoiceStatus,
      bexioInvoiceId: visit.bexioInvoiceId,
      notes: visit.notes,
      createdById: adminUserId,
    },
  });

  for (const entry of visit.employeeHours) {
    await prisma.visitEmployeeHour.upsert({
      where: {
        visitId_employeeId: {
          visitId: visit.id,
          employeeId: entry.employeeId,
        },
      },
      update: {
        hoursWorked: entry.hoursWorked,
        payRateSnapshot: entry.payRateSnapshot,
        payrollStatus: entry.payrollStatus ?? 'OPEN',
      },
      create: {
        visitId: visit.id,
        employeeId: entry.employeeId,
        hoursWorked: entry.hoursWorked,
        payRateSnapshot: entry.payRateSnapshot,
        payrollStatus: entry.payrollStatus ?? 'OPEN',
      },
    });
  }
}

async function seedVisits(adminUserId: string) {
  const visits: SeedVisit[] = [
    {
      id: 'seed-visit-mueller-scheduled',
      clientId: 'seed-client-mueller',
      servicePlanId: 'seed-plan-mueller-weekly',
      scheduledDate: '2026-06-29',
      status: 'SCHEDULED',
      invoiceStatus: 'NOT_INVOICED',
      clientHourlyRate: 52,
      vatRate,
      notes: 'Planmässige nächste Reinigung.',
      employeeHours: [],
    },
    {
      id: 'seed-visit-crystal-scheduled',
      clientId: 'seed-client-crystal-travel',
      servicePlanId: 'seed-plan-crystal-biweekly',
      scheduledDate: '2026-06-30',
      status: 'SCHEDULED',
      invoiceStatus: 'NOT_INVOICED',
      clientHourlyRate: 58,
      vatRate,
      notes: 'Abendreinigung Büro.',
      employeeHours: [],
    },
    {
      id: 'seed-visit-mueller-completed-open',
      clientId: 'seed-client-mueller',
      servicePlanId: 'seed-plan-mueller-weekly',
      scheduledDate: '2026-06-22',
      startedAt: '2026-06-22T09:00:00.000Z',
      finishedAt: '2026-06-22T12:00:00.000Z',
      status: 'COMPLETED',
      invoiceStatus: 'NOT_INVOICED',
      clientHourlyRate: 52,
      vatRate,
      notes: 'Regulär abgeschlossen.',
      employeeHours: [
        {
          employeeId: 'seed-employee-ana',
          hoursWorked: 3,
          payRateSnapshot: 28,
        },
        {
          employeeId: 'seed-employee-luis',
          hoursWorked: 3,
          payRateSnapshot: 30,
        },
      ],
    },
    {
      id: 'seed-visit-crystal-ready',
      clientId: 'seed-client-crystal-travel',
      servicePlanId: 'seed-plan-crystal-biweekly',
      scheduledDate: '2026-06-16',
      startedAt: '2026-06-16T18:30:00.000Z',
      finishedAt: '2026-06-16T22:30:00.000Z',
      status: 'COMPLETED',
      invoiceStatus: 'READY_TO_INVOICE',
      clientHourlyRate: 58,
      vatRate,
      notes: 'Listo para facturar.',
      employeeHours: [
        {
          employeeId: 'seed-employee-marta',
          hoursWorked: 4,
          payRateSnapshot: 29,
        },
        {
          employeeId: 'seed-employee-elena',
          hoursWorked: 4,
          payRateSnapshot: 27.5,
        },
      ],
    },
    {
      id: 'seed-visit-bentz-invoiced',
      clientId: 'seed-client-bentz',
      servicePlanId: 'seed-plan-bentz-multi',
      scheduledDate: '2026-06-19',
      startedAt: '2026-06-19T10:00:00.000Z',
      finishedAt: '2026-06-19T12:30:00.000Z',
      status: 'COMPLETED',
      invoiceStatus: 'INVOICED',
      bexioInvoiceId: 'seed-bexio-invoice-1001',
      clientHourlyRate: 50,
      vatRate,
      notes: 'Ya facturada en bexio mock.',
      employeeHours: [
        {
          employeeId: 'seed-employee-ana',
          hoursWorked: 2.5,
          payRateSnapshot: 28,
          payrollStatus: 'APPROVED',
        },
      ],
    },
    {
      id: 'seed-visit-bossart-cancelled',
      clientId: 'seed-client-bossart',
      servicePlanId: 'seed-plan-bossart-monthly',
      scheduledDate: '2026-06-18',
      status: 'CANCELLED',
      invoiceStatus: 'CANCELLED',
      clientHourlyRate: 54,
      vatRate,
      notes: 'Cliente canceló por ausencia.',
      employeeHours: [],
    },
    {
      id: 'seed-visit-bentz-no-billable',
      clientId: 'seed-client-bentz',
      servicePlanId: 'seed-plan-bentz-multi',
      scheduledDate: '2026-06-24',
      startedAt: '2026-06-24T10:00:00.000Z',
      finishedAt: '2026-06-24T12:00:00.000Z',
      status: 'NO_BILLABLE',
      invoiceStatus: 'NOT_INVOICED',
      clientHourlyRate: 50,
      vatRate,
      notes: 'Repetición sin cargo por revisión de calidad.',
      employeeHours: [
        {
          employeeId: 'seed-employee-luis',
          hoursWorked: 2,
          payRateSnapshot: 30,
        },
        {
          employeeId: 'seed-employee-elena',
          hoursWorked: 2,
          payRateSnapshot: 27.5,
        },
      ],
    },
  ];

  for (const visit of visits) {
    await upsertVisit(adminUserId, visit);
  }
}

async function main() {
  const admin = await seedUsers();
  await seedClients();
  await seedEmployees();
  await seedServicePlans();
  await seedVisits(admin.id);
}

main()
  .then(async () => {
    console.log('CleanOps seed completed.');
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
