import type { Client } from '../types';
import { Button, EmptyState, SectionTitle, StageBadge } from './ui';

export function Clientes({
  clients,
  onNew,
  onEdit,
  onDelete,
  onOpen,
}: {
  clients: Client[];
  onNew: () => void;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
  onOpen: (client: Client) => void;
}) {
  const th =
    'border-b border-edge px-2.5 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.03em] text-muted';

  return (
    <div>
      <SectionTitle
        title={`Clientes (${clients.length})`}
        action={<Button onClick={onNew}>+ Novo cliente</Button>}
      />

      {clients.length === 0 ? (
        <EmptyState>
          Nenhum cliente cadastrado ainda. Use o botão <strong>+ Novo cliente</strong>{' '}
          para adicionar o primeiro.
        </EmptyState>
      ) : (
        <div className="overflow-x-auto rounded-[14px] border border-edge bg-card">
          <table className="w-full min-w-[760px] border-collapse text-[13px]">
            <thead>
              <tr>
                <th className={th}>Cliente</th>
                <th className={th}>Contato</th>
                <th className={th}>Projeto</th>
                <th className={th}>Domínio/Repo</th>
                <th className={th}>Etapa</th>
                <th className={th} />
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id}>
                  <td className="border-b border-edge px-2.5 py-2.5 align-top">
                    <button
                      type="button"
                      onClick={() => onOpen(c)}
                      className="font-bold text-left underline-offset-2 hover:underline"
                    >
                      {c.name}
                    </button>
                    {c.segment && <div className="text-muted">{c.segment}</div>}
                  </td>
                  <td className="border-b border-edge px-2.5 py-2.5 align-top">
                    {c.whatsapp || '—'}
                    {c.email && <div className="text-muted">{c.email}</div>}
                  </td>
                  <td className="border-b border-edge px-2.5 py-2.5 align-top">
                    {c.projectType || '—'}
                  </td>
                  <td className="border-b border-edge px-2.5 py-2.5 align-top">
                    {c.domain || '—'}
                    {c.repo && <div className="text-muted">{c.repo}</div>}
                  </td>
                  <td className="border-b border-edge px-2.5 py-2.5 align-top">
                    <StageBadge stage={c.pipelineStage} />
                  </td>
                  <td className="border-b border-edge px-2.5 py-2.5 align-top">
                    <div className="flex gap-1.5">
                      <Button size="sm" variant="ghost" onClick={() => onOpen(c)}>
                        Documentos
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => onEdit(c)}>
                        Editar
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => onDelete(c)}>
                        Excluir
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
