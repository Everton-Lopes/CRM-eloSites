import { Workbook, type Worksheet } from 'exceljs';
import type { Client } from '../types';
import { stageLabel } from './format';

const HEADER_FILL = 'FF1F2937';
const MONEY_FMT = '"R$" #,##0.00';
const DATE_FMT = 'dd/mm/yyyy';
const XLSX_MIME =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

type CellValue = string | number | Date | null;

interface Col {
  header: string;
  money?: boolean;
  date?: boolean;
}

function download(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function parseDate(value: string): Date | null {
  const iso = (value || '').slice(0, 10);
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  const [, y, mo, d] = m;
  return new Date(Number(y), Number(mo) - 1, Number(d));
}

function colLetter(index: number): string {
  let n = index;
  let s = '';
  while (n > 0) {
    const rem = (n - 1) % 26;
    s = String.fromCharCode(65 + rem) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

function displayLength(v: CellValue): number {
  if (v === null || v === undefined) return 0;
  if (v instanceof Date) return 10;
  return String(v).length;
}

function addSheet(
  workbook: Workbook,
  name: string,
  tableName: string,
  cols: Col[],
  rows: CellValue[][],
): Worksheet {
  const ws = workbook.addWorksheet(name);

  ws.addTable({
    name: tableName,
    ref: 'A1',
    headerRow: true,
    totalsRow: false,
    style: { theme: 'TableStyleMedium2', showRowStripes: true },
    columns: cols.map((c) => ({ name: c.header, filterButton: true })),
    rows,
  });

  cols.forEach((c, i) => {
    const values = [c.header, ...rows.map((r) => r[i])];
    const max = values.reduce<number>(
      (m, v) => Math.max(m, displayLength(v)),
      0,
    );
    ws.getColumn(i + 1).width = Math.max(14, Math.min(max + 2, 60));

    if (!c.money && !c.date) return;
    for (let r = 2; r <= rows.length + 1; r++) {
      const cell = ws.getRow(r).getCell(i + 1);
      cell.numFmt = c.money ? MONEY_FMT : DATE_FMT;
    }
  });

  const header = ws.getRow(1);
  header.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: HEADER_FILL },
    };
    cell.alignment = { vertical: 'middle', horizontal: 'left' };
  });

  for (let r = 1; r <= rows.length + 1; r++) {
    ws.getRow(r).eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
  }

  ws.views = [{ state: 'frozen', ySplit: 1 }];
  return ws;
}

export async function exportSpreadsheet(clients: Client[]): Promise<void> {
  const workbook = new Workbook();
  workbook.creator = 'ēloSites CRM';
  workbook.created = new Date();

  const clientRows: CellValue[][] = clients.map((c) => [
    c.name,
    c.cnpjCpf,
    c.whatsapp,
    c.email,
    c.segment,
    c.projectType,
    c.domain,
    c.hosting,
    c.repo,
    parseDate(c.contractDate),
    parseDate(c.deliveryDate),
    stageLabel(c.pipelineStage),
    c.maintenance ? 'Sim' : 'Não',
    parseDate(c.maintenanceStartDate),
    c.notes,
  ]);
  addSheet(
    workbook,
    'Clientes',
    'ClientesTable',
    [
      { header: 'Cliente/Empresa' },
      { header: 'CPF/CNPJ' },
      { header: 'WhatsApp' },
      { header: 'E-mail' },
      { header: 'Segmento' },
      { header: 'Projeto' },
      { header: 'Domínio' },
      { header: 'Hospedagem' },
      { header: 'Repositório GitHub' },
      { header: 'Data contratação', date: true },
      { header: 'Data prevista entrega', date: true },
      { header: 'Situação do projeto' },
      { header: 'Manutenção contratada?' },
      { header: 'Início manutenção', date: true },
      { header: 'Observações' },
    ],
    clientRows,
  );

  const financeCols: Col[] = [
    { header: 'Cliente' },
    { header: 'Projeto' },
    { header: 'Valor orçado (R$)', money: true },
    { header: 'Entrada recebida (R$)', money: true },
    { header: 'Restante a receber (R$)', money: true },
    { header: 'Valor líquido (R$)', money: true },
    { header: 'Processador' },
    { header: 'Taxas (R$)', money: true },
    { header: 'Manutenção mensal (R$)', money: true },
    { header: 'Forma de pagamento' },
    { header: 'Status' },
  ];
  const financeRows: CellValue[][] = clients.map((c) => {
    const budget = c.budget;
    const deposit = c.deposit;
    const restante =
      budget === null ? null : Math.max(budget - (deposit ?? 0), 0);
    const net = budget === null ? null : budget - (c.feesAmount ?? 0);
    return [
      c.name,
      c.projectType,
      budget,
      deposit,
      restante,
      net,
      c.paymentProvider,
      c.feesAmount,
      c.maintenance ? c.maintenanceValue : null,
      c.paymentMethod,
      c.paymentStatus,
    ];
  });
  const financeSheet = addSheet(
    workbook,
    'Financeiro',
    'FinanceiroTable',
    financeCols,
    financeRows,
  );

  if (financeRows.length > 0) {
    const lastDataRow = financeRows.length + 1;
    const totalRow = financeSheet.getRow(lastDataRow + 1);
    totalRow.getCell(1).value = 'TOTAL';
    financeCols.forEach((c, i) => {
      if (!c.money) return;
      const letter = colLetter(i + 1);
      const cell = totalRow.getCell(i + 1);
      cell.value = { formula: `SUM(${letter}2:${letter}${lastDataRow})` };
      cell.numFmt = MONEY_FMT;
    });
    totalRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
  }

  const pipelineRows: CellValue[][] = clients.map((c) => [
    c.name,
    stageLabel(c.pipelineStage),
  ]);
  addSheet(
    workbook,
    'Pipeline',
    'PipelineTable',
    [{ header: 'Cliente' }, { header: 'Etapa atual' }],
    pipelineRows,
  );

  const buffer = await workbook.xlsx.writeBuffer();
  const stamp = new Date().toISOString().slice(0, 10);
  download(
    new Blob([buffer as ArrayBuffer], { type: XLSX_MIME }),
    `eloSites_Controle_Clientes_Financeiro_${stamp}.xlsx`,
  );
}

export function exportBackupJSON(clients: Client[]): void {
  const stamp = new Date().toISOString().slice(0, 10);
  const blob = new Blob([JSON.stringify(clients, null, 2)], {
    type: 'application/json',
  });
  download(blob, `elosites-crm-backup-${stamp}.json`);
}
