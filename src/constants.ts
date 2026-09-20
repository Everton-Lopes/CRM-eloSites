import type { PaymentProvider } from './types';

export interface Stage {
  id: string;
  label: string;
}

export const STAGES: Stage[] = [
  { id: 'lead', label: 'Lead' },
  { id: 'proposta', label: 'Proposta' },
  { id: 'contrato', label: 'Contrato' },
  { id: 'pagamento', label: 'Pagamento (entrada)' },
  { id: 'desenvolvimento', label: 'Desenvolvimento' },
  { id: 'aprovacao', label: 'Aprovação' },
  { id: 'publicacao', label: 'Publicação' },
  { id: 'entregue', label: 'Entregue' },
  { id: 'manutencao', label: 'Manutenção' },
];

export const PAYMENT_PROVIDERS: PaymentProvider[] = [
  'Pix direto',
  'InfinitePay',
  'Mercado Pago',
  'Outro',
];

export const PROJECT_TYPES = [
  'Landing page',
  'Site institucional',
  'Projeto Personalizado',
] as const;

// Legacy value historically persisted in Firestore. Kept only for reading old
// records — never write it again. `normalizeProjectType` maps it to the
// business-facing name so existing clients keep working unchanged.
export const LEGACY_PROJECT_TYPE = 'Outro';
export const CUSTOM_PROJECT_TYPE = 'Projeto Personalizado';

export function normalizeProjectType(value: string | null | undefined): string {
  const v = String(value ?? '');
  return v === LEGACY_PROJECT_TYPE ? CUSTOM_PROJECT_TYPE : v;
}

export const LANDING_CATALOG: string[] = [
  'Página única com rolagem contínua (hero, serviços, prova social, contato)',
  'Botão de WhatsApp com mensagem pré-preenchida em cada chamada',
  'Apresentação detalhada dos serviços ou produtos',
  'Responsiva para celular, tablet e desktop',
  'Publicação no Netlify',
];

export const SITE_CATALOG: string[] = [
  'Múltiplas seções: início, serviços, sobre, galeria, depoimentos e localização',
  'Descrição detalhada de cada serviço oferecido',
  'Galeria de fotos do trabalho ou do espaço',
  'Seção de localização (endereço e/ou mapa)',
  'Botão de WhatsApp integrado ao longo da página',
  'Responsiva para celular, tablet e desktop',
  'Publicação no Netlify',
];

export function catalogFor(projectType: string): string[] {
  if (projectType === 'Landing page') return LANDING_CATALOG;
  if (projectType === 'Site institucional') return SITE_CATALOG;
  return [];
}

export interface DocumentTemplate {
  id: string;
  label: string;
  file: string;
  prefix: string;
  // Who the generated file is meant for. Internal/reference documents must
  // never be presented here as ordinary client deliverables.
  kind: 'client' | 'internal';
  description: string;
}

export const DOCUMENT_TEMPLATES: DocumentTemplate[] = [
  {
    id: 'briefing',
    label: 'Briefing',
    file: 'briefing.docx',
    prefix: 'Briefing',
    kind: 'client',
    description: 'Levantamento inicial de informações e conteúdo do projeto.',
  },
  {
    id: 'orcamento',
    label: 'Orçamento',
    file: 'orcamento.docx',
    prefix: 'Orcamento',
    kind: 'client',
    description: 'Proposta comercial com escopo, valor e forma de pagamento.',
  },
  {
    id: 'contrato',
    label: 'Contrato Padrão',
    file: 'contrato.docx',
    prefix: 'Contrato',
    kind: 'client',
    description: 'Contrato de prestação de serviços vinculado ao orçamento aprovado.',
  },
  {
    id: 'entrega',
    label: 'Termo de Entrega',
    file: 'termo-entrega.docx',
    prefix: 'Termo_de_Entrega',
    kind: 'client',
    description: 'Aceite de conclusão e entrega final do site.',
  },
  {
    id: 'transferencia',
    label: 'Termo de Transferência de Infraestrutura',
    file: 'termo-transferencia.docx',
    prefix: 'Termo_de_Transferencia',
    kind: 'client',
    description: 'Transferência de repositório, hospedagem e domínio ao cliente.',
  },
  {
    id: 'manual',
    label: 'Manual de Instruções Básicas',
    file: 'manual-instrucoes.docx',
    prefix: 'Manual_de_Instrucoes',
    kind: 'client',
    description: 'Orientações ao cliente após assumir a infraestrutura do site.',
  },
  {
    id: 'manutencao',
    label: 'Termo de Manutenção Mensal',
    file: 'termo-manutencao.docx',
    prefix: 'Termo_de_Manutencao',
    kind: 'client',
    description: 'Acordo do plano de manutenção mensal, quando contratado.',
  },
];
