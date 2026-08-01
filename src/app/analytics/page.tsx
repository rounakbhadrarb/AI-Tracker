"use client";

import { useMemo, useState } from "react";
import { Card, CardTitle, StatCard } from "@/components/Ui";
import { BarChart, HBars, LineChart } from "@/components/Charts";
import CalendarHeatmap from "@/components/CalendarHeatmap";
import { useStore } from "@/lib/store";
import {
  achievements,
  activeDays,
  averageCompletion,
  bestStreak,
  completionPct,
  completionSeries,
  currentStreak,
  getDay,
  habitRates,
  perfectDays,
  solvedSeries,
  totalSolved,
  totalXp,
  xpSeries,
  Point,
} from "@/lib/stats";
import { rangeFrom } from "@/lib/date";

const RANGES = [7, 30, 90] as const;

export default function AnalyticsPage() {
  const { state, hydrated } = useStore();
  const [range, setRange] = useState<(typeof RANGES)[number]>(30);

  const heat: Point[] = useMemo(
    () =>
      rangeFrom(state.settings.startDate, state.settings.goalDays).map((key) => ({
        key,
        value: completionPct(getDay(state, key)),
      })),
    [state],
  );

  if (!hydrated) return <div className="h-96 animate-pulse rounded-3xl bg-white/5" />;

  const unlocked = achievements(state);

  return (
    <div className="animate-fade-up space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">Analytics</h1>
        <div className="flex rounded-xl border border-white/10 bg-white/5 p-1">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={[
                "rounded-lg px-3 py-1.5 text-xs font-semibold transition",
                range === r ? "bg-white/15 text-white" : "text-white/45 hover:text-white",
              ].join(" ")}
            >
              {r}d
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard icon="🔥" value={currentStreak(state)} label="Current streak" accent="from-orange-500/25 to-rose-500/10" />
        <StatCard icon="🏅" value={bestStreak(state)} label="Best streak" accent="from-amber-500/25 to-yellow-500/10" />
        <StatCard icon="📊" value={`${averageCompletion(state, range)}%`} label={`Avg · ${range}d`} accent="from-cyan-500/25 to-sky-500/10" />
        <StatCard icon="⚡" value={totalXp(state).toLocaleString()} label="Total XP" accent="from-violet-500/25 to-fuchsia-500/10" />
        <StatCard icon="💎" value={perfectDays(state)} label="Perfect days" accent="from-emerald-500/25 to-teal-500/10" />
        <StatCard icon="📆" value={activeDays(state)} label="Active days" accent="from-indigo-500/25 to-blue-500/10" />
        <StatCard icon="💻" value={totalSolved(state)} label="Problems solved" accent="from-rose-500/25 to-pink-500/10" />
        <StatCard
          icon="🎯"
          value={`${state.settings.dailyTargetPct}%`}
          label="Daily target"
          accent="from-slate-500/25 to-slate-400/10"
        />
      </div>

      <Card>
        <CardTitle title="This week" sub="Daily completion %" />
        <BarChart data={completionSeries(state, 7)} max={100} />
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardTitle title={`Completion trend · ${range} days`} sub="Percentage of habits done each day" />
          <LineChart data={completionSeries(state, range)} max={100} color="#22d3ee" />
        </Card>
        <Card>
          <CardTitle title={`XP earned · ${range} days`} sub="Includes habit, bonus and LeetCode XP" />
          <LineChart data={xpSeries(state, range)} suffix=" XP" color="#a78bfa" />
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardTitle title={`Habit consistency · ${range} days`} sub="Worst first — fix the red ones" />
          <HBars rows={habitRates(state, range)} />
        </Card>
        <Card>
          <CardTitle title={`Problems solved · ${range} days`} sub="LeetCode volume per day" />
          <LineChart data={solvedSeries(state, range)} suffix="" color="#34d399" />
        </Card>
      </div>

      <Card>
        <CardTitle title="Challenge heatmap" sub={`All ${state.settings.goalDays} days`} />
        <CalendarHeatmap data={heat} />
      </Card>

      <Card>
        <CardTitle
          title="🏆 Achievements"
          sub={`${unlocked.filter((a) => a.unlocked).length}/${unlocked.length} unlocked`}
        />
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
          {unlocked.map((a) => (
            <div
              key={a.id}
              className={[
                "rounded-2xl border p-3 transition",
                a.unlocked
                  ? "border-amber-400/30 bg-gradient-to-br from-amber-400/15 to-orange-500/5"
                  : "border-white/10 bg-white/[0.03] opacity-45",
              ].join(" ")}
            >
              <div className="text-2xl">{a.icon}</div>
              <p className="mt-1.5 text-xs font-semibold text-white">{a.label}</p>
              <p className="mt-0.5 text-[10px] leading-snug text-white/45">{a.desc}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
