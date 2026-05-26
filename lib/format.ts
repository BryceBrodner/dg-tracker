export function formatPace(secPerMi: number): string {
  if (!secPerMi || isNaN(secPerMi)) return "—";
  const m = Math.floor(secPerMi / 60);
  const s = Math.round(secPerMi - m * 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function parsePace(str: string): number | null {
  // "8:30" -> 510
  const m = str.match(/^(\d+):(\d{1,2})$/);
  if (!m) return null;
  return parseInt(m[1]) * 60 + parseInt(m[2]);
}

export function formatDuration(min: number): string {
  if (min < 60) return `${Math.round(min)}m`;
  const h = Math.floor(min / 60);
  const m = Math.round(min - h * 60);
  return `${h}h ${m}m`;
}

export function shortDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function weekdayShort(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short" });
}
