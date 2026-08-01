"use client";

import { Point } from "@/lib/stats";
import { prettyDate, weekdayShort } from "@/lib/date";

export function BarChart({
  data,
  max,
  suffix = "%",
}: {
  data: Point[];
  max?: number;
  suffix?: string;
}) {
  const top = Math.max(max ?? 0, ...data.map((d) => d.value), 1);
  return (
    <div className="flex h-44 items-end gap-2">
      {data.map((d) => {
        const h = Math.max(2, (d.value / top) * 100);
        return (
          <div key={d.key} className="flex flex-1 flex-col items-center gap-2">
            <div className="relative flex w-full flex-1 items-end">
              <div
                title={`${prettyDate(d.key)} — ${d.value}${suffix}`}
                className="w-full rounded-t-lg bg-gradient-to-t from-indigo-600 to-cyan-400 transition-all duration-500"
                style={{ height: `${h}%` }}
              />
            </div>
            <span className="text-[10px] tabular-nums text-white/45">{weekdayShort(d.key)[0]}</span>
            <span className="-mt-1.5 text-[10px] tabular-nums text-white/70">{d.value}</span>
          </div>
        );
      })}
    </div>
  );
}

export function LineChart({
  data,
  suffix = "%",
  color = "#22d3ee",
  max,
}: {
  data: Point[];
  suffix?: string;
  color?: string;
  max?: number;
}) {
  const W = 600;
  const H = 180;
  const P = 10;
  const top = Math.max(max ?? 0, ...data.map((d) => d.value), 1);
  const step = data.length > 1 ? (W - P * 2) / (data.length - 1) : 0;
  const pts = data.map((d, i) => {
    const x = P + i * step;
    const y = H - P - (d.value / top) * (H - P * 2);
    return [x, y] as const;
  });
  const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${(P + (data.length - 1) * step).toFixed(1)},${H - P} L${P},${H - P} Z`;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-44 w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.45" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1={P}
            x2={W - P}
            y1={P + f * (H - P * 2)}
            y2={P + f * (H - P * 2)}
            stroke="white"
            strokeOpacity="0.07"
            strokeWidth="1"
          />
        ))}
        <path d={area} fill="url(#area-grad)" />
        <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {pts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2.5" fill={color}>
            <title>{`${prettyDate(data[i].key)} — ${data[i].value}${suffix}`}</title>
          </circle>
        ))}
      </svg>
      <div className="flex justify-between px-1 text-[10px] text-white/40">
        <span>{data.length ? prettyDate(data[0].key).split(",")[1] : ""}</span>
        <span>{data.length ? prettyDate(data[data.length - 1].key).split(",")[1] : ""}</span>
      </div>
    </div>
  );
}

export function HBars({
  rows,
}: {
  rows: { id: string; label: string; icon: string; pct: number; hits: number }[];
}) {
  return (
    <div className="space-y-2.5">
      {rows.map((r) => (
        <div key={r.id} className="flex items-center gap-3">
          <span className="w-6 text-center text-sm">{r.icon}</span>
          <span className="w-32 shrink-0 truncate text-xs text-white/70">{r.label}</span>
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/10">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                r.pct >= 70
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-300"
                  : r.pct >= 40
                    ? "bg-gradient-to-r from-amber-500 to-amber-300"
                    : "bg-gradient-to-r from-rose-600 to-rose-400"
              }`}
              style={{ width: `${Math.max(r.pct, 1.5)}%` }}
            />
          </div>
          <span className="w-10 shrink-0 text-right text-xs tabular-nums text-white/60">{r.pct}%</span>
        </div>
      ))}
    </div>
  );
}

export function Donut({
  slices,
  centerLabel,
  centerSub,
}: {
  slices: { label: string; value: number; color: string }[];
  centerLabel: string;
  centerSub?: string;
}) {
  const total = slices.reduce((a, s) => a + s.value, 0);
  const size = 160;
  const stroke = 18;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  let acc = 0;

  return (
    <div className="flex flex-wrap items-center gap-6">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
          {total > 0 &&
            slices.map((s) => {
              const frac = s.value / total;
              const dash = frac * c;
              const el = (
                <circle
                  key={s.label}
                  cx={size / 2}
                  cy={size / 2}
                  r={r}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={stroke}
                  strokeDasharray={`${dash} ${c - dash}`}
                  strokeDashoffset={-acc}
                />
              );
              acc += dash;
              return el;
            })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white">{centerLabel}</span>
          {centerSub && <span className="text-[10px] uppercase tracking-widest text-white/45">{centerSub}</span>}
        </div>
      </div>
      <div className="space-y-2">
        {slices.map((s) => (
          <div key={s.label} className="flex items-center gap-2 text-sm">
            <span className="h-3 w-3 rounded-full" style={{ background: s.color }} />
            <span className="text-white/70">{s.label}</span>
            <span className="tabular-nums font-semibold text-white">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
