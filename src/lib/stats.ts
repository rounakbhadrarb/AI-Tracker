import { AppState, DayRecord } from "./types";
import { HABITS, HABIT_MAP } from "./habits";
import { addDays, diffDays, lastNDays, todayKey } from "./date";

export const EMPTY_DAY: DayRecord = {
  habits: {},
  leetcode: { easy: 0, medium: 0, hard: 0 },
  note: "",
};

export function getDay(state: AppState, key: string): DayRecord {
  return state.days[key] ?? EMPTY_DAY;
}

export function doneCount(day: DayRecord): number {
  return HABITS.reduce((n, h) => n + (day.habits[h.id] ? 1 : 0), 0);
}

export function completionPct(day: DayRecord): number {
  return Math.round((doneCount(day) / HABITS.length) * 100);
}

export function dayXp(day: DayRecord): number {
  let xp = HABITS.reduce((n, h) => n + (day.habits[h.id] ? h.xp : 0), 0);
  if (doneCount(day) === HABITS.length) xp += 50; // perfect-day bonus
  const solved = day.leetcode.easy + day.leetcode.medium + day.leetcode.hard;
  xp += day.leetcode.easy * 2 + day.leetcode.medium * 5 + day.leetcode.hard * 10;
  if (solved >= 3) xp += 10;
  return xp;
}

export function totalXp(state: AppState): number {
  return Object.values(state.days).reduce((n, d) => n + dayXp(d), 0);
}

export interface LevelInfo {
  level: number;
  title: string;
  into: number;
  need: number;
  pct: number;
}

const TITLES = [
  "Rookie", "Apprentice", "Grinder", "Builder", "Engineer",
  "Architect", "Specialist", "Veteran", "Master", "Legend",
];

/** Level curve: level n requires 250 * n XP to clear. */
export function levelInfo(xp: number): LevelInfo {
  let level = 1;
  let remaining = xp;
  let need = 250;
  while (remaining >= need) {
    remaining -= need;
    level += 1;
    need = 250 * level;
  }
  return {
    level,
    title: TITLES[Math.min(level - 1, TITLES.length - 1)],
    into: remaining,
    need,
    pct: Math.round((remaining / need) * 100),
  };
}

export function isDayWon(state: AppState, key: string): boolean {
  const d = state.days[key];
  if (!d) return false;
  return completionPct(d) >= state.settings.dailyTargetPct;
}

export function currentStreak(state: AppState): number {
  let streak = 0;
  let key = todayKey();
  // today not yet won should not break a streak that is alive through yesterday
  if (!isDayWon(state, key)) key = addDays(key, -1);
  while (isDayWon(state, key)) {
    streak += 1;
    key = addDays(key, -1);
  }
  return streak;
}

export function bestStreak(state: AppState): number {
  const keys = Object.keys(state.days).filter((k) => isDayWon(state, k)).sort();
  let best = 0;
  let run = 0;
  let prev: string | null = null;
  for (const k of keys) {
    run = prev && diffDays(prev, k) === 1 ? run + 1 : 1;
    best = Math.max(best, run);
    prev = k;
  }
  return best;
}

export function activeDays(state: AppState): number {
  return Object.keys(state.days).filter((k) => doneCount(state.days[k]) > 0).length;
}

export function perfectDays(state: AppState): number {
  return Object.values(state.days).filter((d) => doneCount(d) === HABITS.length).length;
}

export function totalSolved(state: AppState): number {
  return Object.values(state.days).reduce(
    (n, d) => n + d.leetcode.easy + d.leetcode.medium + d.leetcode.hard,
    0,
  );
}

export function solvedBreakdown(state: AppState) {
  return Object.values(state.days).reduce(
    (acc, d) => ({
      easy: acc.easy + d.leetcode.easy,
      medium: acc.medium + d.leetcode.medium,
      hard: acc.hard + d.leetcode.hard,
    }),
    { easy: 0, medium: 0, hard: 0 },
  );
}

