export type CnpjCpfType = 'CPF' | 'CNPJ';

export type PaymentProvider =
  | 'Pix direto'
  | 'InfinitePay'
  | 'Mercado Pago'
  | 'Outro';

export interface Installment {
  date: string;
  value: number | null;
  paid: boolean;
}

export interface DocumentLogEntry {
  templateId: string;
  templateLabel: string;
  generatedAt: number;
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
  paymentProvider: PaymentProvider;
  feesAmount: number | null;
  proofReference: string;
  maintenance: boolean;
  maintenanceValue: number | null;
  notes: string;
  // New fields for document generation
  deliveryUrl: string;
  maintenanceStartDate: string;
  paymentInstallments: Installment[];
  scopeItems: string[];
  // Set automatically the first time a document is generated; never edited by hand.
  budgetNumber?: string;
  documentLogs: DocumentLogEntry[];
  createdAt?: number;
  updatedAt?: number;
}

export type ClientInput = Omit<
  Client,
  'id' | 'createdAt' | 'updatedAt' | 'documentLogs'
>;

export interface SyncState {
  online: boolean;
  pendingWrites: boolean;
  synced: boolean;
}
