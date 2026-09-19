import * as XLSX from 'xlsx';
import type { Client } from '../types';
import { stageLabel } from './format';

function num(n: number | null): number | '' {
  return n === null || n === undefined ? '' : n;
}

export function exportSpreadsheet(clients: Client[]): void {
  const workbook = XLSX.utils.book_new();

  const clientesRows = clients.map((c) => ({
    'Cliente/Empresa': c.name,
    'CPF/CNPJ': c.cnpjCpf,
    WhatsApp: c.whatsapp,
    'E-mail': c.email,
    Segmento: c.segment,
    Projeto: c.projectType,
    Domínio: c.domain,
    Hospedagem: c.hosting,
    'Repositório GitHub': c.repo,
    'Data contratação': c.contractDate,
    'Data prevista entrega': c.deliveryDate,
    'Situação do projeto': stageLabel(c.pipelineStage),
    'Manutenção contratada?': c.maintenance ? 'Sim' : 'Não',
    'Início manutenção': c.maintenanceStartDate,
    Observações: c.notes,
  }));
  const clientesSheet = XLSX.utils.json_to_sheet(clientesRows);
  XLSX.utils.book_append_sheet(workbook, clientesSheet, 'Clientes');

  const financeiroRows: Record<string, string | number>[] = clients.map((c) => {
    const budget = c.budget ?? 0;
    const deposit = c.deposit ?? 0;
    const net = c.budget === null ? null : c.budget - (c.feesAmount ?? 0);
    return {
      Cliente: c.name,
      Projeto: c.projectType,
      'Valor orçado (R$)': num(c.budget),
      'Entrada recebida (R$)': num(c.deposit),
      'Restante a receber (R$)': c.budget === null ? '' : Math.max(budget - deposit, 0),
      'Valor líquido (R$)': net === null ? '' : net,
      'Processador': c.paymentProvider,
      'Taxas (R$)': num(c.feesAmount),
      'Manutenção mensal (R$)': c.maintenance ? num(c.maintenanceValue) : '',
      'Forma de pagamento': c.paymentMethod,
      Status: c.paymentStatus,
    };
  });
  const totalBudget = clients.reduce((s, c) => s + (c.budget ?? 0), 0);
  const totalDeposit = clients.reduce((s, c) => s + (c.deposit ?? 0), 0);
  const totalFees = clients.reduce((s, c) => s + (c.feesAmount ?? 0), 0);
  financeiroRows.push({
    Cliente: 'TOTAL',
    Projeto: '',
    'Valor orçado (R$)': totalBudget,
    'Entrada recebida (R$)': totalDeposit,
    'Restante a receber (R$)': Math.max(totalBudget - totalDeposit, 0),
    'Valor líquido (R$)': totalBudget - totalFees,
    'Processador': '',
    'Taxas (R$)': totalFees,
    'Manutenção mensal (R$)': '',
    'Forma de pagamento': '',
    Status: '',
  });
  const financeiroSheet = XLSX.utils.json_to_sheet(financeiroRows);
  XLSX.utils.book_append_sheet(workbook, financeiroSheet, 'Financeiro');

  const pipelineRows = clients.map((c) => ({
    Cliente: c.name,
    'Etapa atual': stageLabel(c.pipelineStage),
  }));
  const pipelineSheet = XLSX.utils.json_to_sheet(pipelineRows);
  XLSX.utils.book_append_sheet(workbook, pipelineSheet, 'Pipeline');

  const stamp = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(workbook, `eloSites_Controle_Clientes_Financeiro_${stamp}.xlsx`);
}