export interface Point {
  key: string;
  value: number;
}

export function completionSeries(state: AppState, n: number): Point[] {
  return lastNDays(n).map((key) => ({ key, value: completionPct(getDay(state, key)) }));
}

export function xpSeries(state: AppState, n: number): Point[] {
  return lastNDays(n).map((key) => ({ key, value: dayXp(getDay(state, key)) }));
}

export function solvedSeries(state: AppState, n: number): Point[] {
  return lastNDays(n).map((key) => {
    const d = getDay(state, key);
    return { key, value: d.leetcode.easy + d.leetcode.medium + d.leetcode.hard };
  });
}

/** Per-habit hit rate over the last n days, sorted worst-first. */
export function habitRates(state: AppState, n: number) {
  const keys = lastNDays(n);
  return HABITS.map((h) => {
    const hits = keys.reduce((acc, k) => acc + (getDay(state, k).habits[h.id] ? 1 : 0), 0);
    return { id: h.id, label: h.label, icon: h.icon, hits, pct: Math.round((hits / n) * 100) };
  }).sort((a, b) => a.pct - b.pct);
}

export function averageCompletion(state: AppState, n: number): number {
  const s = completionSeries(state, n);
  if (!s.length) return 0;
  return Math.round(s.reduce((a, p) => a + p.value, 0) / s.length);
}

export function bookProgress(state: AppState): number {
  if (!state.books.length) return 0;
  const total = state.books.reduce((a, b) => a + b.totalPages, 0);
  const read = state.books.reduce((a, b) => a + Math.min(b.currentPage, b.totalPages), 0);
  return total ? Math.round((read / total) * 100) : 0;
}

export function dsaProgress(state: AppState): number {
  if (!state.dsa.length) return 0;
  const total = state.dsa.reduce((a, t) => a + t.total, 0);
  const done = state.dsa.reduce((a, t) => a + Math.min(t.done, t.total), 0);
  return total ? Math.round((done / total) * 100) : 0;
}

export interface Achievement {
  id: string;
  label: string;
  icon: string;
  desc: string;
  unlocked: boolean;
}

export function achievements(state: AppState): Achievement[] {
  const xp = totalXp(state);
  const streak = Math.max(currentStreak(state), bestStreak(state));
  const solved = totalSolved(state);
  const perfect = perfectDays(state);
  const active = activeDays(state);
  const defs: Array<[string, string, string, string, boolean]> = [
    ["first-step", "First Step", "👟", "Log your very first day", active >= 1],
    ["week-one", "Week One", "📅", "Stay active for 7 days", active >= 7],
    ["streak-3", "Warming Up", "🔥", "3-day streak", streak >= 3],
    ["streak-7", "On Fire", "🔥", "7-day streak", streak >= 7],
    ["streak-30", "Unstoppable", "⚡", "30-day streak", streak >= 30],
    ["perfect-1", "Flawless", "💎", "Complete every habit in a day", perfect >= 1],
    ["perfect-10", "Machine", "🤖", "10 perfect days", perfect >= 10],
    ["leet-25", "Grinder", "💻", "Solve 25 problems", solved >= 25],
    ["leet-100", "Century", "🏆", "Solve 100 problems", solved >= 100],
    ["xp-1000", "Four Digits", "✨", "Earn 1,000 XP", xp >= 1000],
    ["xp-5000", "Elite", "👑", "Earn 5,000 XP", xp >= 5000],
    ["half-way", "Halfway There", "🚩", "Reach day 45 of the challenge", active >= 45],
    ["finisher", "Finisher", "🎉", "Complete the 90-day challenge", active >= 90],
  ];
  return defs.map(([id, label, icon, desc, unlocked]) => ({ id, label, icon, desc, unlocked }));
}

export function habitXp(id: string): number {
  return HABIT_MAP[id]?.xp ?? 10;
}
