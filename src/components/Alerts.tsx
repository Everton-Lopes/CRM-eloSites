import { useEffect, useRef, useState } from 'react';
import { fmtBRL } from '../lib/format';
import type { Client } from '../types';

export type AlertSeverity = 'warning' | 'danger';

export interface ClientAlert {
  id: string;
  severity: AlertSeverity;
  before: string;
  client: Client;
  after: string;
}

const DAY_MS = 86_400_000;

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function parseISODate(value: string | undefined): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec((value || '').slice(0, 10));
  if (!m) return null;
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}

function diffDays(from: Date, to: Date): number {
  return Math.round((from.getTime() - to.getTime()) / DAY_MS);
}

function formatBr(d: Date): string {
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(
    2,
    '0',
  )}/${d.getFullYear()}`;
}

export function computeAlerts(clients: Client[], now: Date = new Date()): ClientAlert[] {
  const today = startOfDay(now);
  const alerts: ClientAlert[] = [];

  clients.forEach((client) => {
    client.paymentInstallments.forEach((inst, idx) => {
      if (inst.paid) return;
      const date = parseISODate(inst.date);
      if (!date) return;
      const diff = diffDays(date, today);
      const value = fmtBRL(inst.value);
      if (diff >= 0 && diff <= 3) {
        alerts.push({
          id: `${client.id}-inst-${idx}-soon`,
          severity: 'warning',
          before: `Parcela de ${value} de `,
          client,
          after: ` vence em ${diff} dia(s)`,
        });
      } else if (diff < 0) {
        alerts.push({
          id: `${client.id}-inst-${idx}-late`,
          severity: 'danger',
          before: `Parcela de ${value} de `,
          client,
          after: ` está atrasada desde ${formatBr(date)}`,
        });
      }
    });

    const maintenanceStart = parseISODate(client.maintenanceStartDate);
    if (client.maintenance && maintenanceStart && maintenanceStart < today) {
      alerts.push({
        id: `${client.id}-maintenance`,
        severity: 'danger',
        before: 'Manutenção de ',
        client,
        after: ` deveria ter começado em ${formatBr(maintenanceStart)}`,
      });
    }

    const delivery = parseISODate(client.deliveryDate);
    const delivered =
      client.pipelineStage === 'entregue' || client.pipelineStage === 'manutencao';
    if (delivery && delivery < today && !delivered) {
      alerts.push({
        id: `${client.id}-delivery`,
        severity: 'danger',
        before: 'Entrega de ',
        client,
        after: ` está atrasada (previsão: ${formatBr(delivery)})`,
      });
    }
  });

  return alerts;
}

export function Alerts({
  alerts,
  onSelectClient,
}: {
  alerts: ClientAlert[];
  onSelectClient: (client: Client) => void;
}) {
  if (alerts.length === 0) return null;

  const styles: Record<AlertSeverity, string> = {
    warning: 'border-warn/30 bg-warn/10 text-warn',
    danger: 'border-danger/40 bg-danger/10 text-danger',
  };

  return (
    <div className="mb-4 flex flex-col gap-2">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`flex items-center gap-2 rounded-[10px] border px-3 py-2 text-xs ${styles[alert.severity]}`}
        >
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
          <span>
            {alert.before}
            <button
              type="button"
              onClick={() => onSelectClient(alert.client)}
              className="font-semibold underline underline-offset-2 hover:opacity-80"
            >
              {alert.client.name}
            </button>
            {alert.after}
          </span>
        </div>
      ))}
    </div>
  );
}

function playBeep(ctx: AudioContext) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = 880;
  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.26);
}

export function useAlertSound(alertCount: number) {
  const [soundOn, setSoundOn] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const countRef = useRef(alertCount);
  countRef.current = alertCount;

  function beep() {
    try {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctor) return;
      if (!ctxRef.current) ctxRef.current = new Ctor();
      const ctx = ctxRef.current;
      if (ctx.state === 'suspended') void ctx.resume();
      playBeep(ctx);
    } catch {
      // Ignore audio errors — the visual alert remains.
    }
  }

  useEffect(() => {
    if (soundOn && countRef.current > 0) beep();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [soundOn]);

  useEffect(() => {
    if (!soundOn || alertCount === 0) return;
    const id = window.setInterval(beep, 60_000);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [soundOn, alertCount]);

  useEffect(() => {
    return () => {
      if (ctxRef.current) {
        void ctxRef.current.close();
        ctxRef.current = null;
      }
    };
  }, []);

  return { soundOn, toggleSound: () => setSoundOn((v) => !v) };
}
