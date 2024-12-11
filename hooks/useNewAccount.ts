import { create } from "zustand";

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
