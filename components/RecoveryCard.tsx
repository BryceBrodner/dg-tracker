"use client";

import type { BodyMetric } from "@/lib/db";

export default function RecoveryCard({ metrics }: { metrics: BodyMetric[] }) {
  const latest = metrics.find((m) => m.sleep_hr || m.rhr || m.week_feel);

  return (
    <div className="card p-5">
      <div className="metric-label">Recovery</div>
      <div className="font-display text-2xl text-ink-100 mt-1 mb-4">SNAPSHOT</div>

      <div className="grid grid-cols-3 gap-3">
        <Tile
          label="Sleep"
          value={latest?.sleep_hr ?? null}
          unit="hr"
          color="text-accent-cyan"
        />
        <Tile
          label="RHR"
          value={latest?.rhr ?? null}
          unit="bpm"
          color="text-accent-amber"
        />
        <Tile
          label="Feel"
          value={latest?.week_feel ?? null}
          unit="/10"
          color="text-accent-lime"
        />
      </div>

      {latest?.notes && (
        <div className="mt-4 text-xs text-ink-300 italic border-t border-ink-800 pt-3">
          “{latest.notes}”
        </div>
      )}
      {!latest && (
        <div className="mt-2 text-xs text-ink-400 italic">
          Log Sunday check-in to populate.
        </div>
      )}
    </div>
  );
}

function Tile({
  label,
  value,
  unit,
  color,
}: {
  label: string;
  value: number | null;
  unit: string;
  color: string;
}) {
  return (
    <div className="bg-ink-950/40 border border-ink-700/40 rounded-xl p-3">
      <div className="text-[9px] uppercase tracking-widest text-ink-400 font-semibold">
        {label}
      </div>
      <div className={`font-display text-3xl ${color} leading-none mt-1`}>
        {value !== null && value !== undefined ? value : "—"}
      </div>
      <div className="text-[10px] text-ink-400 font-mono mt-0.5">{unit}</div>
    </div>
  );
}
