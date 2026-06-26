import type { MockClient } from './types';

export const mockClients: MockClient[] = [
  {
    id: 'client-limmat',
    displayName: 'Praxis Limmatblick',
    email: 'kontakt@limmatblick.test',
    phone: '+41 44 555 10 20',
    city: 'Zürich',
    status: 'ACTIVE',
  },
  {
    id: 'client-helvetia',
    displayName: 'Helvetia Treuhand AG',
    email: 'office@helvetia-treuhand.test',
    city: 'Zürich',
    status: 'ACTIVE',
  },
  {
    id: 'client-atelier',
    displayName: 'Atelier Nord',
    phone: '+41 44 555 18 80',
    city: 'Winterthur',
    status: 'ACTIVE',
  },
  {
    id: 'client-rivera',
    displayName: 'Familia Rivera',
    city: 'Uster',
    status: 'PAUSED',
  },
];
