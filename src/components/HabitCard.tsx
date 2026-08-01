"use client";

import { HabitDef } from "@/lib/habits";

interface Props {
  habit: HabitDef;
  done: boolean;
  onToggle: () => void;
}

export default function HabitCard({ habit, done, onToggle }: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={done}
      className={[
        "group relative flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition-all duration-200 active:scale-[0.98]",
        done
          ? "border-emerald-400/40 bg-emerald-400/10 shadow-lg shadow-emerald-500/10"
          : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10",
      ].join(" ")}
    >
      <span
        className={[
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl transition",
          done ? "bg-emerald-400/20" : "bg-white/5",
        ].join(" ")}
      >
        {habit.icon}
      </span>

      <span className="min-w-0 flex-1">
        <span className={["block truncate text-sm font-semibold", done ? "text-emerald-200" : "text-white"].join(" ")}>
          {habit.label}
        </span>
        <span className="block truncate text-xs text-white/40">{habit.hint} · {habit.xp} XP</span>
      </span>

      <span
        className={[
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition",
          done ? "border-emerald-400 bg-emerald-400" : "border-white/25 group-hover:border-white/50",
        ].join(" ")}
      >
        {done && (
          <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-900" fill="none" stroke="currentColor" strokeWidth={3.5}>
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
    </button>
  );
}
