"use client";

import Link from "next/link";
import { useMemo } from "react";
import ProgressRing from "@/components/ProgressRing";
import XPBar from "@/components/XPBar";
import CalendarHeatmap from "@/components/CalendarHeatmap";
import { Card, CardTitle, StatCard } from "@/components/Ui";
import { useStore } from "@/lib/store";
import { HABITS, quoteForDay } from "@/lib/habits";
import {
  completionPct,
  currentStreak,
  dayXp,
  doneCount,
  getDay,
  levelInfo,
  totalXp,
  Point,
} from "@/lib/stats";
import { dayNumber, prettyDate, rangeFrom, todayKey } from "@/lib/date";

export default function DashboardPage() {
  const { state, hydrated, toggleHabit } = useStore();
  const today = todayKey();
  const day = getDay(state, today);
  const pct = completionPct(day);
  const done = doneCount(day);
  const xp = totalXp(state);
  const level = levelInfo(xp);
  const streak = currentStreak(state);
  const dayNo = Math.min(dayNumber(state.settings.startDate, today), state.settings.goalDays);
  const challengePct = Math.round((dayNo / state.settings.goalDays) * 100);

  const heat: Point[] = useMemo(
    () =>
      rangeFrom(state.settings.startDate, state.settings.goalDays).map((key) => ({
        key,
        value: completionPct(getDay(state, key)),
      })),
    [state],
  );

  if (!hydrated) return <Skeleton />;

  const remaining = HABITS.filter((h) => !day.habits[h.id]);

  return (
    <div className="animate-fade-up space-y-5">
      <header className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-white/40">{prettyDate(today)}</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white md:text-3xl">
            {state.settings.name ? `Hey ${state.settings.name} 👋` : "Let's go 👋"}
          </h1>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-center">
          <p className="text-[10px] uppercase tracking-widest text-white/40">Day</p>
          <p className="text-xl font-bold tabular-nums text-white">
            {dayNo}
            <span className="text-sm font-normal text-white/40">/{state.settings.goalDays}</span>
          </p>
        </div>
      </header>

      <Card className="flex flex-col items-center gap-6 md:flex-row md:items-center md:gap-10">
        <ProgressRing
          value={pct}
          size={190}
          label={`${pct}%`}
          sub="today"
          from={pct >= 70 ? "#10b981" : "#6366f1"}
          to={pct >= 70 ? "#a3e635" : "#22d3ee"}
        />
        <div className="w-full flex-1 space-y-5">
          <XPBar xp={xp} />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard icon="🔥" value={streak} label="Day streak" accent="from-orange-500/25 to-rose-500/10" />
            <StatCard icon="✅" value={`${done}/${HABITS.length}`} label="Habits today" accent="from-emerald-500/25 to-teal-500/10" />
            <StatCard icon="⚡" value={dayXp(day)} label="XP today" accent="from-violet-500/25 to-fuchsia-500/10" />
            <StatCard icon="🏁" value={`${challengePct}%`} label="Challenge" accent="from-sky-500/25 to-indigo-500/10" />
          </div>
        </div>
      </Card>

      <Card className="border-indigo-400/20 bg-gradient-to-br from-indigo-500/15 to-cyan-500/5">
        <p className="text-[11px] uppercase tracking-widest text-white/45">Today&apos;s fuel</p>
        <p className="mt-2 text-lg font-medium leading-snug text-white/90">
          &ldquo;{quoteForDay(dayNo)}&rdquo;
        </p>
      </Card>

      <Card>
        <CardTitle
          title="Quick check-in"
          sub={remaining.length ? `${remaining.length} habits left today` : "Everything done. Perfect day 💎"}
          right={
            <Link href="/habits" className="rounded-xl bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20">
              Open
            </Link>
          }
        />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {HABITS.map((h) => {
            const on = !!day.habits[h.id];
            return (
              <button
                key={h.id}
                onClick={() => toggleHabit(today, h.id)}
                className={[
                  "flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-xs font-medium transition active:scale-95",
                  on
                    ? "border-emerald-400/40 bg-emerald-400/15 text-emerald-200"
                    : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10",
                ].join(" ")}
              >
                <span className="text-base">{h.icon}</span>
                <span className="truncate">{h.label}</span>
              </button>
            );
          })}
        </div>
      </Card>

      <Card>
        <CardTitle title={`${state.settings.goalDays}-day heatmap`} sub={`Level ${level.level} · ${level.title}`} />
        <CalendarHeatmap data={heat} />
      </Card>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-5">
      <div className="h-16 animate-pulse rounded-3xl bg-white/5" />
      <div className="h-64 animate-pulse rounded-3xl bg-white/5" />
      <div className="h-40 animate-pulse rounded-3xl bg-white/5" />
    </div>
  );
}
