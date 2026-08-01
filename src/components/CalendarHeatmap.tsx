"use client";

import { Point } from "@/lib/stats";
import { fromKey, isFuture, monthShort, prettyDate } from "@/lib/date";

function shade(v: number, future: boolean): string {
  if (future) return "bg-white/[0.03]";
  if (v <= 0) return "bg-white/[0.06]";
  if (v < 25) return "bg-emerald-500/25";
  if (v < 50) return "bg-emerald-500/45";
  if (v < 75) return "bg-emerald-500/65";
  if (v < 100) return "bg-emerald-400/85";
  return "bg-emerald-300";
}

export default function CalendarHeatmap({ data }: { data: Point[] }) {
  if (!data.length) return null;

  // pad the front so the first column starts on Sunday
  const lead = fromKey(data[0].key).getDay();
  const cells: (Point | null)[] = [...Array<null>(lead).fill(null), ...data];
  const weeks: (Point | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  // show a month label only on the first column that starts a new month
  let lastMonth = "";
  const monthLabels = weeks.map((w) => {
    const first = w.find(Boolean);
    if (!first) return "";
    const m = monthShort(first.key);
    if (m === lastMonth) return "";
    lastMonth = m;
    return m;
  });

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="inline-flex flex-col gap-2">
        <div className="flex gap-[3px]">
          {weeks.map((_, i) => (
            <div key={i} className="w-[13px] text-[9px] leading-none text-white/35">
              {monthLabels[i]}
            </div>
          ))}
        </div>

        <div className="flex gap-[3px]">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {Array.from({ length: 7 }).map((_, di) => {
                const cell = week[di];
                if (!cell) return <div key={di} className="h-[13px] w-[13px]" />;
                const future = isFuture(cell.key);
                return (
                  <div
                    key={di}
                    title={`${prettyDate(cell.key)} — ${cell.value}%`}
                    className={`h-[13px] w-[13px] rounded-[3px] transition ${shade(cell.value, future)}`}
                  />
                );
              })}
            </div>
          ))}
        </div>

        <div className="mt-1 flex items-center gap-1.5 text-[10px] text-white/40">
          <span>Less</span>
          <span className="h-[11px] w-[11px] rounded-[3px] bg-white/[0.06]" />
          <span className="h-[11px] w-[11px] rounded-[3px] bg-emerald-500/25" />
          <span className="h-[11px] w-[11px] rounded-[3px] bg-emerald-500/45" />
          <span className="h-[11px] w-[11px] rounded-[3px] bg-emerald-500/65" />
          <span className="h-[11px] w-[11px] rounded-[3px] bg-emerald-300" />
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
