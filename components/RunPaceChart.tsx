"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ReferenceLine,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatPace, shortDate } from "@/lib/format";
import type { RunEntry } from "@/lib/db";

const TARGET_PACE_SEC = 8 * 60; // 8:00/mi

export default function RunPaceChart({ runs }: { runs: RunEntry[] }) {
  const data = [...runs]
    .reverse()
    .map((r) => ({
      date: shortDate(r.date),
      pace: r.avg_pace_sec_per_mi,
      distance: r.distance_mi,
    }));

  const latest = data.length ? data[data.length - 1] : null;

  return (
    <div className="card p-5 h-full flex flex-col">
      <div className="flex items-baseline justify-between mb-3">
        <div>
          <div className="metric-label">Run Pace</div>
          <div className="flex items-baseline gap-2 mt-1">
            <div className="font-display text-4xl text-ink-100 leading-none">
              {latest ? formatPace(latest.pace) : "—"}
            </div>
            <div className="text-ink-400 text-xs font-mono">/mi</div>
          </div>
        </div>
        <div className="text-right text-[10px] font-mono text-ink-400">
          TARGET 8:00 /mi
        </div>
      </div>

      <div className="flex-1 min-h-[180px]">
        {data.length === 0 ? (
          <EmptyState message="Drop an Apple Watch run export to begin" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 5, bottom: 0, left: -10 }}>
              <XAxis dataKey="date" stroke="#5b6371" fontSize={10} />
              <YAxis
                stroke="#5b6371"
                fontSize={10}
                domain={["dataMin - 30", "dataMax + 30"]}
                tickFormatter={(v) => formatPace(v)}
                reversed
              />
              <Tooltip
                contentStyle={{
                  background: "#15181c",
                  border: "1px solid #2a2f38",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                formatter={(v: number, n: string) =>
                  n === "pace" ? [formatPace(v), "Pace"] : [v, n]
                }
              />
              <ReferenceLine
                y={TARGET_PACE_SEC}
                stroke="#22e3d8"
                strokeDasharray="3 3"
                opacity={0.5}
                label={{ value: "8:00 target", fill: "#22e3d8", fontSize: 9, position: "right" }}
              />
              <Line
                type="monotone"
                dataKey="pace"
                stroke="#c5f02d"
                strokeWidth={2}
                dot={{ fill: "#c5f02d", r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
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
