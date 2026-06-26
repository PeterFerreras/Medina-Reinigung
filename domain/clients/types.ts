export type ClientStatus = 'ACTIVE' | 'PAUSED' | 'INACTIVE';

export type MockClient = {
  id: string;
  displayName: string;
  contactType?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  address?: string;
  city?: string;
  country?: string;
  language?: string;
  status: ClientStatus;
  remarks?: string;
};
