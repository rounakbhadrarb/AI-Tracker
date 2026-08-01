export type HabitCategory = "Body" | "Mind";

export interface HabitDef {
  id: string;
  label: string;
  icon: string;
  category: HabitCategory;
  xp: number;
  hint: string;
}

export const HABITS: HabitDef[] = [
  { id: "gym", label: "Gym", icon: "🏋️", category: "Body", xp: 15, hint: "Strength session" },
  { id: "running", label: "Running", icon: "🏃", category: "Body", xp: 15, hint: "Cardio / 5K" },
  { id: "food", label: "Healthy Food", icon: "🥗", category: "Body", xp: 10, hint: "No junk today" },
  { id: "water", label: "Water", icon: "💧", category: "Body", xp: 5, hint: "3L+" },
  { id: "sleep", label: "Sleep", icon: "😴", category: "Body", xp: 10, hint: "7-8 hours" },
  { id: "coursera", label: "Coursera DSA", icon: "🎓", category: "Mind", xp: 15, hint: "1 lecture + quiz" },
  { id: "leetcode", label: "LeetCode", icon: "💻", category: "Mind", xp: 20, hint: "2+ problems" },
  { id: "aiagents", label: "AI Agents Book", icon: "🤖", category: "Mind", xp: 10, hint: "20 pages" },
  { id: "mlsystems", label: "ML Systems Book", icon: "📘", category: "Mind", xp: 10, hint: "20 pages" },
  { id: "systemdesign", label: "System Design", icon: "🏗️", category: "Mind", xp: 15, hint: "1 design case" },
  { id: "testarch", label: "Test Architecture", icon: "🧪", category: "Mind", xp: 10, hint: "Framework work" },
  { id: "java", label: "Java", icon: "☕", category: "Mind", xp: 10, hint: "Core / concurrency" },
  { id: "aiml", label: "AI / ML", icon: "🧠", category: "Mind", xp: 15, hint: "Paper or hands-on" },
  { id: "revision", label: "Revision", icon: "🔁", category: "Mind", xp: 10, hint: "Revisit old notes" },
];

export const HABIT_IDS = HABITS.map((h) => h.id);

export const HABIT_MAP: Record<string, HabitDef> = Object.fromEntries(
  HABITS.map((h) => [h.id, h]),
);

export const QUOTES: string[] = [
  "Discipline is choosing between what you want now and what you want most.",
  "You do not rise to the level of your goals. You fall to the level of your systems.",
  "Small daily improvements are the key to staggering long-term results.",
  "The pain of discipline weighs ounces. The pain of regret weighs tons.",
  "Consistency compounds. Motivation evaporates.",
  "Do the hard thing while it is easy.",
  "One more rep. One more problem. One more page.",
  "You will never always be motivated. You must learn to be disciplined.",
  "Show up on the days you do not feel like it. That is the whole game.",
  "Amateurs wait for inspiration. Professionals get to work.",
  "Suffer the pain of discipline or suffer the pain of regret.",
  "Every day you win is a vote for the person you are becoming.",
  "It is not about being the best. It is about being better than yesterday.",
  "Slow progress is still progress. Zero is the only failure.",
  "The obstacle is the way.",
];

export function quoteForDay(dayIndex: number): string {
  return QUOTES[Math.abs(dayIndex) % QUOTES.length];
}
