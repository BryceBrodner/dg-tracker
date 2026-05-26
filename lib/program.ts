// Bryce's 24-week Olympic Triathlon program
// Started: May 25, 2026

export const ATHLETE = {
  name: "Bryce Brodner",
  age: 23,
  height: "6'0\"",
  startingWeight: 155,
  goalWeight: 178, // lean bulk target
  location: "Chicago",
  role: "",
};

export const PROGRAM_START = "2026-05-25"; // Monday
export const PROGRAM_WEEKS = 24;
// Race target: end of week 24
export const RACE_DATE = "2026-11-08"; // Sunday at end of week 24

export const GOALS = {
  raceA: "Olympic-distance triathlon: 1.5k swim / 40k bike / 10k run",
  runPace: "8:00/mi for 10–12 mi @ Z2",
  bulk: "155 → 175–180 lb lean (secondary, slow trajectory)",
};

export type Phase = {
  id: number;
  name: string;
  weeks: [number, number]; // inclusive
  focus: string;
  notes: string;
  color: string; // accent token
};

export const PHASES: Phase[] = [
  {
    id: 1,
    name: "Base",
    weeks: [1, 4],
    focus: "Aerobic base + movement quality",
    notes: "Build run frequency from zero. Z2 only. Strength = learn movements.",
    color: "accent-cyan",
  },
  {
    id: 2,
    name: "Aerobic + Volume",
    weeks: [5, 8],
    focus: "Aerobic capacity + strength volume",
    notes: "Extend Z2 durations. Add strength sets/reps. First brick session.",
    color: "accent-lime",
  },
  {
    id: 3,
    name: "Specificity",
    weeks: [9, 16],
    focus: "Bricks, threshold work, race-specific",
    notes: "Threshold intervals, weekly brick, swim block once pool secured.",
    color: "accent-amber",
  },
  {
    id: 4,
    name: "Race Prep",
    weeks: [17, 24],
    focus: "Olympic simulation + taper",
    notes: "Full-distance sim weeks 20–22. Taper weeks 23–24.",
    color: "accent-rose",
  },
];

export type DayPlan = {
  day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
  type: "strength" | "run" | "bike" | "swim" | "brick" | "rest" | "mobility";
  title: string;
  detail: string;
};

export const WEEKLY_SPLIT: DayPlan[] = [
  { day: "Mon", type: "strength", title: "Strength A", detail: "Lower / push emphasis" },
  { day: "Tue", type: "run", title: "Run Z2", detail: "Easy aerobic, conversational" },
  { day: "Wed", type: "mobility", title: "Rest / Mobility", detail: "Walk, foam roll, stretch" },
  { day: "Thu", type: "strength", title: "Strength B", detail: "Upper / pull emphasis" },
  { day: "Fri", type: "bike", title: "Bike Z2", detail: "Steady aerobic ride" },
  { day: "Sat", type: "brick", title: "Long Run / Brick", detail: "Phase-dependent" },
  { day: "Sun", type: "rest", title: "Rest + Check-in", detail: "Log weight, sleep, RHR, week feel" },
];

// Per-phase run prescription (Saturday long, Tuesday Z2 duration)
export const RUN_PRESCRIPTION: Record<number, { tueMin: number; satMin: number; note: string }> = {
  1: { tueMin: 20, satMin: 30, note: "Run/walk allowed. Build frequency." },
  2: { tueMin: 30, satMin: 50, note: "Continuous Z2. No walk breaks if possible." },
  3: { tueMin: 40, satMin: 75, note: "Add tempo block mid-week 11+." },
  4: { tueMin: 35, satMin: 90, note: "Race-pace efforts mixed in. Taper W23-24." },
};

export function getCurrentWeek(today: Date = new Date()): number {
  const start = new Date(PROGRAM_START + "T00:00:00");
  const ms = today.getTime() - start.getTime();
  const week = Math.floor(ms / (7 * 24 * 60 * 60 * 1000)) + 1;
  return Math.max(1, Math.min(PROGRAM_WEEKS, week));
}

export function getCurrentPhase(week: number): Phase {
  return PHASES.find((p) => week >= p.weeks[0] && week <= p.weeks[1]) || PHASES[0];
}

export function daysToRace(today: Date = new Date()): number {
  const race = new Date(RACE_DATE + "T00:00:00");
  const ms = race.getTime() - today.getTime();
  return Math.max(0, Math.ceil(ms / (24 * 60 * 60 * 1000)));
}

export function todayPlan(today: Date = new Date()): DayPlan {
  const dayIdx = today.getDay(); // 0 = Sun
  // Map JS day (0=Sun) to our array (Mon-first)
  const map = [6, 0, 1, 2, 3, 4, 5];
  return WEEKLY_SPLIT[map[dayIdx]];
}
