"use client";

import { useRef, useState } from "react";
import { Card, CardTitle } from "@/components/Ui";
import { useStore } from "@/lib/store";
import { todayKey } from "@/lib/date";

export default function SettingsPage() {
  const { state, hydrated, updateSettings, exportState, importState, resetAll } = useStore();
  const [msg, setMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  if (!hydrated) return <div className="h-96 animate-pulse rounded-3xl bg-white/5" />;

  const flash = (m: string) => {
    setMsg(m);
    setTimeout(() => setMsg(""), 2500);
  };

  const download = () => {
    const blob = new Blob([exportState()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai-tracker-backup-${todayKey()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    flash("Backup downloaded ✅");
  };

  const upload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const ok = importState(String(reader.result));
      flash(ok ? "Data restored ✅" : "That file could not be read ❌");
    };
    reader.readAsText(file);
  };

  return (
    <div className="animate-fade-up space-y-5">
      <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">Settings</h1>

      {msg && (
        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
          {msg}
        </div>
      )}

      <Card>
        <CardTitle title="Profile & challenge" />
        <div className="space-y-4">
          <Field label="Your name">
            <input
              value={state.settings.name}
              onChange={(e) => updateSettings({ name: e.target.value })}
              placeholder="Rounak"
              className="input"
            />
          </Field>
          <Field label="Challenge start date">
            <input
              type="date"
              value={state.settings.startDate}
              onChange={(e) => updateSettings({ startDate: e.target.value || todayKey() })}
              className="input"
            />
          </Field>
          <Field label="Challenge length (days)">
            <input
              type="number"
              min={7}
              max={365}
              value={state.settings.goalDays}
              onChange={(e) => updateSettings({ goalDays: Math.max(7, Number(e.target.value) || 90) })}
              className="input"
            />
          </Field>
          <Field label={`Daily target — a day counts for your streak at ${state.settings.dailyTargetPct}%`}>
            <input
              type="range"
              min={10}
              max={100}
              step={5}
              value={state.settings.dailyTargetPct}
              onChange={(e) => updateSettings({ dailyTargetPct: Number(e.target.value) })}
              className="w-full accent-cyan-400"
            />
          </Field>
        </div>
      </Card>

      <Card>
        <CardTitle title="Data" sub="Everything is stored locally on this device" />
        <div className="flex flex-wrap gap-2">
          <button onClick={download} className="btn-primary">
            Export backup
          </button>
          <button onClick={() => fileRef.current?.click()} className="btn-ghost">
            Import backup
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) upload(f);
              e.target.value = "";
            }}
          />
          <button
            onClick={() => {
              if (confirm("Delete all progress? This cannot be undone.")) {
                resetAll();
                flash("All data reset");
              }
            }}
            className="btn-danger"
          >
            Reset everything
          </button>
        </div>
        <p className="mt-3 text-xs text-white/40">
          {Object.keys(state.days).length} days logged · {state.books.length} books · {state.dsa.length} DSA topics ·{" "}
          {state.notes.length} notes
        </p>
      </Card>

      <Card>
        <CardTitle title="📱 Install on iPhone" sub="Makes it behave like a native app" />
        <ol className="space-y-2 text-sm text-white/70">
          <li>1. Open this URL in <strong className="text-white">Safari</strong> on your iPhone (same Wi-Fi as your computer).</li>
          <li>2. Tap the <strong className="text-white">Share</strong> button.</li>
          <li>3. Choose <strong className="text-white">Add to Home Screen</strong>.</li>
          <li>4. Launch it from the home screen — full screen, no browser bars, works offline.</li>
        </ol>
        <p className="mt-3 text-xs text-white/40">
          Tip: data lives in this browser only. Export a backup before switching devices.
        </p>
      </Card>

      <style jsx global>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
          padding: 0.6rem 0.85rem;
          color: white;
          outline: none;
        }
        .input:focus {
          border-color: rgba(34, 211, 238, 0.5);
        }
        .btn-primary,
        .btn-ghost,
        .btn-danger {
          border-radius: 0.75rem;
          padding: 0.6rem 1.1rem;
          font-size: 0.875rem;
          font-weight: 600;
          transition: all 150ms;
        }
        .btn-primary {
          background: linear-gradient(to right, #6366f1, #06b6d4);
          color: white;
        }
        .btn-ghost {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }
        .btn-danger {
          background: rgba(244, 63, 94, 0.15);
          color: #fda4af;
          border: 1px solid rgba(244, 63, 94, 0.3);
        }
        .btn-primary:active,
        .btn-ghost:active,
        .btn-danger:active {
          transform: scale(0.97);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-wider text-white/45">{label}</span>
      {children}
    </label>
  );
}
