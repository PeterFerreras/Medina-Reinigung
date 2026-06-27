export type BillingVisitStatus =
  | 'SCHEDULED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_BILLABLE'
  | 'NEEDS_REVIEW';

export type BillingInvoiceStatus =
  | 'NOT_INVOICED'
  | 'READY_TO_INVOICE'
  | 'INVOICED'
  | 'SENT_TO_BEXIO'
  | 'PAID'
  | 'CANCELLED';

export type BillingPeriodLabel =
  | 'Primera quincena'
  | 'Segunda quincena'
  | 'Mes completo'
  | 'Rango personalizado';

export type MockPendingBillingVisit = {
  id: string;
  clientId: string;
  clientName: string;
  serviceDate: string;
  description: string;
  employeeNames: string[];
  peopleCount: number;
  billableHours: number;
  clientHourlyRate: number;
  vatRate: number;
  visitStatus: BillingVisitStatus;
  invoiceStatus: BillingInvoiceStatus;
};

export type BillingVisitLine = MockPendingBillingVisit & {
  subtotal: number;
  vatAmount: number;
  total: number;
};

export type BillingClientGroup = {
  clientId: string;
  clientName: string;
  invoiceStatus: BillingInvoiceStatus;
  visits: BillingVisitLine[];
  serviceCount: number;
  totalHours: number;
  subtotal: number;
  vatAmount: number;
  total: number;
};

export type PendingBillingTotals = {
  clientCount: number;
  totalHours: number;
  subtotal: number;
  vatAmount: number;
  total: number;
};

export type PendingBillingGroupedResult = {
  clientGroups: BillingClientGroup[];
  totals: PendingBillingTotals;
};
