"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ReferenceLine,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ATHLETE } from "@/lib/program";
import { shortDate } from "@/lib/format";
import type { BodyMetric } from "@/lib/db";

export default function WeightChart({ metrics }: { metrics: BodyMetric[] }) {
  const data = [...metrics]
    .filter((m) => m.weight_lb)
    .reverse()
    .map((m) => ({
      date: shortDate(m.date),
      weight: m.weight_lb,
    }));

  const latest = data.length ? data[data.length - 1].weight : ATHLETE.startingWeight;
  const delta = latest && typeof latest === "number" ? latest - ATHLETE.startingWeight : 0;

  return (
    <div className="card p-5 h-full flex flex-col">
      <div className="flex items-baseline justify-between mb-3">
        <div>
          <div className="metric-label">Body Weight</div>
          <div className="flex items-baseline gap-2 mt-1">
            <div className="font-display text-4xl text-ink-100 leading-none">
              {latest ? Number(latest).toFixed(1) : "—"}
            </div>
            <div className="text-ink-400 text-xs font-mono">lb</div>
            {delta !== 0 && (
              <div className={`text-xs font-mono ml-2 ${delta > 0 ? "text-accent-lime" : "text-accent-rose"}`}>
                {delta > 0 ? "+" : ""}
                {delta.toFixed(1)}
              </div>
            )}
          </div>
        </div>
        <div className="text-right text-[10px] font-mono text-ink-400">
          GOAL {ATHLETE.goalWeight} lb
        </div>
      </div>

      <div className="flex-1 min-h-[180px]">
        {data.length === 0 ? (
          <EmptyState message="Log weight on Sunday to start tracking" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 5, bottom: 0, left: -10 }}>
              <defs>
                <linearGradient id="wt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c5f02d" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#c5f02d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="#5b6371" fontSize={10} />
              <YAxis stroke="#5b6371" fontSize={10} domain={["dataMin - 2", "dataMax + 2"]} />
              <Tooltip
                contentStyle={{
                  background: "#15181c",
                  border: "1px solid #2a2f38",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <ReferenceLine
                y={ATHLETE.goalWeight}
                stroke="#22e3d8"
                strokeDasharray="3 3"
                opacity={0.5}
              />
              <Area
                type="monotone"
                dataKey="weight"
                stroke="#c5f02d"
                strokeWidth={2}
                fill="url(#wt)"
              />
            </AreaChart>
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
