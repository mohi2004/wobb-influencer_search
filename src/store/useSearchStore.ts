import { create } from "zustand";
import type { Platform, UserProfileSummary } from "@/types";

interface SearchState {
  platform: Platform;
  searchQuery: string;
  profilesCache: Record<Platform, UserProfileSummary[]>;
  setPlatform: (platform: Platform) => void;
  setSearchQuery: (query: string) => void;
  setCache: (platform: Platform, profiles: UserProfileSummary[]) => void;
}

const initialProfilesCache: Record<Platform, UserProfileSummary[]> = {
  instagram: [],
  youtube: [],
  tiktok: [],
};

export const useSearchStore = create<SearchState>((set) => ({
  platform: "instagram",
  searchQuery: "",
  profilesCache: initialProfilesCache,
  setPlatform: (platform) => set({ platform }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setCache: (platform, profiles) =>
    set((state) => ({
      profilesCache: {
        ...state.profilesCache,
        [platform]: profiles,
      },
    })),
}));
