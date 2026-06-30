import { Link } from "react-router-dom";
import type { Platform, UserProfileSummary } from "@/types";
import { VerifiedBadge } from "./VerifiedBadge";
import { formatFollowers, formatEngagementRate } from "@/utils/formatters";
import { useListStore } from "../store/useListStore";
import { toast } from "sonner";

interface ProfileCardProps {
  profile: UserProfileSummary;
  platform: Platform;
  searchQuery: string;
  onProfileClick?: (username: string) => void;
}

const platformColors: Record<Platform, string> = {
  instagram: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  youtube: "bg-red-500/20 text-red-400 border-red-500/30",
  tiktok: "bg-teal-500/20 text-teal-400 border-teal-500/30",
};

export function ProfileCard({
  profile,
  platform,
  searchQuery,
  onProfileClick,
}: ProfileCardProps) {
  const { addProfile, isAdded } = useListStore();
  const displayName = profile.username ?? profile.handle ?? profile.user_id;
  const added = isAdded(profile.user_id);
  const profileKey = profile.username ?? profile.handle ?? profile.user_id;

  const handleCardClick = () => {
    if (onProfileClick) onProfileClick(profile.username ?? profileKey);
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (added) {
      toast.error("Already in your list!");
    } else {
      const created = addProfile(profile);
      if (created) {
        toast.success("Added to list!");
      } else {
        toast.error("Already in your list!");
      }
    }
  };

  return (
    <div
      className="group relative flex w-full flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-[var(--shadow)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_30px_-20px_var(--accent-glow)] animate-fade-in"
      data-search={searchQuery}
      role="article"
      aria-label={`${displayName} on ${platform} - ${formatFollowers(profile.followers)} followers`}
    >
      <Link to={`/profile/${profileKey}?platform=${platform}`} onClick={handleCardClick} className="block">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-2.5">
          <div className="relative h-12 w-12 flex-shrink-0">
            <img
              src={profile.picture}
              alt={`Profile picture of ${displayName}`}
              className="h-12 w-12 rounded-full border-2 border-[var(--border)] object-cover transition-colors duration-200 group-hover:border-[var(--accent)]"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                if (e.currentTarget.nextElementSibling) {
                  (e.currentTarget.nextElementSibling as HTMLElement).style.display = "flex";
                }
              }}
            />
            <div
              className="hidden h-12 w-12 items-center justify-center rounded-full border-2 border-[var(--border)] bg-[var(--surface-alt)] transition-colors duration-200 group-hover:border-[var(--accent)]"
              style={{ display: "none" }}
            >
              <svg className="h-6 w-6 text-[var(--subtle)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <div className="min-w-0 flex-1 text-center md:text-left">
            <div className="mb-1 flex flex-wrap items-center justify-center md:justify-start gap-1.5">
              <h3 className="truncate text-sm font-semibold text-[var(--text-h)] text-center md:text-left">
                @{displayName}
              </h3>
              <VerifiedBadge verified={profile.is_verified} />
              <span
                className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.24em] ${platformColors[platform]}`}
              >
                {platform}
              </span>
            </div>
            <p className="mb-1 truncate text-xs text-[var(--subtle)] text-center md:text-left">
              {profile.fullname}
            </p>

            <div className="flex flex-wrap gap-2 text-[11px] justify-center md:justify-start">
              <div className="rounded-full border border-[var(--border)] bg-[var(--surface-alt)] px-2 py-1 font-semibold text-[var(--text-h)]">
                {formatFollowers(profile.followers)} followers
              </div>
              {profile.engagement_rate !== undefined && (
                <div className="rounded-full border border-[var(--border)] bg-[var(--surface-alt)] px-2 py-1 font-semibold text-[var(--text-h)]">
                  {formatEngagementRate(profile.engagement_rate)} eng.
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>

      <div className="mt-3 flex justify-center md:justify-end">
        <button
          type="button"
          onClick={handleAdd}
          aria-label={added ? `${displayName} is already in your list` : `Add ${displayName} to your list`}
          aria-pressed={added}
          disabled={added}
          className={`w-full md:w-auto flex items-center justify-center gap-2 rounded-2xl border px-3 py-1 text-[11px] font-semibold transition-all duration-200 ${
            added
              ? "border-[var(--success)]/30 bg-[var(--success-soft)] text-[var(--success)]"
              : "border-[var(--accent)]/20 bg-[var(--surface-alt)] text-[var(--accent)] hover:bg-[var(--accent-soft)]"
          }`}
        >
          {added ? (
            <>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Added
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add to List
            </>
          )}
        </button>
      </div>
    </div>
  );
}
