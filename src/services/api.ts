import { store } from "@/store/store";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.request.use(config => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const state = store.getState() as any;
  const token = state.auth.token || localStorage.getItem("token");

  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
