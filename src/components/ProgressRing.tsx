"use client";

interface Props {
  value: number;
  size?: number;
  stroke?: number;
  label?: string;
  sub?: string;
  from?: string;
  to?: string;
  gradientId?: string;
}

export default function ProgressRing({
  value,
  size = 200,
  stroke = 14,
  label,
  sub,
  from = "#6366f1",
  to = "#22d3ee",
  gradientId = "ring-grad",
}: Props) {
  const clamped = Math.max(0, Math.min(100, value));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (clamped / 100) * c;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          className="text-white/10"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 700ms cubic-bezier(0.4,0,0.2,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold tracking-tight text-white">{label ?? `${clamped}%`}</span>
        {sub && <span className="mt-1 text-xs uppercase tracking-widest text-white/50">{sub}</span>}
      </div>
    </div>
  );
}
