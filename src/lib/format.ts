import { STAGES } from './constants';

export function fmtBRL(n: number | null | undefined): string {
  const v = Number(n);
  if (n === null || n === undefined || n === '' || !isFinite(v)) return '—';
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function stageLabel(id: string | undefined): string {
  const s = STAGES.find((x) => x.id === id);
  return s ? s.label : 'Lead';
}

const MONTHS_PT = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
];

export function parseDateParts(value: string | undefined) {
  const today = new Date();
  const iso = (value || '').slice(0, 10);
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) {
    return {
      iso: '',
      day: String(today.getDate()).padStart(2, '0'),
      month: MONTHS_PT[today.getMonth()],
      year: String(today.getFullYear()),
      br: '',
    };
  }
  const [, y, mo, d] = m;
  return {
    iso,
    day: d,
    month: MONTHS_PT[Number(mo) - 1] || '',
    year: y,
    br: `${d}/${mo}/${y}`,
  };
}

export function todayParts() {
  const t = new Date();
  return {
    iso: `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(
      t.getDate(),
    ).padStart(2, '0')}`,
    br: `${String(t.getDate()).padStart(2, '0')}/${String(t.getMonth() + 1).padStart(
      2,
      '0',
    )}/${t.getFullYear()}`,
    day: String(t.getDate()).padStart(2, '0'),
    month: MONTHS_PT[t.getMonth()],
    year: String(t.getFullYear()),
  };
}

export function flag(cond: boolean): string {
  return cond ? 'X' : ' ';
}
