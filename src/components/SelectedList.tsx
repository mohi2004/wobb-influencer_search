import { useState } from "react";
import { useListStore } from "../store/useListStore";
import { formatFollowers } from "@/utils/formatters";
import type { UserProfileSummary } from "@/types";

export function SelectedList() {
  const [isOpen, setIsOpen] = useState(false);
  const { profiles, removeProfile } = useListStore();

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 md:left-auto md:right-4 md:transform-none z-40 flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2.5 font-bold text-white shadow-lg shadow-[var(--accent-glow)] transition-all hover:bg-[var(--accent-strong)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-strong)]"
        aria-label={`Open selected list with ${profiles.length} ${profiles.length === 1 ? 'item' : 'items'}`}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <span>List ({profiles.length})</span>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity animate-fade-in"
          onClick={() => setIsOpen(false)}
          role="button"
          aria-label="Close selected list"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Escape' && setIsOpen(false)}
        />
      )}

      {/* Panel: bottom-sheet on mobile, right-sidebar on desktop */}
      <div
        className={`fixed z-50 transform transition-transform duration-300 ease-in-out flex flex-col bg-[var(--surface)] shadow-2xl border-[var(--border)] ${
          // mobile: full width bottom sheet; desktop (md+): right sidebar
          "left-0 bottom-0 w-full max-h-[80vh] rounded-t-2xl border-t md:top-0 md:right-0 md:left-auto md:h-full md:w-full md:max-w-sm md:rounded-none md:border-t-0 md:border-l"
        } ${isOpen ? "translate-y-0 md:translate-x-0" : "translate-y-full md:translate-x-full"}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="selected-list-title"
      >
        <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface-alt)] p-6">
          <h2 id="selected-list-title" className="flex items-center gap-2 text-xl font-bold text-[var(--text-h)]">
            Your List
            <span className="rounded-full bg-[var(--accent)] px-2 py-0.5 text-xs text-white" aria-label={`${profiles.length} profiles in list`}>{profiles.length}</span>
          </h2>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close selected list"
            className="p-1 text-gray-400 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {profiles.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center space-y-4 text-center text-[var(--subtle)]">
              <svg className="h-16 w-16 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p>No profiles added yet.</p>
            </div>
          ) : (
            profiles.map((profile: UserProfileSummary) => {
              const displayName = profile.username ?? profile.handle ?? profile.user_id;
              return (
                <div key={profile.user_id} className="group relative flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] p-4">
                  <div className="relative h-12 w-12 flex-shrink-0">
                    <img
                      src={profile.picture}
                      alt={`Profile picture of ${displayName}`}
                      className="h-12 w-12 rounded-full border border-[var(--border)] object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        if (e.currentTarget.nextElementSibling) {
                          (e.currentTarget.nextElementSibling as HTMLElement).style.display = "flex";
                        }
                      }}
                    />
                    <div
                      className="hidden h-12 w-12 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)]"
                    >
                      <svg className="h-6 w-6 text-[var(--subtle)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-[var(--text-h)]">@{displayName}</p>
                    <p className="truncate text-xs text-[var(--subtle)]">{formatFollowers(profile.followers)} followers</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeProfile(profile.user_id)}
                    className="rounded-lg bg-[var(--surface)] p-2 text-[var(--subtle)] transition-colors hover:bg-[var(--danger-soft)] hover:text-[var(--danger)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--danger)]"
                    aria-label={`Remove @${displayName} from list`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
