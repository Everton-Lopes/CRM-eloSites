export type CnpjCpfType = 'CPF' | 'CNPJ';

export interface Installment {
  date: string;
  value: number | null;
}

export interface Client {
  id: string;
  name: string;
  cnpjCpf: string;
  cnpjCpfType: CnpjCpfType;
  segment: string;
  whatsapp: string;
  email: string;
  address: string;
  projectType: string;
  pipelineStage: string;
  domain: string;
  hosting: string;
  repo: string;
  contractDate: string;
  deliveryDate: string;
  budget: number | null;
  deposit: number | null;
  paymentMethod: string;
  paymentStatus: string;
  maintenance: boolean;
  maintenanceValue: number | null;
  notes: string;
  // New fields for document generation
  deliveryUrl: string;
  maintenanceStartDate: string;
  paymentInstallments: Installment[];
  scopeItems: string[];
  createdAt?: number;
  updatedAt?: number;
}

export type ClientInput = Omit<Client, 'id' | 'createdAt' | 'updatedAt'>;

export interface SyncState {
  online: boolean;
  pendingWrites: boolean;
  synced: boolean;
}
