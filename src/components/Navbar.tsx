"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/dashboard", label: "Home", icon: "🏠" },
  { href: "/habits", label: "Habits", icon: "✅" },
  { href: "/books", label: "Learning", icon: "📚" },
  { href: "/analytics", label: "Stats", icon: "📈" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
];

export default function Navbar() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      {/* Desktop / tablet top bar */}
      <header className="sticky top-0 z-40 hidden border-b border-white/10 bg-slate-950/70 backdrop-blur-xl md:block">
        <nav className="mx-auto flex max-w-5xl items-center gap-1 px-6 py-3">
          <Link href="/dashboard" className="mr-6 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 text-sm font-black text-slate-950">
              AI
            </span>
            <span className="text-sm font-bold tracking-tight text-white">Tracker</span>
          </Link>
          {TABS.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className={[
                "rounded-xl px-3.5 py-2 text-sm font-medium transition",
                isActive(t.href)
                  ? "bg-white/10 text-white"
                  : "text-white/55 hover:bg-white/5 hover:text-white",
              ].join(" ")}
            >
              <span className="mr-1.5">{t.icon}</span>
              {t.label}
            </Link>
          ))}
        </nav>
      </header>

      {/* Mobile bottom tab bar */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-slate-950/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden">
        <div className="flex">
          {TABS.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className={[
                "flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition",
                isActive(t.href) ? "text-cyan-300" : "text-white/45",
              ].join(" ")}
            >
              <span className="text-lg leading-none">{t.icon}</span>
              {t.label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
