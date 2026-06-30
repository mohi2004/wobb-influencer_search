import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import type { FullUserProfile, ProfileDetailResponse } from "@/types";
import { formatFollowers, formatEngagementRate } from "@/utils/formatters";
import { loadProfileByUsername } from "@/utils/profileLoader";
import { useListStore } from "../store/useListStore";
import { toast } from "sonner";
import { PLATFORMS } from "@/utils/dataHelpers";

function ProfileDetailContent({ username }: { username?: string }) {
  const [searchParams] = useSearchParams();
  const [profileData, setProfileData] = useState<ProfileDetailResponse | null>(null);
  const [loaded, setLoaded] = useState(false);
  const { addProfile, isAdded } = useListStore();
  const added = username ? isAdded(username) : false;

  useEffect(() => {
    if (!username) return;

    let isMounted = true;
    loadProfileByUsername(username)
      .then((data) => {
        if (!isMounted) return;
        setProfileData(data);
        setLoaded(true);
      })
      .catch(() => {
        if (isMounted) setLoaded(true);
      });

    return () => {
      isMounted = false;
    };
  }, [username]);

  if (!loaded) {
    return (
      <Layout>
        <div className="animate-pulse mx-auto mt-8 flex max-w-5xl flex-col gap-8">
          <div className="h-64 rounded-3xl border border-[var(--border)] bg-[var(--surface)]" />
          <div className="h-40 rounded-3xl border border-[var(--border)] bg-[var(--surface)]" />
        </div>
      </Layout>
    );
  }

  if (!profileData || !profileData.data?.user_profile) {
    return (
      <Layout>
        <div className="py-32 text-center">
          <p className="mb-4 text-xl font-medium text-[var(--danger)]">Could not load profile details for @{username}</p>
          <Link to="/" className="inline-flex items-center gap-2 font-semibold text-[var(--accent)] hover:text-[var(--accent-strong)]">
            <span>&larr;</span> Back to search
          </Link>
        </div>
      </Layout>
    );
  }

  const user: FullUserProfile = profileData.data.user_profile;

  const handleAdd = () => {
    if (added) {
      toast.error("Already in your list!");
    } else {
      const created = addProfile(user);
      if (created) {
        toast.success("Added to list!");
      } else {
        toast.error("Already in your list!");
      }
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto pb-16">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--subtle)] transition-colors hover:text-[var(--accent)]">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to search
        </Link>

        {/* HERO SECTION */}
        <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)]">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-transparent pointer-events-none" />
          
          <div className="px-6 md:px-10 py-10 relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div className="relative flex-shrink-0">
              <img
                src={user.picture}
                alt={`Profile picture of ${user.username}`}
                className="flex-shrink-0 h-32 w-32 rounded-full border-4 border-[var(--border)] bg-[var(--bg)] object-cover shadow-2xl md:h-40 md:w-40"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  if (e.currentTarget.nextElementSibling) {
                    (e.currentTarget.nextElementSibling as HTMLElement).style.display = "flex";
                  }
                }}
              />
              <div
                className="hidden flex-shrink-0 h-32 w-32 md:h-40 md:w-40 items-center justify-center rounded-full border-4 border-[var(--border)] bg-[var(--bg)] shadow-2xl"
              >
                <svg className="h-16 w-16 md:h-20 md:w-20 text-[var(--subtle)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="truncate text-3xl font-black tracking-tight text-[var(--text-h)] md:text-4xl">
                  {user.fullname}
                </h1>
                <VerifiedBadge verified={user.is_verified} />
              </div>
              
              <div className="mb-4 flex flex-wrap items-center gap-4 text-sm font-medium text-[var(--subtle)] md:text-base">
                <span className="flex items-center gap-1.5 text-[var(--accent)]">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                  {user.username}
                </span>
                
                {user.geo?.country?.name && (
                  <>
                    <span className="h-1 w-1 rounded-full bg-[var(--subtle)]" />
                    <span className="flex items-center gap-1.5 text-[var(--text)]">
                      <svg className="h-4 w-4 text-[var(--subtle)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {user.geo.country.name}
                    </span>
                  </>
                )}
              </div>

              {user.description && (
                <p className="max-w-3xl whitespace-pre-wrap text-sm leading-relaxed text-[var(--text)] md:text-base">
                  {user.description}
                </p>
              )}
              
              {user.contacts && user.contacts.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-3">
                  {user.contacts.map(contact => (
                    <a
                      key={contact.type + contact.value}
                      href={contact.formatted_value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-lg bg-[var(--surface-alt)] px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--text)] transition-colors hover:bg-[var(--accent-soft)]"
                    >
                      {contact.type}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <div className="w-full md:w-auto flex-shrink-0">
              <button
                type="button"
                onClick={handleAdd}
                className={`flex w-full items-center justify-center gap-2 rounded-xl px-8 py-3 font-bold shadow-xl transition-all duration-200 md:w-auto ${
                  added 
                    ? "border border-[var(--success)]/30 bg-[var(--success-soft)] text-[var(--success)]" 
                    : "bg-[var(--accent)] text-white shadow-[var(--accent-glow)] hover:bg-[var(--accent-strong)]"
                }`}
              >
                {added ? (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Added to List
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Add to List
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)] transition-colors hover:border-[var(--accent)]/40">
            <div className="mb-2 text-sm font-semibold uppercase tracking-wider text-[var(--subtle)]">Followers</div>
            <div className="text-3xl font-black text-[var(--text-h)]">{formatFollowers(user.followers)}</div>
          </div>
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)] transition-colors hover:border-[var(--accent)]/40">
            <div className="mb-2 text-sm font-semibold uppercase tracking-wider text-[var(--subtle)]">Engagement Rate</div>
            <div className="bg-gradient-to-r from-[var(--accent)] to-[var(--success)] bg-clip-text text-3xl font-black text-transparent">
              {formatEngagementRate(user.engagement_rate)}
            </div>
          </div>
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)] transition-colors hover:border-[var(--accent)]/40">
            <div className="mb-2 text-sm font-semibold uppercase tracking-wider text-[var(--subtle)]">Total Likes</div>
            <div className="text-3xl font-black text-[var(--text-h)]">
              {user.total_likes ? formatFollowers(user.total_likes) : (user.avg_likes ? formatFollowers(user.avg_likes) : "-")}
            </div>
          </div>
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)] transition-colors hover:border-[var(--accent)]/40">
            <div className="mb-2 text-sm font-semibold uppercase tracking-wider text-[var(--subtle)]">Avg Views</div>
            <div className="text-3xl font-black text-[var(--text-h)]">
              {user.avg_views ? formatFollowers(user.avg_views) : "-"}
            </div>
          </div>
        </div>

        {/* TAGS & AUDIENCE INSIGHTS */}
        {user.relevant_tags && user.relevant_tags.length > 0 && (
          <div className="mt-12">
            <h3 className="text-xl font-bold text-[var(--text-h)] mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Relevant Topics
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {user.relevant_tags.slice(0, 15).map(tag => (
                <div key={tag.tag} className="cursor-default rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]">
                  #{tag.tag}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RECENT CONTENT */}
        {user.recent_posts && user.recent_posts.length > 0 && (
          <div className="mt-12">
            <h3 className="text-xl font-bold text-[var(--text-h)] mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Recent Content
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {user.recent_posts.map(post => (
                <a 
                  key={post.post_id} 
                  href={post.link || user.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-[var(--bg)]"
                >
                  {post.thumbnail ? (
                    <img src={post.thumbnail} alt={post.text || "Post thumbnail"} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[var(--surface-alt)] font-medium text-[var(--subtle)]">No Image</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    {post.stat?.views && (
                      <div className="text-white font-bold text-sm flex items-center gap-1.5 mb-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        {formatFollowers(post.stat.views)}
                      </div>
                    )}
                    <p className="text-gray-300 text-xs line-clamp-2 leading-relaxed">{post.text}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* SIMILAR CREATORS */}
        {user.similar_users && user.similar_users.length > 0 && (
          <div className="mt-12">
            <h3 className="text-xl font-bold text-[var(--text-h)] mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Similar Creators
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
              {user.similar_users.map(similar => (
                <Link
                  key={similar.user_id}
                  to={`/profile/${similar.username}?platform=${searchParams.get("platform") ?? "instagram"}`}
                  className="group snap-start flex w-64 flex-shrink-0 flex-col items-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 text-center transition-colors hover:border-[var(--accent)]"
                >
                  <img src={similar.picture} alt={`Profile picture of ${similar.username}`} className="w-20 h-20 rounded-full border-2 border-gray-700 mb-3 object-cover group-hover:scale-105 transition-transform" />
                  <div className="flex w-full items-center justify-center gap-1.5 truncate font-bold text-[var(--text-h)]">
                    {similar.fullname}
                    <VerifiedBadge verified={similar.is_verified} />
                  </div>
                  <div className="mb-3 w-full truncate text-sm text-[var(--subtle)]">@{similar.username}</div>
                  <div className="rounded-lg bg-[var(--surface-alt)] px-3 py-1.5 text-xs font-semibold text-[var(--text)]">
                    {formatFollowers(similar.followers)} Followers
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}

export function ProfileDetailPage() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rawPlatform = searchParams.get("platform");

  useEffect(() => {
    if (!rawPlatform || !PLATFORMS.includes(rawPlatform as (typeof PLATFORMS)[number])) {
      navigate("/", { replace: true });
    }
  }, [navigate, rawPlatform]);

  return <ProfileDetailContent key={username ?? "profile"} username={username} />;
}
