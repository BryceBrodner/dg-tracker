"use client";

import { WEEKLY_SPLIT, RUN_PRESCRIPTION, getCurrentPhase, getCurrentWeek } from "@/lib/program";

const ICONS: Record<string, string> = {
  strength: "◆",
  run: "▲",
  bike: "●",
  swim: "≈",
  brick: "◢",
  rest: "○",
  mobility: "◌",
};

const COLORS: Record<string, string> = {
  strength: "text-accent-violet border-accent-violet/40",
  run: "text-accent-lime border-accent-lime/40",
  bike: "text-accent-cyan border-accent-cyan/40",
  swim: "text-accent-cyan border-accent-cyan/40",
  brick: "text-accent-amber border-accent-amber/40",
  rest: "text-ink-400 border-ink-600",
  mobility: "text-ink-300 border-ink-600",
};

export default function ThisWeek() {
  const today = new Date();
  const week = getCurrentWeek(today);
  const phase = getCurrentPhase(week);
  const rx = RUN_PRESCRIPTION[phase.id];

  const dayIdx = today.getDay();
  const monIdx = [6, 0, 1, 2, 3, 4, 5][dayIdx];

  return (
    <div className="card p-5">
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <div className="metric-label">This Week</div>
          <div className="font-display text-2xl text-ink-100 mt-1">
            WEEK {week} · {phase.name.toUpperCase()}
          </div>
        </div>
        <div className="text-ink-400 text-xs font-mono">
          Run Rx: Tue {rx.tueMin}m · Sat {rx.satMin}m
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {WEEKLY_SPLIT.map((day, i) => {
          const isToday = i === monIdx;
          const isPast = i < monIdx;
          return (
            <div
              key={day.day}
              className={`
                relative rounded-xl p-3 border transition
                ${isToday ? "bg-ink-800 border-accent-lime shadow-glow" : "bg-ink-950/40 " + COLORS[day.type]}
                ${isPast ? "opacity-50" : ""}
              `}
            >
              <div className="flex items-center justify-between">
                <div className="text-[10px] uppercase tracking-widest text-ink-400 font-semibold">
                  {day.day}
                </div>
                <div className={`text-lg leading-none ${isToday ? "text-accent-lime" : ""}`}>
                  {ICONS[day.type]}
                </div>
              </div>
              <div className="font-display text-[11px] md:text-base mt-2 leading-tight text-ink-100">
                <span className="hidden sm:inline">{day.title.toUpperCase()}</span>
                <span className="sm:hidden">
                  {day.type === "strength" ? day.title.slice(-1) : day.title.split(" ")[0].toUpperCase()}
                </span>
              </div>
              <div className="text-[10px] text-ink-400 mt-1 hidden md:block leading-tight">
                {day.detail}
              </div>
              {isToday && (
                <div className="absolute -top-2 -right-2 bg-accent-lime text-ink-950 text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                  Today
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 text-xs text-ink-300 italic">{phase.notes}</div>
    </div>
  );
}
