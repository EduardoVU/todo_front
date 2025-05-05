import axios from "axios";
import type { AxiosResponse } from "axios";

// Interfaces
interface ApiResponse {
  success: boolean;
  message: string;
  [key: string]: any;
}

interface Headers {
  Authorization?: string;
  [key: string]: string | undefined;
}

interface ResendPassData {
  email: string;
}

interface GetByDatePayload {
  option: string;
  start: string;
  end: string;
}

interface ItemPayload {
  option: string;
  id: string;
  item?: any;
}

export default {
  // Login
  login(data: URLSearchParams, headers: Headers): Promise<AxiosResponse<ApiResponse>> {
    return axios.post("/login", data.toString(), { headers });;
  },

  logout(headers: Headers): Promise<AxiosResponse<ApiResponse>> {
    return axios.post("/logout", null, { headers });
  },

  // Resend Code
  resendCode(headers: Headers): Promise<AxiosResponse<ApiResponse>> {
    return axios.post(`/resend-code`, {}, { headers });
  },

  // Resend Password
  resendPass(data: ResendPassData, headers: Headers): Promise<AxiosResponse<ApiResponse>> {
    return axios.post(`resend-pass/create`, data, { headers });
  },

  // Get user info
  getCurrentUser(): Promise<AxiosResponse<ApiResponse>> {
    return axios.get('/me');
  },

  checkAuth(code: string, headers: Headers) {
    return axios.post('/auth', { code }, { headers });
  },

  // Get all information
  getAllInfo(option: string, headers: Headers): Promise<AxiosResponse<ApiResponse>> {
    return axios.get(`/${option}`, { headers });
  },

  // Get status of image
  getStatusImage(payload: { option: string; image: string }, headers: Headers): Promise<AxiosResponse<ApiResponse>> {
    return axios.get(`/${payload.option}-img/${payload.image}`, { headers });
  },

  // Get info by ID
  getInfoById(payload: { option: string; id: string }, headers: Headers): Promise<AxiosResponse<ApiResponse>> {
    return axios.get(`/${payload.option}/${payload.id}`, { headers });
  },

  // Get by date range
  getByDate(payload: GetByDatePayload, headers: Headers): Promise<AxiosResponse<ApiResponse>> {
    return axios.get(`/${payload.option}/${payload.start}/${payload.end}`, { headers });
  },

  // Delete item
  deleteItem(payload: ItemPayload, headers: Headers): Promise<AxiosResponse<ApiResponse>> {
    return axios.delete(`/${payload.option}/${payload.id}`, {
      data: payload,
      headers: headers
    });
  },

  // Edit item
  editItem(payload: ItemPayload, headers: Headers): Promise<AxiosResponse<ApiResponse>> {
    return axios.put(`/${payload.option}`, payload.item, { headers });
  },

  // Add item
  addItem(payload: ItemPayload, headers: Headers): Promise<AxiosResponse<ApiResponse>> {
    return axios.post(`/${payload.option}`, payload.item, { headers });
  },
}
