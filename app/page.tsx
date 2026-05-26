import TopBar from "@/components/TopBar";
import Hero from "@/components/Hero";
import ThisWeek from "@/components/ThisWeek";
import TodayCard from "@/components/TodayCard";
import WeightChart from "@/components/WeightChart";
import RunPaceChart from "@/components/RunPaceChart";
import VolumeChart from "@/components/VolumeChart";
import LogPanel from "@/components/LogPanel";
import RecentActivity from "@/components/RecentActivity";
import RecoveryCard from "@/components/RecoveryCard";
import { getMetrics, getRuns, getWorkouts, initDb } from "@/lib/db";
import { RACE_DATE } from "@/lib/program";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  // Ensure tables exist (idempotent, cheap)
  let metrics: any[] = [];
  let runs: any[] = [];
  let workouts: any[] = [];
  let dbError = false;

  try {
    await initDb();
    [metrics, runs, workouts] = await Promise.all([getMetrics(), getRuns(), getWorkouts()]);
  } catch (err) {
    dbError = true;
  }

  return (
    <main className="min-h-screen">
      <TopBar />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">
        {dbError && (
          <div className="card border-accent-rose/40 bg-accent-rose/5 p-4 text-sm text-ink-100">
            <strong className="text-accent-rose">Database not connected.</strong>{" "}
            Add the <code className="font-mono text-accent-lime">POSTGRES_URL</code> env var in
            your Vercel project settings (Storage → Postgres → connect). The UI will work but
            logging won't persist until then.
          </div>
        )}

        {/* Hero */}
        <Hero />

        {/* Today + This Week */}
        <div className="grid lg:grid-cols-[1fr,1fr] gap-6">
          <TodayCard />
          <RecoveryCard metrics={metrics} />
        </div>

        <ThisWeek />

        {/* Charts row */}
        <div className="grid lg:grid-cols-3 gap-6">
          <WeightChart metrics={metrics} />
          <RunPaceChart runs={runs} />
          <VolumeChart workouts={workouts} runs={runs} />
        </div>

        {/* Log + Recent */}
        <div className="grid lg:grid-cols-[2fr,1fr] gap-6">
          <LogPanel />
          <RecentActivity runs={runs} workouts={workouts} />
        </div>

        {/* Footer */}
        <footer className="pt-8 pb-12 text-center text-[10px] uppercase tracking-widest text-ink-500">
          Race day · {new Date(RACE_DATE + "T00:00:00").toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </footer>
      </div>
    </main>
  );
}
