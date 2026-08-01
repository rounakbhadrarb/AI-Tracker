"use client";

import { useState } from "react";
import HabitCard from "@/components/HabitCard";
import ProgressRing from "@/components/ProgressRing";
import { Card, CardTitle } from "@/components/Ui";
import { useStore } from "@/lib/store";
import { HABITS } from "@/lib/habits";
import { completionPct, dayXp, doneCount, getDay } from "@/lib/stats";
import { addDays, diffDays, isFuture, prettyDate, todayKey } from "@/lib/date";

const GROUPS: { name: string; key: "Body" | "Mind"; icon: string }[] = [
  { name: "Body", key: "Body", icon: "💪" },
  { name: "Mind", key: "Mind", icon: "🧠" },
];

export default function HabitsPage() {
  const { state, hydrated, toggleHabit, setLeet, setNote } = useStore();
  const [dateKey, setDateKey] = useState(todayKey());

  if (!hydrated) return <div className="h-96 animate-pulse rounded-3xl bg-white/5" />;

  const day = getDay(state, dateKey);
  const pct = completionPct(day);
  const solved = day.leetcode.easy + day.leetcode.medium + day.leetcode.hard;
  const canGoForward = !isFuture(addDays(dateKey, 1));
  const offset = diffDays(todayKey(), dateKey);
  const dayLabel = offset === 0 ? "Today" : offset === -1 ? "Yesterday" : prettyDate(dateKey);

  return (
    <div className="animate-fade-up space-y-5">
      <Card className="flex items-center justify-between gap-4">
        <button
          onClick={() => setDateKey(addDays(dateKey, -1))}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10 active:scale-95"
          aria-label="Previous day"
        >
          ‹
        </button>
        <div className="text-center">
          <p className="text-lg font-bold text-white">{dayLabel}</p>
          <p className="text-xs text-white/45">{prettyDate(dateKey)}</p>
        </div>
        <button
          onClick={() => canGoForward && setDateKey(addDays(dateKey, 1))}
          disabled={!canGoForward}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10 active:scale-95 disabled:opacity-25"
          aria-label="Next day"
        >
          ›
        </button>
      </Card>

      <Card className="flex flex-col items-center gap-6 sm:flex-row">
        <ProgressRing
          value={pct}
          size={150}
          stroke={12}
          label={`${doneCount(day)}`}
          sub={`of ${HABITS.length}`}
          gradientId="habits-ring"
          from={pct >= 70 ? "#10b981" : "#6366f1"}
          to={pct >= 70 ? "#a3e635" : "#22d3ee"}
        />
        <div className="grid flex-1 grid-cols-3 gap-3 text-center">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <p className="text-2xl font-bold tabular-nums text-white">{pct}%</p>
            <p className="text-[10px] uppercase tracking-wider text-white/45">Complete</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <p className="text-2xl font-bold tabular-nums text-white">{dayXp(day)}</p>
            <p className="text-[10px] uppercase tracking-wider text-white/45">XP</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <p className="text-2xl font-bold tabular-nums text-white">{solved}</p>
            <p className="text-[10px] uppercase tracking-wider text-white/45">Solved</p>
          </div>
        </div>
      </Card>

      {GROUPS.map((g) => (
        <Card key={g.key}>
          <CardTitle
            title={`${g.icon} ${g.name}`}
            sub={`${HABITS.filter((h) => h.category === g.key && day.habits[h.id]).length}/${
              HABITS.filter((h) => h.category === g.key).length
            } done`}
          />
          <div className="grid gap-2 sm:grid-cols-2">
            {HABITS.filter((h) => h.category === g.key).map((h) => (
              <HabitCard
                key={h.id}
                habit={h}
                done={!!day.habits[h.id]}
                onToggle={() => toggleHabit(dateKey, h.id)}
              />
            ))}
          </div>
        </Card>
      ))}

      <Card>
        <CardTitle title="💻 LeetCode today" sub="Tap to log problems solved" />
        <div className="grid grid-cols-3 gap-3">
          {(["easy", "medium", "hard"] as const).map((lvl) => (
            <Counter
              key={lvl}
              label={lvl}
              value={day.leetcode[lvl]}
              color={lvl === "easy" ? "emerald" : lvl === "medium" ? "amber" : "rose"}
              onChange={(v) => setLeet(dateKey, lvl, v)}
            />
          ))}
        </div>
      </Card>

      <Card>
        <CardTitle title="📝 Day note" sub="What went well, what to fix tomorrow" />
        <textarea
          value={day.note ?? ""}
          onChange={(e) => setNote(dateKey, e.target.value)}
          rows={4}
          placeholder="Wins, blockers, thoughts…"
          className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 p-3.5 text-sm text-white placeholder-white/30 outline-none transition focus:border-cyan-400/50 focus:bg-white/10"
        />
      </Card>
    </div>
  );
}

function Counter({
  label,
  value,
  color,
  onChange,
}: {
  label: string;
  value: number;
  color: "emerald" | "amber" | "rose";
  onChange: (v: number) => void;
}) {
  const ring = {
    emerald: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
    amber: "border-amber-400/30 bg-amber-400/10 text-amber-200",
    rose: "border-rose-400/30 bg-rose-400/10 text-rose-200",
  }[color];

  return (
    <div className={`rounded-2xl border p-3 text-center ${ring}`}>
      <p className="text-[10px] font-semibold uppercase tracking-wider opacity-80">{label}</p>
      <p className="my-1.5 text-3xl font-bold tabular-nums text-white">{value}</p>
      <div className="flex justify-center gap-2">
        <button
          onClick={() => onChange(value - 1)}
          className="h-8 w-8 rounded-lg bg-white/10 text-white transition hover:bg-white/20 active:scale-90"
          aria-label={`decrease ${label}`}
        >
          −
        </button>
        <button
          onClick={() => onChange(value + 1)}
          className="h-8 w-8 rounded-lg bg-white/20 text-white transition hover:bg-white/30 active:scale-90"
          aria-label={`increase ${label}`}
        >
          +
        </button>
      </div>
    </div>
  );
}
