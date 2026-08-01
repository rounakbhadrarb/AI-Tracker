"use client";

import { levelInfo } from "@/lib/stats";

export default function XPBar({ xp }: { xp: number }) {
  const info = levelInfo(xp);
  return (
    <div className="w-full">
      <div className="mb-2 flex items-end justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-sm font-bold text-white shadow-lg shadow-indigo-500/30">
            {info.level}
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-white">Level {info.level}</p>
            <p className="text-xs text-white/50">{info.title}</p>
          </div>
        </div>
        <p className="text-xs tabular-nums text-white/60">
          {info.into} / {info.need} XP
        </p>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 transition-all duration-700"
          style={{ width: `${info.pct}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-white/40">{xp.toLocaleString()} XP earned in total</p>
    </div>
  );
}
