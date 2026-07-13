import { create } from "zustand";
import { axiosService } from "@/services";

interface ProfileStore {
  name: string;
  email: string;
  avatarUrl: string | null;
  isLoading: boolean;
  fetched: boolean;
  fetchProfile: (force?: boolean) => Promise<void>;
  setProfile: (
    data: Partial<Pick<ProfileStore, "name" | "email" | "avatarUrl">>
  ) => void;
}

export const useProfileStore = create<ProfileStore>((set, get) => ({
  name: "",
  email: "",
  avatarUrl: null,
  isLoading: false,
  fetched: false,

  fetchProfile: async (force = false) => {
    if (get().isLoading) return;
    if (get().fetched && !force) return;
    try {
      set({ isLoading: true });
      const { status, data } = await axiosService.getProfile();
      if (status && data) {
        set({
          name: data.name ?? "",
          email: data.email ?? "",
          avatarUrl: data.avatar_url ?? null,
          fetched: true,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },

  setProfile: (data) => set((state) => ({ ...state, ...data })),
}));
