import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import { DOCUMENT_TEMPLATES, LANDING_CATALOG, SITE_CATALOG } from '../constants';
import type { Client, Installment } from '../types';
import { valorPorExtenso } from './extenso';
import { flag, parseDateParts, todayParts } from './format';

function money(n: number | null | undefined): string {
  if (n === null || n === undefined || !isFinite(Number(n))) return '';
  return Number(n).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function daysBetween(from: string, to: string): string {
  const d1 = Date.parse(from);
  const d2 = Date.parse(to);
  if (isNaN(d1) || isNaN(d2)) return '';
  const days = Math.round((d2 - d1) / 86_400_000);
  return days >= 0 ? String(days) : '';
}

function formatInstallments(list: Installment[]): string {
  const valid = list.filter((i) => i.date || (i.value !== null && i.value !== undefined));
  if (valid.length === 0) return '—';
  return valid
    .map((inst, idx) => {
      const parts: string[] = [];
      if (inst.value !== null && inst.value !== undefined) parts.push(`R$ ${money(inst.value)}`);
      if (inst.date) parts.push(`em ${parseDateParts(inst.date).br}`);
      return `${idx + 1}ª parcela: ${parts.join(' ')}`;
    })
    .join('; ');
}

function catalogRows(catalog: string[], selected: string[], active: boolean) {
  const chosen = new Set(selected);
  return catalog.map((label) => ({
    label,
    mark: active && chosen.has(label) ? 'X' : ' ',
  }));
}

export function buildContext(client: Client) {
  const today = todayParts();
  const isLanding = client.projectType === 'Landing page';
  const isSite = client.projectType === 'Site institucional';
  const budget = client.budget;
  const maintenanceStandard = budget ? budget * 0.2 : null;

  return {
    clientName: client.name,
    cnpjCpf: client.cnpjCpf,
    cnpjCpfType: client.cnpjCpfType,
    address: client.address,
    email: client.email,
    whatsapp: client.whatsapp,
    segment: client.segment,
    projectType: client.projectType,
    domain: client.domain,
    hosting: client.hosting,
    repo: client.repo,
    notes: client.notes,

    budgetFormatted: money(budget),
    budgetWords: valorPorExtenso(budget),
    maintenanceValueFormatted: money(client.maintenanceValue),
    maintenanceWords: valorPorExtenso(client.maintenanceValue),
    maintenanceStandardFormatted: money(maintenanceStandard),

    contractDateBr: parseDateParts(client.contractDate).br,
    deliveryDateBr: parseDateParts(client.deliveryDate).br,
    deliveryDays: daysBetween(client.contractDate, client.deliveryDate),
    maintenanceStartDateBr: parseDateParts(client.maintenanceStartDate).br,
    deliveryUrl: client.deliveryUrl,

    today: today.br,
    todayDay: today.day,
    todayMonth: today.month,
    todayYear: today.year,
    budgetNumber: `ORC-${today.year}${String(new Date().getMonth() + 1).padStart(2, '0')}${today.day}`,

    landingMark: flag(isLanding),
    siteMark: flag(isSite),
    otherType: '',
    maintenanceYes: flag(client.maintenance),
    maintenanceNo: flag(!client.maintenance),
    pixMark: flag(/pix/i.test(client.paymentMethod)),
    cardMark: flag(/cart/i.test(client.paymentMethod)),
    otherPayment: '',
    repoYes: flag(Boolean(client.repo)),
    repoNo: flag(!client.repo),
    hostingYes: flag(Boolean(client.hosting)),
    hostingNo: flag(!client.hosting),
    domainYes: flag(Boolean(client.domain)),
    domainNo: flag(!client.domain),
    otherYes: ' ',
    otherNo: ' ',
    transferValue: '',

    installmentsList: formatInstallments(client.paymentInstallments),
    reviewRounds: '2',
    noticeDays: '15',
    cureDays: '15',
    jurisdiction: '',
    maintenanceDueDay: '',

    scopeItems: client.scopeItems,
    landingCatalog: catalogRows(LANDING_CATALOG, client.scopeItems, isLanding),
    siteCatalog: catalogRows(SITE_CATALOG, client.scopeItems, isSite),
    additionalItems: [{ item: '', description: '' }],
  };
}

function safeFileName(name: string): string {
  const cleaned = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  return cleaned || 'Cliente';
}

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function generateDocument(templateId: string, client: Client): Promise<void> {
  const template = DOCUMENT_TEMPLATES.find((t) => t.id === templateId);
  if (!template) throw new Error('Modelo de documento não encontrado.');

  const response = await fetch(`${import.meta.env.BASE_URL}templates/${template.file}`);
  if (!response.ok) {
    throw new Error('Não foi possível carregar o modelo de documento.');
  }
  const arrayBuffer = await response.arrayBuffer();
  const zip = new PizZip(arrayBuffer);
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
    nullGetter: () => '',
  });

  doc.render(buildContext(client));

  const out = doc.getZip().generate({
    type: 'blob',
    mimeType:
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  }) as Blob;

  download(out, `${template.prefix}_${safeFileName(client.name)}.docx`);
}
