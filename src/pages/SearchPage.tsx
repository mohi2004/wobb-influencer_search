import { useState, useEffect, useMemo, useCallback } from "react";
import type { Platform } from "@/types";
import { Layout } from "@/components/Layout";
import { PlatformFilter } from "@/components/PlatformFilter";
import { ProfileList } from "@/components/ProfileList";
import { extractProfiles, filterProfiles } from "@/utils/dataHelpers";
import { useSearchStore } from "@/store/useSearchStore";
import { useDebounce } from "@/hooks/useDebounce";

export function SearchPage() {
  const { platform, searchQuery, profilesCache, setPlatform, setSearchQuery, setCache } = useSearchStore();

  const [draftQuery, setDraftQuery] = useState(searchQuery);
  const debouncedQuery = useDebounce(draftQuery, 250);

  const profiles = useMemo(() => profilesCache[platform] || [], [platform, profilesCache]);
  const isLoading = !profiles.length;

  useEffect(() => {
    if (profiles.length) {
      return;
    }

    let isMounted = true;
    extractProfiles(platform)
      .then((data) => {
        if (isMounted) {
          setCache(platform, data);
        }
      })
      .catch(() => {
        // Silently handle errors - data will remain empty and user sees loading state
      });
    return () => {
      isMounted = false;
    };
  }, [platform, profiles.length, setCache]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSearchQuery(debouncedQuery);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [debouncedQuery, setSearchQuery]);

  const handlePlatformChange = useCallback((p: Platform) => {
    if (p !== platform) {
      setPlatform(p);
      setDraftQuery("");
      setSearchQuery("");
    }
  }, [platform, setPlatform, setSearchQuery]);

  const handleSearchChange = useCallback((q: string) => {
    setDraftQuery(q);
  }, []);

  const filtered = useMemo(() => filterProfiles(profiles, searchQuery), [profiles, searchQuery]);

  useEffect(() => {
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, []);

  return (
    <Layout>
      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)] h-[calc(100vh-120px)]">
        <aside className="space-y-6 xl:sticky xl:top-28 xl:self-start">
          <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg font-semibold text-[var(--text)]">Filters</h2>
                <p className="mt-1 text-sm text-[var(--subtle-strong)]">Refine by platform and search the influencer inventory.</p>
              </div>
              <div className="rounded-full bg-[var(--surface-alt)] px-3 py-1 text-xs font-semibold text-[var(--subtle)]">
                {profiles.length}
              </div>
            </div>
            <PlatformFilter
              selected={platform}
              onChange={handlePlatformChange}
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
            />
          </div>
        </aside>

        <section className="overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)] flex flex-col">
          <div className="flex flex-col gap-4 border-b border-[var(--border)] px-6 py-5 sm:flex-row sm:items-center sm:justify-between flex-shrink-0">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-[var(--subtle-strong)]">Influencers</p>
              <h3 className="mt-2 text-2xl font-semibold text-[var(--text)]">Browse creator profiles</h3>
            </div>
            <div className="inline-flex items-center gap-2 rounded-3xl border border-[var(--border)] bg-[var(--surface-alt)] px-3 py-2 text-xs font-semibold text-[var(--text)]">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
              {isLoading ? "Preparing results" : `Showing ${filtered.length} of ${profiles.length}`}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="h-36 rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-alt)] animate-pulse" />
                ))}
              </div>
            ) : (
              <ProfileList
                profiles={filtered}
                platform={platform}
                searchQuery={searchQuery}
              />
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}
