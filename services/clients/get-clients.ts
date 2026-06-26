import { prisma } from '@/lib/prisma';

import { mapClientRecord } from './mappers';

export async function getClients() {
  const clients = await prisma.client.findMany({
    orderBy: { displayName: 'asc' },
  });

  return clients.map(mapClientRecord);
}
