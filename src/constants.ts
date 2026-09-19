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

export const PROJECT_TYPES = ['Landing page', 'Site institucional', 'Outro'] as const;

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
}

export const DOCUMENT_TEMPLATES: DocumentTemplate[] = [
  { id: 'briefing', label: 'Briefing', file: 'briefing.docx', prefix: 'Briefing' },
  { id: 'orcamento', label: 'Orçamento', file: 'orcamento.docx', prefix: 'Orcamento' },
  { id: 'contrato', label: 'Contrato Padrão', file: 'contrato.docx', prefix: 'Contrato' },
  {
    id: 'entrega',
    label: 'Termo de Entrega',
    file: 'termo-entrega.docx',
    prefix: 'Termo_de_Entrega',
  },
  {
    id: 'transferencia',
    label: 'Termo de Transferência de Infraestrutura',
    file: 'termo-transferencia.docx',
    prefix: 'Termo_de_Transferencia',
  },
  {
    id: 'manutencao',
    label: 'Termo de Manutenção Mensal',
    file: 'termo-manutencao.docx',
    prefix: 'Termo_de_Manutencao',
  },
];
