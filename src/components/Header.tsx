import type { SyncKind } from '../hooks/useSyncStatus';
import { Button } from './ui';

function SpeakerIcon({ muted }: { muted: boolean }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M11 5 6 9H3v6h3l5 4V5z" />
      {muted ? (
        <>
          <line x1="22" y1="9" x2="16" y2="15" />
          <line x1="16" y1="9" x2="22" y2="15" />
        </>
      ) : (
        <>
          <path d="M15.5 8.5a5 5 0 0 1 0 7" />
          <path d="M18.5 5.5a9 9 0 0 1 0 13" />
        </>
      )}
    </svg>
  );
}

export function Header({
  syncKind,
  syncLabel,
  email,
  onLogout,
  soundOn,
  onToggleSound,
}: {
  syncKind: SyncKind;
  syncLabel: string;
  email?: string | null;
  onLogout?: () => void;
  soundOn: boolean;
  onToggleSound: () => void;
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
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSound}
          className={soundOn ? 'text-ok' : 'text-muted'}
        >
          <SpeakerIcon muted={!soundOn} />
          {soundOn ? 'Som ligado' : 'Som desligado'}
        </Button>
        {onLogout && (
          <Button variant="ghost" size="sm" onClick={onLogout}>
            Sair
          </Button>
        )}
      </div>
    </header>
  );
}
