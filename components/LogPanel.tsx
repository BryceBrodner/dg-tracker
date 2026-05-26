"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { parsePace } from "@/lib/format";

type Tab = "metrics" | "run" | "workout";

export default function LogPanel() {
  const [tab, setTab] = useState<Tab>("metrics");
  const router = useRouter();

  return (
    <div className="card p-5">
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <div className="metric-label">Log</div>
          <div className="font-display text-2xl text-ink-100 mt-1">QUICK ENTRY</div>
        </div>
        <div className="flex gap-1 bg-ink-800 p-1 rounded-lg">
          <TabBtn active={tab === "metrics"} onClick={() => setTab("metrics")}>
            Metrics
          </TabBtn>
          <TabBtn active={tab === "run"} onClick={() => setTab("run")}>
            Run
          </TabBtn>
          <TabBtn active={tab === "workout"} onClick={() => setTab("workout")}>
            Workout
          </TabBtn>
        </div>
      </div>

      {tab === "metrics" && <MetricsForm onSaved={() => router.refresh()} />}
      {tab === "run" && <RunForm onSaved={() => router.refresh()} />}
      {tab === "workout" && <WorkoutForm onSaved={() => router.refresh()} />}
    </div>
  );
}

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-md text-[11px] uppercase tracking-wider font-semibold transition ${
        active ? "bg-accent-lime text-ink-950" : "text-ink-300 hover:text-ink-100"
      }`}
    >
      {children}
    </button>
  );
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function MetricsForm({ onSaved }: { onSaved: () => void }) {
  const [date, setDate] = useState(todayISO());
  const [weight, setWeight] = useState("");
  const [sleep, setSleep] = useState("");
  const [rhr, setRhr] = useState("");
  const [feel, setFeel] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    const res = await fetch("/api/log-metrics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date,
        weight_lb: weight ? parseFloat(weight) : null,
        sleep_hr: sleep ? parseFloat(sleep) : null,
        rhr: rhr ? parseInt(rhr) : null,
        week_feel: feel ? parseInt(feel) : null,
        notes: notes || null,
      }),
    });
    setBusy(false);
    if (res.ok) {
      setMsg("Saved.");
      setWeight("");
      setSleep("");
      setRhr("");
      setFeel("");
      setNotes("");
      onSaved();
    } else {
      setMsg("Error — check connection.");
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Field label="Date">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-yellow" />
        </Field>
        <Field label="Weight (lb)">
          <input
            type="number"
            step="0.1"
            placeholder="155.0"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="input-yellow"
          />
        </Field>
        <Field label="Sleep (hr)">
          <input
            type="number"
            step="0.1"
            placeholder="7.5"
            value={sleep}
            onChange={(e) => setSleep(e.target.value)}
            className="input-yellow"
          />
        </Field>
        <Field label="RHR (bpm)">
          <input
            type="number"
            placeholder="58"
            value={rhr}
            onChange={(e) => setRhr(e.target.value)}
            className="input-yellow"
          />
        </Field>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <Field label="Week Feel (1–10)">
          <input
            type="number"
            min={1}
            max={10}
            placeholder="7"
            value={feel}
            onChange={(e) => setFeel(e.target.value)}
            className="input-yellow"
          />
        </Field>
        <div className="md:col-span-3">
          <Field label="Notes">
            <input
              type="text"
              placeholder="Optional context"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input-yellow"
            />
          </Field>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button type="submit" disabled={busy} className="btn-primary disabled:opacity-50">
          {busy ? "Saving…" : "Save"}
        </button>
        {msg && <span className="text-xs text-ink-300">{msg}</span>}
      </div>
    </form>
  );
}

function RunForm({ onSaved }: { onSaved: () => void }) {
  const [date, setDate] = useState(todayISO());
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [pace, setPace] = useState("");
  const [hr, setHr] = useState("");
  const [zone, setZone] = useState("Z2");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    // Derive pace if not provided
    let paceSec = parsePace(pace);
    if (!paceSec && distance && duration) {
      paceSec = Math.round((parseFloat(duration) * 60) / parseFloat(distance));
    }
    if (!paceSec || !distance || !duration) {
      setMsg("Need distance + duration (pace auto-computes).");
      return;
    }

    setBusy(true);
    setMsg("");
    const res = await fetch("/api/log-run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date,
        distance_mi: parseFloat(distance),
        duration_min: parseFloat(duration),
        avg_pace_sec_per_mi: paceSec,
        avg_hr: hr ? parseInt(hr) : null,
        zone: zone || null,
        notes: notes || null,
      }),
    });
    setBusy(false);
    if (res.ok) {
      setMsg("Saved.");
      setDistance("");
      setDuration("");
      setPace("");
      setHr("");
      setNotes("");
      onSaved();
    } else {
      setMsg("Error — check connection.");
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Field label="Date">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-yellow" />
        </Field>
        <Field label="Distance (mi)">
          <input
            type="number"
            step="0.01"
            placeholder="3.20"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            className="input-yellow"
          />
        </Field>
        <Field label="Duration (min)">
          <input
            type="number"
            step="0.1"
            placeholder="32.5"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="input-yellow"
          />
        </Field>
        <Field label="Pace (m:ss /mi)">
          <input
            type="text"
            placeholder="auto"
            value={pace}
            onChange={(e) => setPace(e.target.value)}
            className="input-yellow"
          />
        </Field>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Field label="Avg HR">
          <input
            type="number"
            placeholder="142"
            value={hr}
            onChange={(e) => setHr(e.target.value)}
            className="input-yellow"
          />
        </Field>
        <Field label="Zone">
          <select value={zone} onChange={(e) => setZone(e.target.value)} className="input-yellow">
            <option value="Z1">Z1</option>
            <option value="Z2">Z2</option>
            <option value="Z3">Z3</option>
            <option value="Z4">Z4</option>
            <option value="Z5">Z5</option>
          </select>
        </Field>
        <div className="md:col-span-2">
          <Field label="Notes">
            <input
              type="text"
              placeholder="Lakefront, felt good"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input-yellow"
            />
          </Field>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button type="submit" disabled={busy} className="btn-primary disabled:opacity-50">
          {busy ? "Saving…" : "Save run"}
        </button>
        {msg && <span className="text-xs text-ink-300">{msg}</span>}
      </div>
    </form>
  );
}

function WorkoutForm({ onSaved }: { onSaved: () => void }) {
  const [date, setDate] = useState(todayISO());
  const [type, setType] = useState("strength_a");
  const [duration, setDuration] = useState("");
  const [rpe, setRpe] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!duration) {
      setMsg("Duration required.");
      return;
    }
    setBusy(true);
    setMsg("");
    const res = await fetch("/api/log-workout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date,
        type,
        duration_min: parseInt(duration),
        rpe: rpe ? parseInt(rpe) : null,
        notes: notes || null,
      }),
    });
    setBusy(false);
    if (res.ok) {
      setMsg("Saved.");
      setDuration("");
      setRpe("");
      setNotes("");
      onSaved();
    } else {
      setMsg("Error — check connection.");
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Field label="Date">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-yellow" />
        </Field>
        <Field label="Type">
          <select value={type} onChange={(e) => setType(e.target.value)} className="input-yellow">
            <option value="strength_a">Strength A</option>
            <option value="strength_b">Strength B</option>
            <option value="bike">Bike</option>
            <option value="brick">Brick</option>
            <option value="swim">Swim</option>
            <option value="mobility">Mobility</option>
          </select>
        </Field>
        <Field label="Duration (min)">
          <input
            type="number"
            placeholder="45"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="input-yellow"
          />
        </Field>
        <Field label="RPE (1–10)">
          <input
            type="number"
            min={1}
            max={10}
            placeholder="7"
            value={rpe}
            onChange={(e) => setRpe(e.target.value)}
            className="input-yellow"
          />
        </Field>
      </div>
      <Field label="Notes">
        <input
          type="text"
          placeholder="Optional"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="input-yellow"
        />
      </Field>
      <div className="flex items-center gap-3">
        <button type="submit" disabled={busy} className="btn-primary disabled:opacity-50">
          {busy ? "Saving…" : "Save workout"}
        </button>
        {msg && <span className="text-xs text-ink-300">{msg}</span>}
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="metric-label block mb-1">{label}</span>
      {children}
    </label>
  );
}
