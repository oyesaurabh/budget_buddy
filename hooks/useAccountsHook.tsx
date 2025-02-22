import { z } from "zod";
import { create } from "zustand";
import { toast } from "sonner";
import { axiosService } from "@/services";
import { accountSchema } from "@/utils/schema";

// Infer the type of the account schema
type Account = z.infer<typeof accountSchema>;

interface AccountStore {
  accounts: Array<Account>; // Array of all accounts
  currentAccount: Account | null; // Currently selected account
  isAccountLoading: boolean; // Loading state
  error: string | null; // Error message
  setCurrentAccount: (acc: Account | null) => void;
  fetchAccounts: () => Promise<void>;
  deleteAccounts: (ids: string[]) => Promise<boolean>;
  createAccount: (values: Account) => Promise<boolean>;
  editAccount: (values: Account) => Promise<boolean>;
}

export const useAccountStore = create<AccountStore>((set) => ({
  accounts: [],
  currentAccount: (() => {
    if (typeof window === "undefined") return null; // Skip if SSR

    const savedAccount = localStorage.getItem("currentAccount");
    return savedAccount ? (JSON.parse(savedAccount) as Account) : null;
  })(),
  isAccountLoading: true,
  error: null,

  setCurrentAccount: (acc: Account | null) => {
    localStorage.setItem("currentAccount", JSON.stringify(acc));
    set({ currentAccount: acc });
  },
  removeCurrentAccountFromLocalStorage: () => {
    localStorage.removeItem("currentAccount");
  },
  fetchAccounts: async () => {
    try {
      set({ isAccountLoading: true, error: null });

      const { status, data, message } = await axiosService.getAccounts();

      if (!status) {
        set({
          error: message ?? "Failed to fetch accounts",
          isAccountLoading: false,
        });
        toast.error(message ?? "Something went wrong");
        return;
      }

      set({ accounts: data, isAccountLoading: false });

      if (!useAccountStore.getState().currentAccount && data.length > 0) {
        useAccountStore.getState().setCurrentAccount(data[0]);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      set({ error: errorMessage, isAccountLoading: false });
      toast.error(errorMessage);
    }
  },

  deleteAccounts: async (ids: string[]) => {
    try {
      const { status, message } = await axiosService.deleteAccounts(ids);

      if (!status) {
        toast.error(message ?? "Failed to delete accounts");
        return false;
      }

      set((state) => ({
        accounts: state.accounts.filter(
          (account) => !ids.includes(account.id ?? "")
        ),
      }));

      toast.success(message ?? "Accounts deleted successfully");
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error while deleting accounts";
      toast.error(errorMessage);
      return false;
    }
  },

  createAccount: async (values: Account) => {
    try {
      const response = await axiosService.createNewAccount(values);
      const { status, data, message } = response ?? {};

      if (!status) {
        toast.error(message ?? "Failed to create account");
        return false;
      }

      set((state) => ({
        accounts: [...state.accounts, data],
      }));

      toast.success(message ?? "Account Created");
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error while creating account";
      toast.error(errorMessage);
      return false;
    }
  },

  editAccount: async (values: Account) => {
    try {
      const response = await axiosService.editAccount(values);
      const { status, message } = response ?? {};
      if (!status) {
        toast.error(message ?? "Failed to Update");
        return false;
      }

      set((state) => ({
        accounts: state.accounts.map((item) =>
          item.id === values.id ? { ...item, ...values } : item
        ),
      }));
      toast.success(message ?? "Account Updated");
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error while updating account";
      toast.error(errorMessage);
      return false;
    }
  },
}));
useAccountStore.getState().fetchAccounts();

//this is our account sidebar slide option
type NewAccountState = {
  isOpen: boolean;
  values: any;
  onOpen: () => void;
  onClose: () => void;
  setValues: (data: any) => void;
};
export const useNewAccount = create<NewAccountState>((set) => ({
  isOpen: false,
  values: {},
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  setValues: (data: any) => set({ values: data }),
}));
