import { Link } from "react-router-dom";
import { useEffect, useState, type ReactNode } from "react";
import { SelectedList } from "./SelectedList";
import { Toaster } from "sonner";

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export function Layout({ children, title }: LayoutProps) {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";
    const stored = window.localStorage.getItem("theme") as "light" | "dark" | null;
    if (stored) return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-200">
      <Toaster theme={theme === "dark" ? "dark" : "light"} position="top-center" />
      <SelectedList />

      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--surface-elevated)]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Link to="/" className="inline-flex items-center gap-3 text-base font-black tracking-tight text-[var(--text)]">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent-glow)] transition-transform duration-200 hover:scale-105">
                <span className="text-lg leading-none">W</span>
              </div>
              Wobb
            </Link>
            <span className="hidden rounded-full border border-[var(--border)] bg-[var(--surface-alt)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-[var(--subtle)] md:inline-flex">
              Influencer Search
            </span>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="inline-flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface-alt)] px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]"
            >
              {theme === "dark" ? <span>☀</span> : <span>🌙</span>}
              {theme === "dark" ? "Light" : "Dark"}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {title && <h1 className="mb-6 text-4xl font-bold tracking-tight text-[var(--text)]">{title}</h1>}
        {children}
      </main>
    </div>
  );
}
