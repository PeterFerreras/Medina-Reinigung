import { prisma } from '@/lib/prisma';

import { mapClientRecord, mapClientServicePlanRecord } from './mappers';

export async function getClientsWithServicePlans() {
  const clients = await prisma.client.findMany({
    include: {
      servicePlans: {
        orderBy: [{ active: 'desc' }, { startTime: 'asc' }],
      },
    },
    orderBy: { displayName: 'asc' },
  });

  return {
    clients: clients.map(mapClientRecord),
    servicePlans: clients.flatMap((client) =>
      client.servicePlans.map(mapClientServicePlanRecord),
    ),
  };
}
