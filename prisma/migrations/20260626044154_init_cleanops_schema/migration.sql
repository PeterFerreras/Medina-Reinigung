-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'MANAGER', 'STAFF');

-- CreateEnum
CREATE TYPE "ClientStatus" AS ENUM ('ACTIVE', 'PAUSED', 'INACTIVE');

-- CreateEnum
CREATE TYPE "EmployeeStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "FrequencyType" AS ENUM ('ONE_TIME', 'WEEKLY', 'BIWEEKLY', 'MULTIPLE_DAYS_PER_WEEK', 'MONTHLY', 'CUSTOM');

-- CreateEnum
CREATE TYPE "Weekday" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateEnum
CREATE TYPE "VisitStatus" AS ENUM ('SCHEDULED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED', 'NO_BILLABLE', 'NEEDS_REVIEW');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('NOT_INVOICED', 'READY_TO_INVOICE', 'INVOICED', 'SENT_TO_BEXIO', 'PAID', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PayrollStatus" AS ENUM ('OPEN', 'APPROVED', 'PAID', 'LOCKED');

-- CreateEnum
CREATE TYPE "InvoiceBatchStatus" AS ENUM ('DRAFT', 'READY', 'SENT_TO_BEXIO', 'INVOICED', 'PAID', 'CANCELLED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'STAFF',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "bexioContactId" TEXT,
    "displayName" TEXT NOT NULL,
    "contactType" TEXT,
    "companyName" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "mobile" TEXT,
    "address" TEXT,
    "street" TEXT,
    "houseNo" TEXT,
    "postcode" TEXT,
    "city" TEXT,
    "country" TEXT,
    "language" TEXT,
    "correspondenceType" TEXT,
    "category" TEXT,
    "remarks" TEXT,
    "status" "ClientStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "initials" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "hourlyPayRate" DECIMAL(10,2) NOT NULL,
    "status" "EmployeeStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientServicePlan" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "frequencyType" "FrequencyType" NOT NULL,
    "weekdays" "Weekday"[] DEFAULT ARRAY[]::"Weekday"[],
    "recurrenceStartDate" DATE NOT NULL,
    "startTime" TEXT,
    "defaultHours" DECIMAL(8,2) NOT NULL,
    "defaultPeopleCount" INTEGER NOT NULL,
    "clientHourlyRate" DECIMAL(10,2) NOT NULL,
    "vatRate" DECIMAL(5,2) NOT NULL,
    "billingNotes" TEXT,
    "operationalNotes" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientServicePlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceVisit" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "servicePlanId" TEXT,
    "scheduledDate" DATE NOT NULL,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "status" "VisitStatus" NOT NULL DEFAULT 'SCHEDULED',
    "clientHourlyRateSnapshot" DECIMAL(10,2) NOT NULL,
    "vatRateSnapshot" DECIMAL(5,2) NOT NULL,
    "billableHours" DECIMAL(8,2) NOT NULL DEFAULT 0,
    "subtotalAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "vatAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "invoiceStatus" "InvoiceStatus" NOT NULL DEFAULT 'NOT_INVOICED',
    "bexioInvoiceId" TEXT,
    "notes" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceVisit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisitEmployeeHour" (
    "id" TEXT NOT NULL,
    "visitId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "hoursWorked" DECIMAL(8,2) NOT NULL,
    "payRateSnapshot" DECIMAL(10,2) NOT NULL,
    "payrollStatus" "PayrollStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VisitEmployeeHour_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoiceBatch" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "periodStart" DATE NOT NULL,
    "periodEnd" DATE NOT NULL,
    "status" "InvoiceBatchStatus" NOT NULL DEFAULT 'DRAFT',
    "totalHours" DECIMAL(8,2) NOT NULL DEFAULT 0,
    "subtotalAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "vatAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "bexioInvoiceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvoiceBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoiceBatchItem" (
    "id" TEXT NOT NULL,
    "invoiceBatchId" TEXT NOT NULL,
    "visitId" TEXT,
    "description" TEXT NOT NULL,
    "serviceDate" DATE NOT NULL,
    "hours" DECIMAL(8,2) NOT NULL,
    "rate" DECIMAL(10,2) NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InvoiceBatchItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "entityName" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "oldData" JSONB,
    "newData" JSONB,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_active_idx" ON "User"("active");

-- CreateIndex
CREATE UNIQUE INDEX "Client_bexioContactId_key" ON "Client"("bexioContactId");

-- CreateIndex
CREATE INDEX "Client_displayName_idx" ON "Client"("displayName");

-- CreateIndex
CREATE INDEX "Client_status_idx" ON "Client"("status");

-- CreateIndex
CREATE INDEX "Client_city_idx" ON "Client"("city");

-- CreateIndex
CREATE INDEX "Client_bexioContactId_idx" ON "Client"("bexioContactId");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_email_key" ON "Employee"("email");

-- CreateIndex
CREATE INDEX "Employee_name_idx" ON "Employee"("name");

-- CreateIndex
CREATE INDEX "Employee_status_idx" ON "Employee"("status");

-- CreateIndex
CREATE INDEX "ClientServicePlan_clientId_idx" ON "ClientServicePlan"("clientId");

-- CreateIndex
CREATE INDEX "ClientServicePlan_frequencyType_idx" ON "ClientServicePlan"("frequencyType");

-- CreateIndex
CREATE INDEX "ClientServicePlan_recurrenceStartDate_idx" ON "ClientServicePlan"("recurrenceStartDate");

-- CreateIndex
CREATE INDEX "ClientServicePlan_active_idx" ON "ClientServicePlan"("active");

-- CreateIndex
CREATE INDEX "ServiceVisit_clientId_scheduledDate_idx" ON "ServiceVisit"("clientId", "scheduledDate");

-- CreateIndex
CREATE INDEX "ServiceVisit_servicePlanId_idx" ON "ServiceVisit"("servicePlanId");

-- CreateIndex
CREATE INDEX "ServiceVisit_scheduledDate_idx" ON "ServiceVisit"("scheduledDate");

-- CreateIndex
CREATE INDEX "ServiceVisit_status_idx" ON "ServiceVisit"("status");

-- CreateIndex
CREATE INDEX "ServiceVisit_invoiceStatus_idx" ON "ServiceVisit"("invoiceStatus");

-- CreateIndex
CREATE INDEX "ServiceVisit_createdById_idx" ON "ServiceVisit"("createdById");

-- CreateIndex
CREATE INDEX "ServiceVisit_bexioInvoiceId_idx" ON "ServiceVisit"("bexioInvoiceId");

-- CreateIndex
CREATE INDEX "VisitEmployeeHour_visitId_idx" ON "VisitEmployeeHour"("visitId");

-- CreateIndex
CREATE INDEX "VisitEmployeeHour_employeeId_idx" ON "VisitEmployeeHour"("employeeId");

-- CreateIndex
CREATE INDEX "VisitEmployeeHour_employeeId_payrollStatus_idx" ON "VisitEmployeeHour"("employeeId", "payrollStatus");

-- CreateIndex
CREATE INDEX "VisitEmployeeHour_payrollStatus_idx" ON "VisitEmployeeHour"("payrollStatus");

-- CreateIndex
CREATE UNIQUE INDEX "VisitEmployeeHour_visitId_employeeId_key" ON "VisitEmployeeHour"("visitId", "employeeId");

-- CreateIndex
CREATE INDEX "InvoiceBatch_clientId_idx" ON "InvoiceBatch"("clientId");

-- CreateIndex
CREATE INDEX "InvoiceBatch_clientId_periodStart_periodEnd_idx" ON "InvoiceBatch"("clientId", "periodStart", "periodEnd");

-- CreateIndex
CREATE INDEX "InvoiceBatch_periodStart_periodEnd_idx" ON "InvoiceBatch"("periodStart", "periodEnd");

-- CreateIndex
CREATE INDEX "InvoiceBatch_status_idx" ON "InvoiceBatch"("status");

-- CreateIndex
CREATE INDEX "InvoiceBatch_bexioInvoiceId_idx" ON "InvoiceBatch"("bexioInvoiceId");

-- CreateIndex
CREATE INDEX "InvoiceBatchItem_invoiceBatchId_idx" ON "InvoiceBatchItem"("invoiceBatchId");

-- CreateIndex
CREATE INDEX "InvoiceBatchItem_visitId_idx" ON "InvoiceBatchItem"("visitId");

-- CreateIndex
CREATE INDEX "InvoiceBatchItem_serviceDate_idx" ON "InvoiceBatchItem"("serviceDate");

-- CreateIndex
CREATE INDEX "AuditLog_entityName_entityId_idx" ON "AuditLog"("entityName", "entityId");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- AddForeignKey
ALTER TABLE "ClientServicePlan" ADD CONSTRAINT "ClientServicePlan_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceVisit" ADD CONSTRAINT "ServiceVisit_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceVisit" ADD CONSTRAINT "ServiceVisit_servicePlanId_fkey" FOREIGN KEY ("servicePlanId") REFERENCES "ClientServicePlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceVisit" ADD CONSTRAINT "ServiceVisit_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisitEmployeeHour" ADD CONSTRAINT "VisitEmployeeHour_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "ServiceVisit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisitEmployeeHour" ADD CONSTRAINT "VisitEmployeeHour_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceBatch" ADD CONSTRAINT "InvoiceBatch_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceBatchItem" ADD CONSTRAINT "InvoiceBatchItem_invoiceBatchId_fkey" FOREIGN KEY ("invoiceBatchId") REFERENCES "InvoiceBatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceBatchItem" ADD CONSTRAINT "InvoiceBatchItem_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "ServiceVisit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
