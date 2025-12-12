import axios, { AxiosRequestConfig } from "axios";
// import { API_BASE } from "@env";

const API_BASE = process.env.EXPO_PUBLIC_API_BASE || "https://aonapps.in:7080/amsdevapi/api";
var headers = '';

const axiosCon = {
  
  get: async (endpoint: string) => {
    const response = await axios.get(`${API_BASE}${endpoint}`);
    return response.data;
  },

  
  post: async (endpoint: string, data: any) => {
    const response = await axios.post(`${API_BASE}${endpoint}`, data);
    return response.data;
  },

  
  getJSON: async (endpoint: string) => {
    const response = await axios.get(`${API_BASE}${endpoint}`, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  },

  postWithHeaders: async (
    endpoint: string,
    data: any,
    headers: Record<string, string> = {}
  ) => {
    try {
      const config: AxiosRequestConfig = {
        method: 'get',
        url: `${API_BASE}${endpoint}`,
        headers,
        data,
        maxBodyLength: Infinity,
      };
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      console.error(`Error in request to ${endpoint}:`, error);
      throw error;
    }
  }
};

export default axiosCon;