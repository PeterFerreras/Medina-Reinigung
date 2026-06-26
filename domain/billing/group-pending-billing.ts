import { calculateSubtotal, calculateTotal, calculateVat } from '../calculations';

import type {
  BillingClientGroup,
  BillingInvoiceStatus,
  BillingVisitLine,
  MockPendingBillingVisit,
  PendingBillingGroupedResult,
} from './types';

const ignoredInvoiceStatuses: BillingInvoiceStatus[] = [
  'INVOICED',
  'SENT_TO_BEXIO',
  'PAID',
  'CANCELLED',
];

function isPendingBillingVisit(visit: MockPendingBillingVisit): boolean {
  return (
    visit.visitStatus !== 'CANCELLED' &&
    !ignoredInvoiceStatuses.includes(visit.invoiceStatus)
  );
}

function toBillingVisitLine(visit: MockPendingBillingVisit): BillingVisitLine {
  const subtotal = calculateSubtotal(visit.billableHours, visit.clientHourlyRate);
  const vatAmount = calculateVat(subtotal, visit.vatRate);
  const total = calculateTotal(subtotal, vatAmount);

  return {
    ...visit,
    subtotal,
    vatAmount,
    total,
  };
}

function addLineToGroup(
  groupsByClientId: Map<string, BillingClientGroup>,
  line: BillingVisitLine,
): void {
  const currentGroup = groupsByClientId.get(line.clientId);

  if (!currentGroup) {
    groupsByClientId.set(line.clientId, {
      clientId: line.clientId,
      clientName: line.clientName,
      invoiceStatus: line.invoiceStatus,
      visits: [line],
      serviceCount: 1,
      totalHours: line.billableHours,
      subtotal: line.subtotal,
      vatAmount: line.vatAmount,
      total: line.total,
    });
    return;
  }

  currentGroup.visits.push(line);
  currentGroup.serviceCount += 1;
  currentGroup.totalHours += line.billableHours;
  currentGroup.subtotal += line.subtotal;
  currentGroup.vatAmount += line.vatAmount;
  currentGroup.total += line.total;
  currentGroup.invoiceStatus =
    currentGroup.invoiceStatus === line.invoiceStatus
      ? currentGroup.invoiceStatus
      : 'READY_TO_INVOICE';
}

export function groupPendingBilling(
  visits: MockPendingBillingVisit[],
): PendingBillingGroupedResult {
  const groupsByClientId = new Map<string, BillingClientGroup>();

  visits.filter(isPendingBillingVisit).map(toBillingVisitLine).forEach((line) => {
    addLineToGroup(groupsByClientId, line);
  });

  const clientGroups = Array.from(groupsByClientId.values());
  const totals = clientGroups.reduce(
    (currentTotals, group) => ({
      clientCount: currentTotals.clientCount + 1,
      totalHours: currentTotals.totalHours + group.totalHours,
      subtotal: currentTotals.subtotal + group.subtotal,
      vatAmount: currentTotals.vatAmount + group.vatAmount,
      total: currentTotals.total + group.total,
    }),
    {
      clientCount: 0,
      totalHours: 0,
      subtotal: 0,
      vatAmount: 0,
      total: 0,
    },
  );

  return {
    clientGroups,
    totals,
  };
}
