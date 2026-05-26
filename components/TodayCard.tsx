"use client";

import {
  todayPlan,
  getCurrentPhase,
  getCurrentWeek,
  RUN_PRESCRIPTION,
} from "@/lib/program";

const STRENGTH_A = [
  "Goblet Squat — 3×8",
  "DB RDL — 3×8",
  "DB Bench Press — 3×8",
  "Walking Lunge — 3×10/side",
  "Plank — 3×40s",
];

const STRENGTH_B = [
  "DB Row — 3×10/side",
  "DB OHP — 3×8",
  "DB Bulgarian Split Squat — 3×8/side",
  "DB Pullover — 3×10",
  "Hollow Hold — 3×30s",
];

export default function TodayCard() {
  const today = new Date();
  const plan = todayPlan(today);
  const week = getCurrentWeek(today);
  const phase = getCurrentPhase(week);
  const rx = RUN_PRESCRIPTION[phase.id];

  let prescription: string[] = [];
  let durationHint = "";

  if (plan.type === "strength" && plan.title === "Strength A") {
    prescription = STRENGTH_A;
    durationHint = "≈ 45 min · RPE 6–7";
  } else if (plan.type === "strength" && plan.title === "Strength B") {
    prescription = STRENGTH_B;
    durationHint = "≈ 45 min · RPE 6–7";
  } else if (plan.type === "run") {
    prescription = [
      `Easy run · Zone 2 only`,
      `Target duration: ${rx.tueMin} min`,
      `Conversational pace · HR < 145`,
      rx.note,
    ];
    durationHint = `${rx.tueMin} min · Z2`;
  } else if (plan.type === "bike") {
    prescription = [
      "Steady aerobic ride",
      "Outdoor along the lakefront if dry, else trainer",
      "Cadence 85–95 · HR Z2",
      `Duration: ${45 + (phase.id - 1) * 15} min`,
    ];
    durationHint = `${45 + (phase.id - 1) * 15} min · Z2`;
  } else if (plan.type === "brick") {
    if (phase.id <= 2) {
      prescription = [
        `Long run: ${rx.satMin} min Z2`,
        "Brick sessions start Phase 3",
      ];
      durationHint = `${rx.satMin} min`;
    } else {
      prescription = [
        "BIKE: 45–60 min Z2",
        "Transition fast — shoes ready",
        "RUN: 20–30 min off the bike",
        "Note legs/breathing in log",
      ];
      durationHint = "Brick · 75–90 min";
    }
  } else if (plan.type === "rest") {
    prescription = [
      "Full rest day",
      "Sunday check-in — log weight, sleep, RHR, week-feel",
      "10 min walk encouraged",
    ];
    durationHint = "Recovery";
  } else if (plan.type === "mobility") {
    prescription = [
      "20–30 min easy movement",
      "Foam roll quads, glutes, calves",
      "T-spine, hip mobility",
      "Optional: 20 min Z1 walk",
    ];
    durationHint = "30 min · Z1";
  }

  return (
    <div className="card-elev p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent-lime/5 blur-3xl rounded-full" />

      <div className="flex items-start justify-between mb-4 relative">
        <div>
          <div className="metric-label">Today · {plan.day}</div>
          <div className="font-display text-4xl md:text-5xl text-ink-100 mt-1">
            {plan.title.toUpperCase()}
          </div>
          <div className="text-ink-300 text-sm mt-1">{plan.detail}</div>
        </div>
        <div className="text-right">
          <div className="metric-label">Target</div>
          <div className="font-mono text-sm text-accent-lime mt-1">{durationHint}</div>
        </div>
      </div>

      <div className="border-t border-ink-700/40 pt-4 space-y-2">
        {prescription.map((line, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="text-accent-lime font-mono text-xs mt-1">
              {(i + 1).toString().padStart(2, "0")}
            </div>
            <div className="text-ink-100 text-sm">{line}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
