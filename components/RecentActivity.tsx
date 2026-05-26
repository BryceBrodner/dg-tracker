"use client";

import type { RunEntry, WorkoutEntry } from "@/lib/db";
import { formatDuration, formatPace, weekdayShort, shortDate } from "@/lib/format";

type Entry =
  | { kind: "run"; date: string; data: RunEntry }
  | { kind: "workout"; date: string; data: WorkoutEntry };

export default function RecentActivity({
  runs,
  workouts,
}: {
  runs: RunEntry[];
  workouts: WorkoutEntry[];
}) {
  const entries: Entry[] = [
    ...runs.map<Entry>((r) => ({ kind: "run", date: r.date, data: r })),
    ...workouts.map<Entry>((w) => ({ kind: "workout", date: w.date, data: w })),
  ]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 12);

  return (
    <div className="card p-5">
      <div className="metric-label">Recent Activity</div>
      <div className="font-display text-2xl text-ink-100 mt-1 mb-4">FEED</div>

      {entries.length === 0 ? (
        <div className="text-ink-400 text-xs italic py-6 text-center">
          No activity yet. Start logging to populate.
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map((e, i) => (
            <Row key={i} entry={e} />
          ))}
        </div>
      )}
    </div>
  );
}

function Row({ entry }: { entry: Entry }) {
  if (entry.kind === "run") {
    const r = entry.data;
    return (
      <div className="flex items-center gap-3 py-2 border-b border-ink-800 last:border-0">
        <div className="w-10 text-center">
          <div className="text-[9px] uppercase tracking-wider text-ink-400">{weekdayShort(r.date)}</div>
          <div className="font-display text-base text-ink-100 leading-none">
            {shortDate(r.date).split(" ")[1]}
          </div>
        </div>
        <div className="w-8 h-8 rounded-lg bg-accent-lime/10 border border-accent-lime/30 flex items-center justify-center text-accent-lime font-bold">
          ▲
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-display text-sm text-ink-100">
            RUN · {r.distance_mi.toFixed(2)} MI
          </div>
          <div className="text-[10px] text-ink-400 font-mono">
            {formatPace(r.avg_pace_sec_per_mi)} /mi · {formatDuration(r.duration_min)}
            {r.avg_hr ? ` · HR ${r.avg_hr}` : ""}
            {r.zone ? ` · ${r.zone}` : ""}
          </div>
        </div>
      </div>
    );
  }
  const w = entry.data;
  const map: Record<string, { label: string; icon: string; color: string }> = {
    strength_a: { label: "Strength A", icon: "◆", color: "text-accent-violet bg-accent-violet/10 border-accent-violet/30" },
    strength_b: { label: "Strength B", icon: "◆", color: "text-accent-violet bg-accent-violet/10 border-accent-violet/30" },
    bike: { label: "Bike", icon: "●", color: "text-accent-cyan bg-accent-cyan/10 border-accent-cyan/30" },
    brick: { label: "Brick", icon: "◢", color: "text-accent-amber bg-accent-amber/10 border-accent-amber/30" },
    swim: { label: "Swim", icon: "≈", color: "text-accent-cyan bg-accent-cyan/10 border-accent-cyan/30" },
    mobility: { label: "Mobility", icon: "◌", color: "text-ink-300 bg-ink-700/40 border-ink-600" },
  };
  const meta = map[w.type] || map.mobility;
  return (
    <div className="flex items-center gap-3 py-2 border-b border-ink-800 last:border-0">
      <div className="w-10 text-center">
        <div className="text-[9px] uppercase tracking-wider text-ink-400">{weekdayShort(w.date)}</div>
        <div className="font-display text-base text-ink-100 leading-none">
          {shortDate(w.date).split(" ")[1]}
        </div>
      </div>
      <div className={`w-8 h-8 rounded-lg border flex items-center justify-center font-bold ${meta.color}`}>
        {meta.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-display text-sm text-ink-100">{meta.label.toUpperCase()}</div>
        <div className="text-[10px] text-ink-400 font-mono">
          {formatDuration(w.duration_min)}
          {w.rpe ? ` · RPE ${w.rpe}` : ""}
        </div>
      </div>
    </div>
  );
}
