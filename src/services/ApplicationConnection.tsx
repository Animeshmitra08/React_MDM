import axios, { AxiosRequestConfig } from "axios";

const API_BASE =
  process.env.EXPO_PUBLIC_APP_API_URL || "https://aonapps.in:6070/mdm/api";

const appAxiosCon = {
  get: async (endpoint: string) => {
    // console.log("GET Request to:", `${API_BASE}${endpoint}`);
    const response = await axios.get(`${API_BASE}${endpoint}`);
    return response.data;
  },

  post: async (endpoint: string, data: any) => {
    // console.log("POST Request to:", `${API_BASE}${endpoint}`, { data });
    const response = await axios.post(`${API_BASE}${endpoint}`, data);
    return response.data;
  },

  getJSON: async (endpoint: string) => {
    const response = await axios.get(`${API_BASE}${endpoint}`, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  },

  getWithHeaders: async (
    endpoint: string,
    headers: Record<string, string> = {}
  ) => {
    try {
      const config: AxiosRequestConfig = {
        method: "get",
        url: `${API_BASE}${endpoint}`,
        headers,
        maxBodyLength: Infinity,
      };
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      console.error(`Error in request to ${endpoint}:`, error);
      throw error;
    }
  },

  postWithHeaders: async (
    endpoint: string,
    data: any,
    headers: Record<string, string> = {}
  ) => {
    try {
      const config: AxiosRequestConfig = {
        method: "post",
        url: `${API_BASE}${endpoint}`,
        data,
        headers,
        maxBodyLength: Infinity,
      };
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      console.error(`Error in request to ${endpoint}:`, error);
      throw error;
    }
  },
};

export default appAxiosCon;
