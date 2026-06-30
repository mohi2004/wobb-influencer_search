import { useState } from "react";
import type { Platform } from "@/types";
import { PLATFORMS, getPlatformLabel } from "@/utils/dataHelpers";

interface PlatformFilterProps {
  selected: Platform;
  onChange: (platform: Platform) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function PlatformFilter({
  selected,
  onChange,
  searchQuery,
  onSearchChange,
}: PlatformFilterProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
    onSearchChange(value);
  };

  return (
    <div className="mb-8 flex flex-col gap-4 rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]" role="region" aria-label="Platform filters">
      <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-[var(--surface-alt)] p-3">
        {PLATFORMS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            aria-label={`Filter by ${getPlatformLabel(p)}`}
            aria-pressed={selected === p ? "true" : "false"}
            className={`rounded-2xl px-5 py-3 text-sm font-semibold transition-all duration-200 whitespace-nowrap ${selected === p
                ? "bg-[var(--accent)] text-white shadow-[rgba(67,56,202,0.24)]"
                : "bg-[var(--bg)] text-[var(--text)] border border-[var(--border)] hover:bg-[var(--surface)]"
              }`}
          >
            {getPlatformLabel(p)}
          </button>
        ))}
      </div>
      <div className="relative w-full">
        <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--subtle-strong)] pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={localSearch}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search influencers"
          aria-label="Search for influencers by username"
          className="w-full bg-[var(--bg)] border border-[var(--border)] px-5 py-4 pl-12 rounded-[1.5rem] text-sm text-[var(--text)] shadow-sm focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent-soft)] transition placeholder:[var(--subtle-strong)]"
        />
      </div>
    </div>
  );
}
