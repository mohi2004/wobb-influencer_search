import type { Platform, SearchData, UserProfileSummary } from "@/types";

export async function getSearchData(platform: Platform): Promise<SearchData> {
  let module;
  if (platform === "instagram") {
    module = await import("@/assets/data/search/instagram.json");
  } else if (platform === "youtube") {
    module = await import("@/assets/data/search/youtube.json");
  } else {
    module = await import("@/assets/data/search/tiktok.json");
  }
  return module.default as SearchData;
}

export async function extractProfiles(platform: Platform): Promise<UserProfileSummary[]> {
  const data = await getSearchData(platform);

  return data.accounts.map((item) => {
    const profile = item.account.user_profile;
    return {
      ...profile,
      username: profile.username ?? profile.handle ?? profile.user_id,
    };
  });
}

export function filterProfiles(
  profiles: UserProfileSummary[],
  query: string
): UserProfileSummary[] {
  if (!query) return profiles;
  return profiles.filter((p) => {
    const matchUsername = p.username.toLowerCase().includes(query.toLowerCase());
    const matchFullname = p.fullname.toLowerCase().includes(query.toLowerCase());
    return matchUsername || matchFullname;
  });
}

export const PLATFORMS: Platform[] = ["instagram", "youtube", "tiktok"];

export function getPlatformLabel(platform: Platform): string {
  if (platform === "instagram") return "Instagram";
  if (platform === "youtube") return "YouTube";
  return "TikTok";
}
