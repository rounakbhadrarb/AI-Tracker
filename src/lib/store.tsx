"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AppState, Book, DayRecord, DsaTopic, Note, Settings } from "./types";
import { todayKey } from "./date";
import { EMPTY_DAY } from "./stats";

const STORAGE_KEY = "ai-tracker-state-v1";
const VERSION = 1;

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function defaultState(): AppState {
  return {
    version: VERSION,
    settings: {
      name: "",
      startDate: todayKey(),
      goalDays: 90,
      dailyTargetPct: 70,
    },
    days: {},
    books: [
      {
        id: uid(),
        title: "AI Engineering / AI Agents",
        author: "Chip Huyen",
        totalPages: 420,
        currentPage: 0,
        color: "#8b5cf6",
      },
      {
        id: uid(),
        title: "Designing Machine Learning Systems",
        author: "Chip Huyen",
        totalPages: 386,
        currentPage: 0,
        color: "#06b6d4",
      },
      {
        id: uid(),
        title: "Designing Data-Intensive Applications",
        author: "Martin Kleppmann",
        totalPages: 590,
        currentPage: 0,
        color: "#f59e0b",
      },
    ],
    dsa: [
      { id: uid(), name: "Arrays & Hashing", total: 20, done: 0 },
      { id: uid(), name: "Two Pointers", total: 12, done: 0 },
      { id: uid(), name: "Sliding Window", total: 10, done: 0 },
      { id: uid(), name: "Stack & Queue", total: 12, done: 0 },
      { id: uid(), name: "Binary Search", total: 12, done: 0 },
      { id: uid(), name: "Linked List", total: 14, done: 0 },
      { id: uid(), name: "Trees & BST", total: 20, done: 0 },
      { id: uid(), name: "Tries", total: 6, done: 0 },
      { id: uid(), name: "Heap / Priority Queue", total: 8, done: 0 },
      { id: uid(), name: "Backtracking", total: 10, done: 0 },
      { id: uid(), name: "Graphs", total: 18, done: 0 },
      { id: uid(), name: "Dynamic Programming", total: 24, done: 0 },
      { id: uid(), name: "Greedy", total: 10, done: 0 },
      { id: uid(), name: "Intervals", total: 8, done: 0 },
      { id: uid(), name: "Bit Manipulation", total: 8, done: 0 },
    ],
    notes: [],
  };
}

function migrate(raw: unknown): AppState {
  const base = defaultState();
  if (!raw || typeof raw !== "object") return base;
  const parsed = raw as Partial<AppState>;
  return {
    version: VERSION,
    settings: { ...base.settings, ...(parsed.settings ?? {}) },
    days: parsed.days ?? {},
    books: parsed.books ?? base.books,
    dsa: parsed.dsa ?? base.dsa,
    notes: parsed.notes ?? [],
  };
}

interface StoreValue {
  state: AppState;
  hydrated: boolean;
  toggleHabit: (dateKey: string, habitId: string) => void;
  setAllHabits: (dateKey: string, value: boolean) => void;
  setLeet: (dateKey: string, level: keyof DayRecord["leetcode"], value: number) => void;
  setNote: (dateKey: string, note: string) => void;
  addBook: (b: Omit<Book, "id">) => void;
  updateBook: (id: string, patch: Partial<Book>) => void;
  removeBook: (id: string) => void;
  addTopic: (name: string, total: number) => void;
  updateTopic: (id: string, patch: Partial<DsaTopic>) => void;
  removeTopic: (id: string) => void;
  addNote: (title: string, body: string) => void;
  removeNote: (id: string) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  importState: (json: string) => boolean;
  exportState: () => string;
  resetAll: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);
  const [hydrated, setHydrated] = useState(false);
  const ready = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState(migrate(JSON.parse(raw)));
    } catch {
      /* corrupt storage -> keep defaults */
    }
    ready.current = true;
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!ready.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* quota exceeded - ignore */
    }
  }, [state]);

  const mutateDay = useCallback(
    (dateKey: string, fn: (d: DayRecord) => DayRecord) => {
      setState((s) => {
        const current = s.days[dateKey] ?? { ...EMPTY_DAY, habits: {}, leetcode: { easy: 0, medium: 0, hard: 0 } };
        return { ...s, days: { ...s.days, [dateKey]: fn(current) } };
      });
    },
    [],
  );

  const value = useMemo<StoreValue>(() => {
    return {
      state,
      hydrated,
      toggleHabit: (dateKey, habitId) =>
        mutateDay(dateKey, (d) => ({
          ...d,
          habits: { ...d.habits, [habitId]: !d.habits[habitId] },
        })),
      setAllHabits: (dateKey, val) =>
        mutateDay(dateKey, (d) => {
          const habits: Record<string, boolean> = {};
          for (const id of Object.keys(d.habits)) habits[id] = val;
          return { ...d, habits: val ? habits : {} };
        }),
      setLeet: (dateKey, level, val) =>
        mutateDay(dateKey, (d) => ({
          ...d,
          leetcode: { ...d.leetcode, [level]: Math.max(0, val) },
        })),
      setNote: (dateKey, note) => mutateDay(dateKey, (d) => ({ ...d, note })),
      addBook: (b) => setState((s) => ({ ...s, books: [...s.books, { ...b, id: uid() }] })),
      updateBook: (id, patch) =>
        setState((s) => ({
          ...s,
          books: s.books.map((b) => (b.id === id ? { ...b, ...patch } : b)),
        })),
      removeBook: (id) => setState((s) => ({ ...s, books: s.books.filter((b) => b.id !== id) })),
      addTopic: (name, total) =>
        setState((s) => ({ ...s, dsa: [...s.dsa, { id: uid(), name, total, done: 0 }] })),
      updateTopic: (id, patch) =>
        setState((s) => ({
          ...s,
          dsa: s.dsa.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        })),
      removeTopic: (id) => setState((s) => ({ ...s, dsa: s.dsa.filter((t) => t.id !== id) })),
      addNote: (title, body) =>
        setState((s) => ({
          ...s,
          notes: [
            { id: uid(), title, body, createdAt: new Date().toISOString() } as Note,
            ...s.notes,
          ],
        })),
      removeNote: (id) => setState((s) => ({ ...s, notes: s.notes.filter((n) => n.id !== id) })),
      updateSettings: (patch) =>
        setState((s) => ({ ...s, settings: { ...s.settings, ...patch } })),
      exportState: () => JSON.stringify(state, null, 2),
      importState: (json) => {
        try {
          setState(migrate(JSON.parse(json)));
          return true;
        } catch {
          return false;
        }
      },
      resetAll: () => setState(defaultState()),
    };
  }, [state, hydrated, mutateDay]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}

export { STORAGE_KEY };
