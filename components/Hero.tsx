"use client";

import {
  ATHLETE,
  PROGRAM_WEEKS,
  RACE_DATE,
  daysToRace,
  getCurrentPhase,
  getCurrentWeek,
  PHASES,
} from "@/lib/program";

export default function Hero() {
  const today = new Date();
  const week = getCurrentWeek(today);
  const phase = getCurrentPhase(week);
  const dtr = daysToRace(today);
  const progress = week / PROGRAM_WEEKS;
  const weeksRemain = PROGRAM_WEEKS - week;

  const phaseProgress =
    (week - phase.weeks[0]) / (phase.weeks[1] - phase.weeks[0] + 1);

  // SVG ring math
  const R = 90;
  const C = 2 * Math.PI * R;
  const dash = C * progress;

  return (
    <div className="card-elev p-6 md:p-8 relative overflow-hidden">
      {/* Background number watermark */}
      <div className="absolute -right-6 -top-12 font-display text-[220px] text-ink-100/[0.03] leading-none select-none pointer-events-none">
        {week.toString().padStart(2, "0")}
      </div>

      <div className="grid md:grid-cols-[auto,1fr] gap-8 items-center relative">
        {/* Progress ring */}
        <div className="relative w-[220px] h-[220px] mx-auto md:mx-0">
          <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
            <circle
              cx="100"
              cy="100"
              r={R}
              fill="none"
              stroke="#1e2229"
              strokeWidth="10"
            />
            <circle
              cx="100"
              cy="100"
              r={R}
              fill="none"
              stroke="url(#grad)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${C}`}
            />
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#22e3d8" />
                <stop offset="100%" stopColor="#c5f02d" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="metric-label mb-1">Week</div>
            <div className="font-display text-7xl text-ink-100 leading-none">
              {week}
            </div>
            <div className="text-ink-400 text-xs font-mono mt-1">
              / {PROGRAM_WEEKS}
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="space-y-5">
          <div>
            <div className="metric-label">Athlete</div>
            <div className="font-display text-4xl md:text-5xl mt-1">
              {ATHLETE.name.toUpperCase()}
            </div>
            <div className="text-ink-300 text-sm mt-1">
              {ATHLETE.location}{ATHLETE.role ? ` · ${ATHLETE.role}` : ""}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Stat label="Race In" value={dtr} unit="days" accent="lime" />
            <Stat label="Phase" value={phase.id} unit={`of ${PHASES.length}`} accent="cyan" />
            <Stat label="Weeks Left" value={weeksRemain} unit="" accent="amber" />
          </div>

          <div>
            <div className="flex items-baseline justify-between mb-2">
              <div>
                <span className="metric-label">Phase {phase.id}</span>
                <span className="ml-2 font-display text-xl text-accent-lime">
                  {phase.name.toUpperCase()}
                </span>
              </div>
              <span className="font-mono text-xs text-ink-400">
                W{phase.weeks[0]}–W{phase.weeks[1]}
              </span>
            </div>
            <div className="h-2 bg-ink-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent-cyan to-accent-lime rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, phaseProgress * 100)}%` }}
              />
            </div>
            <div className="text-ink-300 text-sm mt-3">{phase.focus}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  unit,
  accent,
}: {
  label: string;
  value: number | string;
  unit: string;
  accent: "lime" | "cyan" | "amber";
}) {
  const color =
    accent === "lime"
      ? "text-accent-lime"
      : accent === "cyan"
      ? "text-accent-cyan"
      : "text-accent-amber";
  return (
    <div className="bg-ink-950/40 border border-ink-700/40 rounded-xl p-3">
      <div className="metric-label">{label}</div>
      <div className={`font-display text-3xl ${color} leading-none mt-1`}>
        {value}
      </div>
      {unit && <div className="text-ink-400 text-[10px] font-mono mt-1">{unit}</div>}
    </div>
  );
}
