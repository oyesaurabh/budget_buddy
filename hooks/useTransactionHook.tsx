import { create } from "zustand";
import { axiosService } from "@/services";
import { toast } from "sonner";

//all the data related to transactions
interface Transaction {
  id: string;
  name: string;
}
interface CreateTransactionValues {
  name: string;
}
interface TransactionStore {
  Transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  fetchTransactions: () => Promise<void>;
  //   deleteTransactions: (ids: string[]) => Promise<boolean>;
  createTransaction: (values: CreateTransactionValues) => Promise<boolean>;
  //   editTransaction: (values: Transaction) => Promise<boolean>;
}
export const useTransactionStore = create<TransactionStore>((set) => ({
  Transactions: [],
  isLoading: true,
  error: null,

  fetchTransactions: async () => {
    try {
      set({ isLoading: true, error: null });
      const payload = { accountId: "cm4vm45q70001i8leflq3bq1f" };
      const { status, data, message } = await axiosService.getTransactions(
        payload
      );

      if (!status) {
        set({
          error: message ?? "Failed to fetch Transactions",
          isLoading: false,
        });
        toast.error(message ?? "Something went wrong");
        return;
      }

      set({ Transactions: data, isLoading: false });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
    }
  },

  deleteTransactions: async (ids: string[]) => {
    try {
      const { status, message } = await axiosService.deleteTransactions(ids);

      if (!status) {
        toast.error(message ?? "Failed to delete Transactions");
        return false;
      }

      set((state) => ({
        Transactions: state.Transactions.filter(
          (Transaction) => !ids.includes(Transaction.id)
        ),
      }));

      toast.success(message ?? "Transactions deleted successfully");
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error while deleting Transactions";
      toast.error(errorMessage);
      return false;
    }
  },

  createTransaction: async (values: CreateTransactionValues) => {
    try {
      const response = await axiosService.createNewTransaction(values);
      const { status, data, message } = response ?? {};

      if (!status) {
        toast.error(message ?? "Failed to create Transaction");
        return false;
      }

      set((state) => ({
        Transactions: [...state.Transactions, data],
      }));

      toast.success(message ?? "Transaction Created");
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error while creating Transaction";
      toast.error(errorMessage);
      return false;
    }
  },

  //   editTransaction: async (values: Transaction) => {
  //     try {
  //       const response = await axiosService.editTransaction(values);
  //       const { status, message } = response ?? {};
  //       if (!status) {
  //         toast.error(message ?? "Failed to Update");
  //         return false;
  //       }

  //       set((state) => ({
  //         Transactions: state.Transactions.map((item) =>
  //           item.id == values.id ? { ...item, name: values.name } : item
  //         ),
  //       }));
  //       toast.success(message ?? "Transaction Updated");
  //       return true;
  //     } catch (err) {
  //       const errorMessage =
  //         err instanceof Error ? err.message : "Error while creating Transaction";
  //       toast.error(errorMessage);
  //       return false;
  //     }
  //   },
}));
useTransactionStore.getState().fetchTransactions();

//this is our Transaction sidebar slide option
type NewTransactionState = {
  isOpen: boolean;
  values: any;
  onOpen: () => void;
  onClose: () => void;
  setValues: (data: any) => void;
};
export const useNewTransaction = create<NewTransactionState>((set) => ({
  isOpen: false,
  values: {},
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  setValues: (data: any) => set({ values: data }),
}));
