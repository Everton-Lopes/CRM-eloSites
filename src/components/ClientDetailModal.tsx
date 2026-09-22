import { useState } from 'react';
import { DOCUMENT_TEMPLATES } from '../constants';
import { generateDocument } from '../lib/documents';
import { fmtBRL, parseDateParts, stageLabel } from '../lib/format';
import type { Client, DocumentLogEntry } from '../types';
import { Button, StageBadge } from './ui';

function fmtLogDate(ts: number): string {
  if (!ts) return '—';
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}

export function ClientDetailModal({
  client,
  onClose,
  onDeleteDocumentLog,
}: {
  client: Client;
  onClose: () => void;
  onDeleteDocumentLog: (log: DocumentLogEntry) => Promise<void> | void;
}) {
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const installments = client.paymentInstallments;
  const paidInstallments = installments.filter((i) => i.paid);
  const paidTotal = paidInstallments.reduce(
    (sum, i) => sum + (Number(i.value) || 0),
    0,
  );
  const pendingTotal = installments.reduce(
    (sum, i) => (i.paid ? sum : sum + (Number(i.value) || 0)),
    0,
  );

  async function handleGenerate(id: string) {
    setError(null);
    setSuccess(null);
    setBusyId(id);
    try {
      await generateDocument(id, client);
      const template = DOCUMENT_TEMPLATES.find((t) => t.id === id);
      setSuccess(`"${template?.label ?? 'Documento'}" gerado com sucesso.`);
    } catch (err) {
      console.error(err);
      setError('Não foi possível gerar o documento. Verifique se o modelo existe.');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="max-h-[88vh] w-full max-w-[560px] overflow-y-auto rounded-2xl border border-edge bg-bg2 p-4 sm:p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="m-0 text-base font-bold">{client.name}</h3>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
              <StageBadge stage={client.pipelineStage} />
              {client.projectType && <span>{client.projectType}</span>}
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Fechar
          </Button>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-2.5 rounded-[10px] border border-edge bg-card p-3 text-[12.5px]">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.03em] text-muted">
              Etapa
            </div>
            <div>{stageLabel(client.pipelineStage)}</div>
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.03em] text-muted">
              Valor orçado
            </div>
            <div>{fmtBRL(client.budget)}</div>
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.03em] text-muted">
              Entrada recebida
            </div>
            <div>{fmtBRL(client.deposit)}</div>
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.03em] text-muted">
              Manutenção/mês
            </div>
            <div>{client.maintenance ? fmtBRL(client.maintenanceValue) : '—'}</div>
          </div>
          {client.domain && (
            <div className="col-span-2">
              <div className="text-[11px] font-semibold uppercase tracking-[0.03em] text-muted">
                Domínio
              </div>
              <div>{client.domain}</div>
            </div>
          )}
        </div>

        {installments.length > 0 && (
          <div className="mb-5 rounded-[10px] border border-edge bg-card p-3 text-[12.5px]">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <div className="text-[11px] font-semibold uppercase tracking-[0.03em] text-muted">
                Parcelas de pagamento
              </div>
              <div className="text-[11px] text-muted">
                {paidInstallments.length}/{installments.length} pagas
              </div>
            </div>
            <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
              {installments.map((inst, idx) => (
                <li
                  key={idx}
                  className="flex flex-wrap items-center justify-between gap-x-2 gap-y-0.5"
                >
                  <span className="text-muted">
                    {idx + 1}ª parcela
                    {inst.date ? ` · ${parseDateParts(inst.date).br}` : ''}
                  </span>
                  <span className="flex items-center gap-2">
                    <span>{fmtBRL(inst.value)}</span>
                    <span
                      className={`rounded-full border px-1.5 py-[1px] text-[10px] ${
                        inst.paid
                          ? 'border-ok/40 text-ok'
                          : 'border-warn/30 text-warn'
                      }`}
                    >
                      {inst.paid ? 'Paga' : 'Pendente'}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 border-t border-edge pt-2 text-[11px]">
              <span className="text-muted">
                Recebido em parcelas:{' '}
                <strong className="text-ok">{fmtBRL(paidTotal)}</strong>
              </span>
              <span className="text-muted">
                Pendente em parcelas:{' '}
                <strong className="text-warn">{fmtBRL(pendingTotal)}</strong>
              </span>
            </div>
          </div>
        )}

        <div className="mb-3">
          <h4 className="m-0 text-[15px] font-bold">Gerar documentos</h4>
          <p className="mt-1 text-xs text-muted">
            Cada documento é baixado em .docx já preenchido com os dados deste cliente.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {DOCUMENT_TEMPLATES.map((t) => (
            <div
              key={t.id}
              className="flex min-w-0 flex-col rounded-[10px] border border-edge bg-card p-2.5"
            >
              <div className="mb-1 flex items-start justify-between gap-2">
                <span className="text-[12.5px] font-semibold text-text">
                  {t.label}
                </span>
                <span className="shrink-0 rounded-full border border-edge px-1.5 py-[1px] text-[10px] text-muted">
                  {t.kind === 'client' ? 'Cliente' : 'Interno'}
                </span>
              </div>
              <p className="mb-2 text-[11px] leading-snug text-muted">
                {t.description}
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-auto w-full justify-center"
                onClick={() => handleGenerate(t.id)}
                disabled={busyId !== null}
              >
                {busyId === t.id ? 'Gerando…' : 'Gerar'}
              </Button>
            </div>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-muted">
          Todos os documentos acima são entregáveis ao cliente. Arquivos internos de
          referência não são gerados aqui.
        </p>

        {client.documentLogs.length > 0 && (
          <div className="mt-4 border-t border-edge pt-3">
            <h4 className="m-0 text-[13px] font-bold">Documentos gerados</h4>
            <ul className="mt-2 flex list-none flex-col gap-1.5 p-0 text-xs text-muted">
              {[...client.documentLogs]
                .sort((a, b) => b.generatedAt - a.generatedAt)
                .map((log, idx) => (
                  <li
                    key={`${log.templateId}-${log.generatedAt}-${idx}`}
                    className="flex flex-wrap items-center justify-between gap-2"
                  >
                    <span>
                      <strong className="text-text">{log.templateLabel}</strong> gerado em{' '}
                      {fmtLogDate(log.generatedAt)}
                    </span>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => onDeleteDocumentLog(log)}
                    >
                      Excluir
                    </Button>
                  </li>
                ))}
            </ul>
          </div>
        )}

        {success && (
          <div className="mt-3 rounded-lg border border-ok/40 bg-ok/10 px-3 py-2 text-xs text-ok">
            {success}
          </div>
        )}

        {error && (
          <div className="mt-3 rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-xs text-danger">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
