import axios, { AxiosInstance, AxiosResponse } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

class AxiosService {
  private api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  async signup(payload: any): Promise<any> {
    try {
      const response: AxiosResponse<any> = await this.api.post(
        "/api/signup",
        payload
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "something went wrong");
    }
  }

  async signin(payload: any): Promise<any> {
    try {
      const response: AxiosResponse<any> = await this.api.post(
        "/api/login",
        payload
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "something went wrong");
    }
  }

  async logout(): Promise<any> {
    try {
      const response: AxiosResponse<any> = await this.api.post("/api/logout");
      return response.data;
    } catch (error: any) {
      throw new Error(`Error during signin: ${error.message}`);
    }
  }
  async createNewAccount(payload: any): Promise<any> {
    try {
      const response: AxiosResponse<any> = await this.api.post(
        "/api/accounts",
        payload
      );
      return response.data;
    } catch (error: any) {
      throw new Error(`Error during creating new account: ${error.message}`);
    }
  }
}
const axiosService = new AxiosService(api);
export default axiosService;
