import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProfileSummary } from "@/types";

interface ListState {
  profiles: UserProfileSummary[];
  addProfile: (profile: UserProfileSummary) => boolean;
  removeProfile: (userId: string) => void;
  clearList: () => void;
  isAdded: (userId: string) => boolean;
}

export const useListStore = create<ListState>()(
  persist(
    (set, get) => ({
      profiles: [],
      addProfile: (profile) => {
        const current = get().profiles;
        const exists = current.some((entry) => entry.user_id === profile.user_id);

        if (exists) {
          return false;
        }

        set({ profiles: [profile, ...current] });
        return true;
      },
      removeProfile: (userId) => {
        set({ profiles: get().profiles.filter((entry) => entry.user_id !== userId) });
      },
      clearList: () => {
        set({ profiles: [] });
      },
      isAdded: (userId) => get().profiles.some((entry) => entry.user_id === userId),
    }),
    {
      name: "wobb-selected-list",
    }
  )
);
