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
  isLoadingTransaction: boolean;
  error: string | null;
  deleteTransactions: (ids: string[]) => Promise<boolean>;
  //   editTransaction: (values: Transaction) => Promise<boolean>;
}
export const useTransactionStore = create<TransactionStore>((set) => ({
  Transactions: [],
  isLoadingTransaction: true,
  error: null,

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
// useTransactionStore.getState().fetchTransactions({});

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
