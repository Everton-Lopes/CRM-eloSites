import { STAGES } from '../constants';
import type { Client } from '../types';
import { SectionTitle } from './ui';

export function Pipeline({
  clients,
  onStageChange,
}: {
  clients: Client[];
  onStageChange: (client: Client, stage: string) => void;
}) {
  return (
    <div>
      <SectionTitle title="Pipeline" />
      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2.5">
        {STAGES.map((stage) => {
          const inStage = clients.filter(
            (c) => (c.pipelineStage || 'lead') === stage.id,
          );
          return (
            <div
              key={stage.id}
              className="min-h-[80px] rounded-[14px] border border-edge bg-card p-2.5"
            >
              <h3 className="mb-2.5 mt-0.5 px-1 text-[11px] font-semibold uppercase tracking-[0.03em] text-muted">
                {stage.label} ({inStage.length})
              </h3>
              {inStage.map((c) => (
                <div
                  key={c.id}
                  className="mb-2 rounded-[10px] border border-edge bg-bg2 p-2.5 text-[12.5px]"
                >
                  <div className="mb-1 font-bold">{c.name}</div>
                  {c.projectType && <div className="text-muted">{c.projectType}</div>}
                  <select
                    className="mt-1.5 w-full rounded-lg border border-edge bg-card px-1.5 py-1 text-[11.5px] text-text outline-none focus:border-brand"
                    value={stage.id}
                    onChange={(e) => onStageChange(c, e.target.value)}
                  >
                    {STAGES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
