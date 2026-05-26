"use client";

import { useEffect, useState } from "react";

export default function TopBar() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setTime(
        d.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          timeZone: "America/Chicago",
        }) + " CT"
      );
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="border-b border-ink-800 bg-ink-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-accent-lime flex items-center justify-center text-ink-950 font-display text-lg leading-none">
            DG
          </div>
          <div>
            <div className="font-display text-lg leading-none">DELTA GRIND</div>
            <div className="text-[10px] uppercase tracking-widest text-ink-400 mt-0.5">
              Triathlon · Strength · 24wk
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-widest text-ink-400">Chicago</div>
          <div className="font-mono text-xs text-accent-lime">{time}</div>
        </div>
      </div>
    </div>
  );
}
