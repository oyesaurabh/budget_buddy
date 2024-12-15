import { create } from "zustand";
import { axiosService } from "@/services";
import { toast } from "sonner";

interface Account {
  id: string;
  name: string;
}
interface CreateAccountValues {
  name: string;
}

interface AccountStore {
  accounts: Account[];
  isLoading: boolean;
  error: string | null;
  fetchAccounts: () => Promise<void>;
  deleteAccounts: (ids: string[]) => Promise<boolean>;
  createAccount: (values: CreateAccountValues) => Promise<boolean>;
  editAccount: (values: Account) => Promise<boolean>;
}

export const useAccountStore = create<AccountStore>((set, get) => ({
  accounts: [],
  isLoading: true,
  error: null,

  fetchAccounts: async () => {
    try {
      set({ isLoading: true, error: null });

      const { status, data, message } = await axiosService.getAccounts();

      if (!status) {
        set({
          error: message ?? "Failed to fetch accounts",
          isLoading: false,
        });
        toast.error(message ?? "Something went wrong");
        return;
      }

      set({ accounts: data, isLoading: false });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      set({ error: errorMessage, isLoading: false });
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
        accounts: state.accounts.filter((account) => !ids.includes(account.id)),
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

  createAccount: async (values: CreateAccountValues) => {
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
          item.id == values.id ? { ...item, name: values.name } : item
        ),
      }));
      toast.success(message ?? "Account Updated");
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error while creating account";
      toast.error(errorMessage);
      return false;
    }
  },
}));

useAccountStore.getState().fetchAccounts();
