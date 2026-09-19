import type { ReactNode } from 'react';
import { stageLabel } from '../lib/format';

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled,
  className = '',
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'ghost' | 'danger';
  size?: 'md' | 'sm';
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
}) {
  const base =
    'inline-flex items-center gap-1.5 rounded-[10px] font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-brand text-white hover:bg-brand-light',
    ghost: 'border border-edge text-text hover:bg-white/5',
    danger: 'border border-danger/40 text-danger hover:bg-danger/10',
  } as const;
  const sizes = {
    md: 'px-3.5 py-2 text-[13px]',
    sm: 'px-2.5 py-1.5 text-xs',
  } as const;
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-[14px] border border-edge bg-card p-4 ${className}`}>
      {children}
    </div>
  );
}

export function Kpi({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <Card>
      <div className="text-[11px] font-semibold uppercase tracking-[0.04em] text-muted">
        {label}
      </div>
      <div className="mt-1.5 text-[22px] font-extrabold tracking-tight">{value}</div>
      {sub && <div className="mt-0.5 text-[11px] text-muted">{sub}</div>}
    </Card>
  );
}

export function StageBadge({ stage }: { stage: string | undefined }) {
  const id = stage || 'lead';
  const colors: Record<string, string> = {
    lead: 'text-muted',
    proposta: 'text-[#93C5FD] border-[rgba(147,197,253,0.3)]',
    contrato: 'text-brand-light border-[rgba(129,140,248,0.35)]',
    pagamento: 'text-warn border-[rgba(251,191,36,0.3)]',
    desenvolvimento: 'text-brand-light border-[rgba(129,140,248,0.35)]',
    aprovacao: 'text-warn border-[rgba(251,191,36,0.3)]',
    publicacao: 'text-[#67E8F9] border-[rgba(103,232,249,0.3)]',
    entregue: 'text-ok border-[rgba(52,211,153,0.3)]',
    manutencao: 'text-ok border-[rgba(52,211,153,0.3)]',
  };
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full border border-edge px-2 py-[3px] text-[11px] ${
        colors[id] || 'text-muted'
      }`}
    >
      {stageLabel(id)}
    </span>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[14px] border border-edge bg-card px-3 py-[30px] text-center text-[13px] text-muted">
      {children}
    </div>
  );
}

export function SectionTitle({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-3 flex flex-wrap items-center justify-between gap-2.5">
      <h2 className="text-[15px] font-bold">{title}</h2>
      {action}
    </div>
  );
}
