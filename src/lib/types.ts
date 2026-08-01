export interface LeetCount {
  easy: number;
  medium: number;
  hard: number;
}

export interface DayRecord {
  habits: Record<string, boolean>;
  leetcode: LeetCount;
  note?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  totalPages: number;
  currentPage: number;
  color: string;
}

export interface DsaTopic {
  id: string;
  name: string;
  total: number;
  done: number;
}

export interface Note {
  id: string;
  title: string;
  body: string;
  createdAt: string;
}

export interface Settings {
  name: string;
  startDate: string;
  goalDays: number;
  dailyTargetPct: number;
}

export interface AppState {
  version: number;
  settings: Settings;
  days: Record<string, DayRecord>;
  books: Book[];
  dsa: DsaTopic[];
  notes: Note[];
}
