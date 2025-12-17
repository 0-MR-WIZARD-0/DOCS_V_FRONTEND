import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

let isRedirecting = false

api.interceptors.response.use(
  res => res,
  error => {
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