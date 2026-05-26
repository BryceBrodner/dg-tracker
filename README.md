# DG Tracker — Bryce's 24-Week Triathlon + Strength Build

Live dashboard for the Delta Grind program. Dark Whoop-grade aesthetic, Vercel-hosted, Postgres-backed.

## What's inside
- **Hero**: countdown to race day, current week, phase progress ring
- **Today**: prescribed workout with the exact lifts / durations / zones
- **This Week**: 7-day strip with today's session highlighted
- **Charts**: body weight (with goal line), run pace (with 8:00 target), weekly volume stack
- **Recovery snapshot**: latest sleep, RHR, week-feel
- **Quick-log**: tabbed forms for metrics, runs, and workouts (mobile-friendly)
- **Recent activity**: feed of last 12 sessions

Phone-friendly. Updates from laptop or phone sync via Postgres.

---

## Deploy to Vercel (≈5 min total)

### 1. Install the Vercel CLI (once)
```bash
npm i -g vercel
```

### 2. From this folder, run:
```bash
vercel
```
- Log in if prompted.
- When asked "Set up and deploy?" → **Y**
- "Which scope?" → your personal account
- "Link to existing project?" → **N**
- "What's your project's name?" → `dg-tracker` (or whatever)
- "In which directory is your code located?" → `./`
- Vercel auto-detects Next.js. Hit enter through the rest.

It'll deploy and give you a `https://dg-tracker-xxxx.vercel.app` URL. Open it — you'll see a red "Database not connected" banner. That's expected for the next 60 seconds.

### 3. Attach Postgres (3 clicks)
- Go to [vercel.com/dashboard](https://vercel.com/dashboard) → click your `dg-tracker` project
- Click the **Storage** tab → **Create Database** → **Postgres** (Neon-backed, free tier is plenty)
- Pick a name like `dg-db`, region `Washington D.C. (iad1)` or `Chicago` if available
- After it's created, click **Connect Project** → select `dg-tracker` → **Connect**

Vercel auto-injects all the `POSTGRES_URL` env vars into your project.

### 4. Redeploy to pick up the env vars
```bash
vercel --prod
```
Or just trigger a redeploy from the Vercel dashboard. The banner disappears, logging works.

### 5. (Optional) Custom domain
Project Settings → Domains → add `dg.yourdomain.com` or use the free `*.vercel.app` URL.

---

## Local development
```bash
npm install
# copy your env vars from Vercel → Storage → .env.local tab
cp .env.example .env.local
# paste real values into .env.local
npm run dev
```
Visit http://localhost:3000

---

## How to use it weekly

**Daily (after a workout):**
- Open the site on phone → Log tab → Workout or Run
- Paste in distance/duration; pace auto-computes
- For Apple Watch runs: just transcribe the summary numbers

**Sunday check-in:**
- Log tab → Metrics
- Enter weight, sleep avg, RHR, week-feel (1–10), optional note
- This is the only "required" entry to keep the recovery & weight trends honest

**Adjusting the program:**
All program data lives in `lib/program.ts`:
- Phase boundaries / durations
- Weekly split
- Run prescription per phase
- Strength A / Strength B exercise lists are in `components/TodayCard.tsx`

Edit, commit, push. Vercel auto-deploys on push if you connect a Git repo (optional).

---

## Tech
Next.js 14 (App Router) · Vercel Postgres (Neon) · Tailwind · Recharts · TypeScript
