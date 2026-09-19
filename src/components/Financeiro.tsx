import { fmtBRL } from '../lib/format';
import type { Client } from '../types';
import { EmptyState, Kpi, SectionTitle } from './ui';

export function Financeiro({ clients }: { clients: Client[] }) {
  const totalBudget = clients.reduce((s, c) => s + (Number(c.budget) || 0), 0);
  const totalDeposit = clients.reduce((s, c) => s + (Number(c.deposit) || 0), 0);

  const th =
    'border-b border-edge px-2.5 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.03em] text-muted';
  const td = 'border-b border-edge px-2.5 py-2.5 align-top';

  return (
    <div>
      <div className="mb-[22px] grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3">
        <Kpi label="Total orçado" value={fmtBRL(totalBudget)} />
        <Kpi label="Total recebido" value={fmtBRL(totalDeposit)} />
        <Kpi label="Saldo a receber" value={fmtBRL(totalBudget - totalDeposit)} />
      </div>

      <SectionTitle title="Detalhamento por cliente" />

      {clients.length === 0 ? (
        <EmptyState>
          Nenhum cliente cadastrado ainda. Use a aba <strong>Clientes</strong> para
          adicionar o primeiro.
        </EmptyState>
      ) : (
        <div className="overflow-x-auto rounded-[14px] border border-edge bg-card">
          <table className="w-full min-w-[760px] border-collapse text-[13px]">
            <thead>
              <tr>
                <th className={th}>Cliente</th>
                <th className={th}>Orçado</th>
                <th className={th}>Recebido</th>
                <th className={th}>Restante</th>
                <th className={th}>Valor líquido</th>
                <th className={th}>Manutenção/mês</th>
                <th className={th}>Processador</th>
                <th className={th}>Pagamento</th>
                <th className={th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => {
                const budget = Number(c.budget) || 0;
                const deposit = Number(c.deposit) || 0;
                const net =
                  c.budget == null ? null : c.budget - (c.feesAmount ?? 0);
                return (
                  <tr key={c.id}>
                    <td className={td}>
                      <strong>{c.name}</strong>
                    </td>
                    <td className={td}>{c.budget != null ? fmtBRL(budget) : '—'}</td>
                    <td className={td}>
                      {c.deposit != null ? fmtBRL(deposit) : '—'}
                    </td>
                    <td className={td}>
                      {c.budget != null ? fmtBRL(Math.max(budget - deposit, 0)) : '—'}
                    </td>
                    <td className={td}>{net != null ? fmtBRL(net) : '—'}</td>
                    <td className={td}>
                      {c.maintenance ? fmtBRL(Number(c.maintenanceValue) || 0) : '—'}
                    </td>
                    <td className={td}>{c.paymentProvider || '—'}</td>
                    <td className={td}>{c.paymentMethod || '—'}</td>
                    <td className={td}>{c.paymentStatus || '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
