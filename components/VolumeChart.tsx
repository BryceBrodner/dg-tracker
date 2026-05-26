"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { WorkoutEntry, RunEntry } from "@/lib/db";
import { PROGRAM_START } from "@/lib/program";

function weekNum(dateStr: string): number {
  const start = new Date(PROGRAM_START + "T00:00:00");
  const d = new Date(dateStr + "T00:00:00");
  return Math.floor((d.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1;
}

export default function VolumeChart({
  workouts,
  runs,
}: {
  workouts: WorkoutEntry[];
  runs: RunEntry[];
}) {
  // Aggregate by week
  const map: Record<number, { week: number; strength: number; run: number; bike: number; other: number }> = {};

  const touch = (w: number) => {
    if (!map[w]) map[w] = { week: w, strength: 0, run: 0, bike: 0, other: 0 };
    return map[w];
  };

  for (const r of runs) {
    const w = weekNum(r.date);
    if (w >= 1 && w <= 24) touch(w).run += r.duration_min;
  }
  for (const wk of workouts) {
    const w = weekNum(wk.date);
    if (w < 1 || w > 24) continue;
    const slot = touch(w);
    if (wk.type === "strength_a" || wk.type === "strength_b") slot.strength += wk.duration_min;
    else if (wk.type === "bike") slot.bike += wk.duration_min;
    else slot.other += wk.duration_min;
  }

  const data = Object.values(map).sort((a, b) => a.week - b.week);
  const total = data.reduce((acc, d) => acc + d.strength + d.run + d.bike + d.other, 0);

  return (
    <div className="card p-5 h-full flex flex-col">
      <div className="flex items-baseline justify-between mb-3">
        <div>
          <div className="metric-label">Weekly Volume</div>
          <div className="flex items-baseline gap-2 mt-1">
            <div className="font-display text-4xl text-ink-100 leading-none">
              {Math.round(total / 60)}
            </div>
            <div className="text-ink-400 text-xs font-mono">hours total</div>
          </div>
        </div>
        <div className="text-right text-[10px] font-mono text-ink-400">MINUTES / WEEK</div>
      </div>

      <div className="flex-1 min-h-[180px]">
        {data.length === 0 ? (
          <EmptyState message="Log workouts to see weekly volume stack" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 5, bottom: 0, left: -10 }}>
              <XAxis dataKey="week" stroke="#5b6371" fontSize={10} tickFormatter={(v) => `W${v}`} />
              <YAxis stroke="#5b6371" fontSize={10} />
              <Tooltip
                contentStyle={{
                  background: "#15181c",
                  border: "1px solid #2a2f38",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelFormatter={(v) => `Week ${v}`}
              />
              <Legend
                wrapperStyle={{ fontSize: 10, paddingTop: 8 }}
                iconType="square"
              />
              <Bar dataKey="strength" stackId="a" fill="#a78bfa" name="Strength" />
              <Bar dataKey="run" stackId="a" fill="#c5f02d" name="Run" />
              <Bar dataKey="bike" stackId="a" fill="#22e3d8" name="Bike" />
              <Bar dataKey="other" stackId="a" fill="#ffb547" name="Other" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="h-full flex items-center justify-center text-ink-400 text-xs italic">
      {message}
    </div>
  );
}
