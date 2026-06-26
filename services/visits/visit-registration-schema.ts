import { z } from 'zod';

export const registerVisitStatusSchema = z.enum([
  'COMPLETED',
  'CANCELLED',
  'NO_BILLABLE',
]);

export const visitEmployeeHourRegistrationSchema = z.object({
  employeeId: z.string().min(1, 'employeeId es requerido'),
  hoursWorked: z.number().min(0, 'hoursWorked debe ser mayor o igual a 0'),
});

export const visitRegistrationSchema = z
  .object({
    visitId: z.string().min(1, 'visitId es requerido'),
    servicePlanId: z.string().min(1, 'servicePlanId es requerido').optional(),
    scheduledDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'scheduledDate debe tener formato YYYY-MM-DD')
      .optional(),
    status: registerVisitStatusSchema,
    employeeHours: z.array(visitEmployeeHourRegistrationSchema),
    notes: z.string().optional(),
  })
  .superRefine((input, context) => {
    if (input.status !== 'CANCELLED' && input.employeeHours.length === 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['employeeHours'],
        message: 'employeeHours es requerido para visitas completadas o no facturables',
      });
    }

    if (input.visitId.startsWith('planned-')) {
      if (!input.servicePlanId) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['servicePlanId'],
          message: 'servicePlanId es requerido para visitas planificadas',
        });
      }

      if (!input.scheduledDate) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['scheduledDate'],
          message: 'scheduledDate es requerido para visitas planificadas',
        });
      }
    }
  });

export type VisitRegistrationInput = z.infer<typeof visitRegistrationSchema>;
export type RegisterVisitStatus = z.infer<typeof registerVisitStatusSchema>;
