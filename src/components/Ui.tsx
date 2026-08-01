import React from "react";

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/20 backdrop-blur-sm ${className}`}
    >
      {children}
    </section>
  );
}

export function CardTitle({
  title,
  sub,
  right,
}: {
  title: string;
  sub?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-white/80">{title}</h2>
        {sub && <p className="mt-0.5 text-xs text-white/40">{sub}</p>}
      </div>
      {right}
    </div>
  );
}

export function StatCard({
  icon,
  value,
  label,
  accent = "from-indigo-500/20 to-cyan-500/10",
}: {
  icon: string;
  value: React.ReactNode;
  label: string;
  accent?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-gradient-to-br ${accent} p-4 backdrop-blur-sm`}
    >
      <div className="text-xl">{icon}</div>
      <div className="mt-1.5 text-2xl font-bold tabular-nums leading-none text-white">{value}</div>
      <div className="mt-1 text-[11px] uppercase tracking-wider text-white/45">{label}</div>
    </div>
  );
}
