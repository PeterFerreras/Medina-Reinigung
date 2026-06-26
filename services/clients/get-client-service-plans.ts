import { prisma } from '@/lib/prisma';

import { mapClientServicePlanRecord } from './mappers';

export async function getClientServicePlans(clientId: string) {
  const plans = await prisma.clientServicePlan.findMany({
    where: { clientId },
    orderBy: [{ active: 'desc' }, { startTime: 'asc' }],
  });

  return plans.map(mapClientServicePlanRecord);
}
