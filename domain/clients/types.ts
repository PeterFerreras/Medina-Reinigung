export type ClientStatus = 'ACTIVE' | 'PAUSED' | 'INACTIVE';

export type MockClient = {
  id: string;
  displayName: string;
  email?: string;
  phone?: string;
  city?: string;
  status: ClientStatus;
  remarks?: string;
};
