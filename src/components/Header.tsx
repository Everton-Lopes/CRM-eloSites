import type { SyncKind } from '../hooks/useSyncStatus';
import { Button } from './ui';

export function Header({
  syncKind,
  syncLabel,
  email,
  onLogout,
}: {
  syncKind: SyncKind;
  syncLabel: string;
  email?: string | null;
  onLogout?: () => void;
}) {
  const pill =
    syncKind === 'online'
      ? 'border-ok/30 text-ok'
      : 'border-warn/30 text-warn';

  return (
    <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <div className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-brand to-brand-light" />
        <div>
          <h1 className="m-0 text-lg font-extrabold tracking-tight">ēloSites CRM</h1>
          <span className="text-xs text-muted">Clientes · financeiro · pipeline</span>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {email && <span className="hidden text-[11px] text-muted sm:inline">{email}</span>}
        <div
          className={`whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] ${pill}`}
        >
          {syncLabel}
        </div>
        {onLogout && (
          <Button variant="ghost" size="sm" onClick={onLogout}>
            Sair
          </Button>
        )}
      </div>
    </header>
  );
}
