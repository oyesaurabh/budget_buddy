import axios, { AxiosInstance, AxiosResponse } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Generic error handler wrapper
const handleApiCall = async <T>(
  apiCall: () => Promise<AxiosResponse<T>>
): Promise<T> => {
  try {
    const response = await apiCall();
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message || error.message || "Something went wrong";
    throw new Error(errorMessage);
  }
};

class AxiosService {
  private api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  signup(payload: any): Promise<any> {
    return handleApiCall(() => this.api.post("/api/signup", payload));
  }

  signin(payload: any): Promise<any> {
    return handleApiCall(() => this.api.post("/api/login", payload));
  }

  logout(): Promise<any> {
    return handleApiCall(() => this.api.post("/api/logout"));
  }

  createNewAccount(payload: any): Promise<any> {
    return handleApiCall(() => this.api.post("/api/accounts", payload));
  }

  getAccounts(): Promise<any> {
    return handleApiCall(() => this.api.get("/api/accounts"));
  }

  deleteAccounts(payload: string[]): Promise<any> {
    return handleApiCall(() =>
      this.api.post("/api/accounts/bulk-delete", payload)
    );
  }

  editAccount(payload: any): Promise<any> {
    return handleApiCall(() => this.api.patch("/api/accounts", payload));
  }

  createNewCategory(payload: any): Promise<any> {
    return handleApiCall(() => this.api.post("/api/category", payload));
  }

  getCategories(): Promise<any> {
    return handleApiCall(() => this.api.get("/api/category"));
  }

  deleteCategories(payload: string[]): Promise<any> {
    return handleApiCall(() =>
      this.api.post("/api/category/bulk-delete", payload)
    );
  }

  editCategory(payload: any): Promise<any> {
    return handleApiCall(() => this.api.patch("/api/category", payload));
  }

  getTransactions(payload: any): Promise<any> {
    return handleApiCall(() => this.api.post(`/api/transaction`, payload));
  }

  createNewTransaction(payload: any): Promise<any> {
    return handleApiCall(() =>
      this.api.post("/api/transaction/create", payload)
    );
  }

  deleteTransactions(payload: any): Promise<any> {
    return handleApiCall(() => this.api.delete("/api/transaction", payload));
  }
}

const axiosService = new AxiosService(api);
export default axiosService;
