import { useState } from 'react';
import { DOCUMENT_TEMPLATES } from '../constants';
import { generateDocument } from '../lib/documents';
import { fmtBRL, stageLabel } from '../lib/format';
import type { Client } from '../types';
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
}: {
  client: Client;
  onClose: () => void;
}) {
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate(id: string) {
    setError(null);
    setBusyId(id);
    try {
      await generateDocument(id, client);
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
      <div className="max-h-[88vh] w-full max-w-[560px] overflow-y-auto rounded-2xl border border-edge bg-bg2 p-5">
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

        <div className="mb-3">
          <h4 className="m-0 text-[15px] font-bold">Gerar documentos</h4>
          <p className="mt-1 text-xs text-muted">
            Cada documento é baixado em .docx já preenchido com os dados deste cliente.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {DOCUMENT_TEMPLATES.map((t) => (
            <Button
              key={t.id}
              variant="ghost"
              onClick={() => handleGenerate(t.id)}
              disabled={busyId !== null}
            >
              {busyId === t.id ? 'Gerando…' : t.label}
            </Button>
          ))}
        </div>

        {client.documentLogs.length > 0 && (
          <div className="mt-4 border-t border-edge pt-3">
            <h4 className="m-0 text-[13px] font-bold">Documentos gerados</h4>
            <ul className="mt-2 flex list-none flex-col gap-1 p-0 text-xs text-muted">
              {[...client.documentLogs]
                .sort((a, b) => b.generatedAt - a.generatedAt)
                .map((log, idx) => (
                  <li key={`${log.templateId}-${log.generatedAt}-${idx}`}>
                    <strong className="text-text">{log.templateLabel}</strong> gerado em{' '}
                    {fmtLogDate(log.generatedAt)}
                  </li>
                ))}
            </ul>
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
