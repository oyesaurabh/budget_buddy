import { create } from "zustand";
import { axiosService } from "@/services";
import { toast } from "sonner";

//all the data related to category
interface Category {
  id: string;
  name: string;
}
interface CreateCategoryValues {
  name: string;
}
interface CategoryStore {
  Categories: Category[];
  isLoading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  deleteCategories: (ids: string[]) => Promise<boolean>;
  createCategory: (values: CreateCategoryValues) => Promise<boolean>;
  editCategory: (values: Category) => Promise<boolean>;
}
export const useCategoryStore = create<CategoryStore>((set) => ({
  Categories: [],
  isLoading: true,
  error: null,

  fetchCategories: async () => {
    try {
      set({ isLoading: true, error: null });

      const { status, data, message } = await axiosService.getCategories();

      if (!status) {
        set({
          error: message ?? "Failed to fetch Categories",
          isLoading: false,
        });
        toast.error(message ?? "Something went wrong");
        return;
      }

      set({ Categories: data, isLoading: false });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
    }
  },

  deleteCategories: async (ids: string[]) => {
    try {
      const { status, message } = await axiosService.deleteCategories(ids);

      if (!status) {
        toast.error(message ?? "Failed to delete Categories");
        return false;
      }

      set((state) => ({
        Categories: state.Categories.filter(
          (Category) => !ids.includes(Category.id)
        ),
      }));

      toast.success(message ?? "Categories deleted successfully");
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error while deleting Categories";
      toast.error(errorMessage);
      return false;
    }
  },

  createCategory: async (values: CreateCategoryValues) => {
    try {
      const response = await axiosService.createNewCategory(values);
      const { status, data, message } = response ?? {};

      if (!status) {
        toast.error(message ?? "Failed to create Category");
        return false;
      }

      set((state) => ({
        Categories: [...state.Categories, data],
      }));

      toast.success(message ?? "Category Created");
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error while creating Category";
      toast.error(errorMessage);
      return false;
    }
  },

  editCategory: async (values: Category) => {
    try {
      const response = await axiosService.editCategory(values);
      const { status, message } = response ?? {};
      if (!status) {
        toast.error(message ?? "Failed to Update");
        return false;
      }

      set((state) => ({
        Categories: state.Categories.map((item) =>
          item.id == values.id ? { ...item, name: values.name } : item
        ),
      }));
      toast.success(message ?? "Category Updated");
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error while creating Category";
      toast.error(errorMessage);
      return false;
    }
  },
}));
useCategoryStore.getState().fetchCategories();

//this is our Category sidebar slide option
type NewCategoryState = {
  isOpen: boolean;
  values: any;
  onOpen: () => void;
  onClose: () => void;
  setValues: (data: any) => void;
};
export const useNewCategory = create<NewCategoryState>((set) => ({
  isOpen: false,
  values: {},
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  setValues: (data: any) => set({ values: data }),
}));
