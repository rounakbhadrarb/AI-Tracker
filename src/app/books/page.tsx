"use client";

import { useState } from "react";
import { Card, CardTitle } from "@/components/Ui";
import { Donut } from "@/components/Charts";
import { useStore } from "@/lib/store";
import { bookProgress, dsaProgress, solvedBreakdown, totalSolved } from "@/lib/stats";

const COLORS = ["#8b5cf6", "#06b6d4", "#f59e0b", "#ec4899", "#10b981", "#f43f5e"];

export default function LearningPage() {
  const {
    state,
    hydrated,
    addBook,
    updateBook,
    removeBook,
    addTopic,
    updateTopic,
    removeTopic,
    addNote,
    removeNote,
  } = useStore();

  const [newBook, setNewBook] = useState({ title: "", author: "", totalPages: 300 });
  const [newTopic, setNewTopic] = useState({ name: "", total: 10 });
  const [note, setNote] = useState({ title: "", body: "" });

  if (!hydrated) return <div className="h-96 animate-pulse rounded-3xl bg-white/5" />;

  const split = solvedBreakdown(state);

  return (
    <div className="animate-fade-up space-y-5">
      <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">Learning</h1>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardTitle title="📚 Books" sub={`${bookProgress(state)}% of all pages read`} />
          <div className="space-y-3">
            {state.books.map((b) => {
              const pct = b.totalPages ? Math.min(100, Math.round((b.currentPage / b.totalPages) * 100)) : 0;
              return (
                <div key={b.id} className="rounded-2xl border border-white/10 bg-white/5 p-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">{b.title}</p>
                      <p className="truncate text-xs text-white/40">{b.author}</p>
                    </div>
                    <button
                      onClick={() => removeBook(b.id)}
                      className="shrink-0 rounded-lg px-2 py-1 text-xs text-white/35 transition hover:bg-rose-500/20 hover:text-rose-300"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, background: b.color }}
                    />
                  </div>
                  <div className="mt-2.5 flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      max={b.totalPages}
                      value={b.currentPage}
                      onChange={(e) => updateBook(b.id, { currentPage: Math.max(0, Number(e.target.value) || 0) })}
                      className="w-20 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-sm tabular-nums text-white outline-none focus:border-cyan-400/50"
                    />
                    <span className="text-xs text-white/40">/ {b.totalPages} pages</span>
                    <span className="ml-auto text-xs font-semibold tabular-nums text-white/70">{pct}%</span>
                    <button
                      onClick={() => updateBook(b.id, { currentPage: Math.min(b.totalPages, b.currentPage + 10) })}
                      className="rounded-lg bg-white/10 px-2 py-1 text-xs font-semibold text-white transition hover:bg-white/20 active:scale-95"
                    >
                      +10
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 space-y-2 rounded-2xl border border-dashed border-white/15 p-3">
            <input
              placeholder="Book title"
              value={newBook.title}
              onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-cyan-400/50"
            />
            <div className="flex gap-2">
              <input
                placeholder="Author"
                value={newBook.author}
                onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-cyan-400/50"
              />
              <input
                type="number"
                min={1}
                value={newBook.totalPages}
                onChange={(e) => setNewBook({ ...newBook, totalPages: Number(e.target.value) || 1 })}
                className="w-24 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm tabular-nums text-white outline-none focus:border-cyan-400/50"
              />
            </div>
            <button
              onClick={() => {
                if (!newBook.title.trim()) return;
                addBook({
                  ...newBook,
                  currentPage: 0,
                  color: COLORS[state.books.length % COLORS.length],
                });
                setNewBook({ title: "", author: "", totalPages: 300 });
              }}
              className="w-full rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-500 py-2 text-sm font-semibold text-white transition active:scale-[0.98]"
            >
              Add book
            </button>
          </div>
        </Card>

        <div className="space-y-5">
          <Card>
            <CardTitle title="💻 LeetCode" sub={`${totalSolved(state)} problems solved in total`} />
            <Donut
              centerLabel={`${totalSolved(state)}`}
              centerSub="solved"
              slices={[
                { label: "Easy", value: split.easy, color: "#10b981" },
                { label: "Medium", value: split.medium, color: "#f59e0b" },
                { label: "Hard", value: split.hard, color: "#f43f5e" },
              ]}
            />
            <p className="mt-4 text-xs text-white/40">
              Log problems on the Habits tab — they roll up here automatically.
            </p>
          </Card>

          <Card>
            <CardTitle title="🗺️ DSA roadmap" sub={`${dsaProgress(state)}% of the roadmap complete`} />
            <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
              {state.dsa.map((t) => {
                const pct = t.total ? Math.min(100, Math.round((t.done / t.total) * 100)) : 0;
                return (
                  <div key={t.id} className="rounded-xl border border-white/10 bg-white/5 p-2.5">
                    <div className="flex items-center gap-2">
                      <span className="min-w-0 flex-1 truncate text-xs font-medium text-white">{t.name}</span>
                      <span className="text-xs tabular-nums text-white/50">
                        {t.done}/{t.total}
                      </span>
                      <button
                        onClick={() => updateTopic(t.id, { done: Math.max(0, t.done - 1) })}
                        className="h-6 w-6 rounded-md bg-white/10 text-white transition hover:bg-white/20 active:scale-90"
                      >
                        −
                      </button>
                      <button
                        onClick={() => updateTopic(t.id, { done: Math.min(t.total, t.done + 1) })}
                        className="h-6 w-6 rounded-md bg-white/20 text-white transition hover:bg-white/30 active:scale-90"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeTopic(t.id)}
                        className="h-6 w-6 rounded-md text-white/30 transition hover:bg-rose-500/20 hover:text-rose-300"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 flex gap-2">
              <input
                placeholder="New topic"
                value={newTopic.name}
                onChange={(e) => setNewTopic({ ...newTopic, name: e.target.value })}
                className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-cyan-400/50"
              />
              <input
                type="number"
                min={1}
                value={newTopic.total}
                onChange={(e) => setNewTopic({ ...newTopic, total: Number(e.target.value) || 1 })}
                className="w-20 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm tabular-nums text-white outline-none focus:border-cyan-400/50"
              />
              <button
                onClick={() => {
                  if (!newTopic.name.trim()) return;
                  addTopic(newTopic.name.trim(), newTopic.total);
                  setNewTopic({ name: "", total: 10 });
                }}
                className="rounded-lg bg-white/15 px-3 text-sm font-semibold text-white transition hover:bg-white/25 active:scale-95"
              >
                Add
              </button>
            </div>
          </Card>
        </div>
      </div>

      <Card>
        <CardTitle title="🗒️ Notes" sub={`${state.notes.length} saved`} />
        <div className="space-y-2 rounded-2xl border border-dashed border-white/15 p-3">
          <input
            placeholder="Note title"
            value={note.title}
            onChange={(e) => setNote({ ...note, title: e.target.value })}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-cyan-400/50"
          />
          <textarea
            placeholder="Write something you want to remember…"
            rows={3}
            value={note.body}
            onChange={(e) => setNote({ ...note, body: e.target.value })}
            className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-cyan-400/50"
          />
          <button
            onClick={() => {
              if (!note.title.trim() && !note.body.trim()) return;
              addNote(note.title.trim() || "Untitled", note.body.trim());
              setNote({ title: "", body: "" });
            }}
            className="w-full rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 py-2 text-sm font-semibold text-white transition active:scale-[0.98]"
          >
            Save note
          </button>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {state.notes.map((n) => (
            <div key={n.id} className="rounded-2xl border border-white/10 bg-white/5 p-3.5">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-white">{n.title}</p>
                <button
                  onClick={() => removeNote(n.id)}
                  className="shrink-0 rounded-lg px-2 text-xs text-white/35 transition hover:bg-rose-500/20 hover:text-rose-300"
                >
                  ✕
                </button>
              </div>
              <p className="mt-1 whitespace-pre-wrap text-xs leading-relaxed text-white/60">{n.body}</p>
              <p className="mt-2 text-[10px] uppercase tracking-wider text-white/25">
                {new Date(n.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
