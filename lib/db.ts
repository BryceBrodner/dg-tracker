import { sql } from "@vercel/postgres";

export type BodyMetric = {
  id?: number;
  date: string;
  weight_lb: number | null;
  sleep_hr: number | null;
  rhr: number | null;
  week_feel: number | null; // 1-10
  notes: string | null;
};

export type RunEntry = {
  id?: number;
  date: string;
  distance_mi: number;
  duration_min: number;
  avg_pace_sec_per_mi: number;
  avg_hr: number | null;
  zone: string | null;
  notes: string | null;
};

export type WorkoutEntry = {
  id?: number;
  date: string;
  type: "strength_a" | "strength_b" | "bike" | "brick" | "swim" | "mobility";
  duration_min: number;
  rpe: number | null; // 1-10
  notes: string | null;
};

export async function initDb() {
  await sql`
    CREATE TABLE IF NOT EXISTS body_metrics (
      id SERIAL PRIMARY KEY,
      date DATE NOT NULL UNIQUE,
      weight_lb NUMERIC(5,1),
      sleep_hr NUMERIC(3,1),
      rhr INTEGER,
      week_feel INTEGER,
      notes TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS runs (
      id SERIAL PRIMARY KEY,
      date DATE NOT NULL,
      distance_mi NUMERIC(5,2) NOT NULL,
      duration_min NUMERIC(6,2) NOT NULL,
      avg_pace_sec_per_mi INTEGER NOT NULL,
      avg_hr INTEGER,
      zone TEXT,
      notes TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS workouts (
      id SERIAL PRIMARY KEY,
      date DATE NOT NULL,
      type TEXT NOT NULL,
      duration_min INTEGER NOT NULL,
      rpe INTEGER,
      notes TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
}

export async function getMetrics(limit = 90): Promise<BodyMetric[]> {
  const { rows } = await sql<BodyMetric>`
    SELECT id, to_char(date, 'YYYY-MM-DD') as date,
           weight_lb::float as weight_lb,
           sleep_hr::float as sleep_hr,
           rhr, week_feel, notes
    FROM body_metrics
    ORDER BY date DESC
    LIMIT ${limit};
  `;
  return rows;
}

export async function getRuns(limit = 50): Promise<RunEntry[]> {
  const { rows } = await sql<RunEntry>`
    SELECT id, to_char(date, 'YYYY-MM-DD') as date,
           distance_mi::float as distance_mi,
           duration_min::float as duration_min,
           avg_pace_sec_per_mi, avg_hr, zone, notes
    FROM runs
    ORDER BY date DESC
    LIMIT ${limit};
  `;
  return rows;
}

export async function getWorkouts(limit = 100): Promise<WorkoutEntry[]> {
  const { rows } = await sql<WorkoutEntry>`
    SELECT id, to_char(date, 'YYYY-MM-DD') as date,
           type, duration_min, rpe, notes
    FROM workouts
    ORDER BY date DESC
    LIMIT ${limit};
  `;
  return rows;
}

export async function upsertMetric(m: BodyMetric) {
  await sql`
    INSERT INTO body_metrics (date, weight_lb, sleep_hr, rhr, week_feel, notes)
    VALUES (${m.date}, ${m.weight_lb}, ${m.sleep_hr}, ${m.rhr}, ${m.week_feel}, ${m.notes})
    ON CONFLICT (date) DO UPDATE
    SET weight_lb = EXCLUDED.weight_lb,
        sleep_hr = EXCLUDED.sleep_hr,
        rhr = EXCLUDED.rhr,
        week_feel = EXCLUDED.week_feel,
        notes = EXCLUDED.notes;
  `;
}

export async function insertRun(r: RunEntry) {
  await sql`
    INSERT INTO runs (date, distance_mi, duration_min, avg_pace_sec_per_mi, avg_hr, zone, notes)
    VALUES (${r.date}, ${r.distance_mi}, ${r.duration_min}, ${r.avg_pace_sec_per_mi}, ${r.avg_hr}, ${r.zone}, ${r.notes});
  `;
}

export async function insertWorkout(w: WorkoutEntry) {
  await sql`
    INSERT INTO workouts (date, type, duration_min, rpe, notes)
    VALUES (${w.date}, ${w.type}, ${w.duration_min}, ${w.rpe}, ${w.notes});
  `;
}
