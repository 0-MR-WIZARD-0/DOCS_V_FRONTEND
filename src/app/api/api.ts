import axios from "axios";

const baseURL =
  typeof window === "undefined"
    ? process.env.INTERNAL_API_URL
    : '/api';                      

const api = axios.create({
  baseURL,
  withCredentials: true,
});

let isRedirecting = false

api.interceptors.response.use(
  res => res,
  error => {

    if (typeof window === "undefined") {
      return Promise.reject(error);
    }

    const status = error.response?.status
    const path = window.location.pathname

    if (
      status === 401 &&
      path.startsWith('/admin') &&
      !isRedirecting
    ) {
      isRedirecting = true
      window.location.replace('/login')
    }

    return Promise.reject(error)
  }
)

export default api;