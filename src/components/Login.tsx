import { useState, type FormEvent } from 'react';
import { Button } from './ui';

export function Login({
  onLogin,
}: {
  onLogin: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const result = await onLogin(email, password);
    setBusy(false);
    if (!result.ok) setError(result.error ?? 'Não foi possível entrar.');
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-5 flex items-center gap-2.5">
          <div className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-brand to-brand-light" />
          <div>
            <h1 className="m-0 text-lg font-extrabold tracking-tight">ēloSites CRM</h1>
            <span className="text-xs text-muted">Acesso restrito</span>
          </div>
        </div>
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-edge bg-bg2 p-5"
        >
          <h2 className="mb-4 text-base font-bold">Entrar</h2>
          <div className="mb-3">
            <label className="mb-1 block text-[11px] font-semibold text-muted">E-mail</label>
            <input
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-edge bg-card px-2.5 py-2 text-[13px] text-text outline-none focus:border-brand"
            />
          </div>
          <div className="mb-4">
            <label className="mb-1 block text-[11px] font-semibold text-muted">Senha</label>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-edge bg-card px-2.5 py-2 text-[13px] text-text outline-none focus:border-brand"
            />
          </div>
          {error && (
            <div className="mb-3 rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-xs text-danger">
              {error}
            </div>
          )}
          <Button type="submit" disabled={busy} className="w-full justify-center">
            {busy ? 'Entrando…' : 'Entrar'}
          </Button>
          <p className="mt-3 text-center text-[11px] text-muted">
            Não há cadastro público. O acesso é criado no console do Firebase.
          </p>
        </form>
      </div>
    </div>
  );
}
