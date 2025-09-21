import axios from "axios"

// If VITE_URL_ENDPOINT is set (for example in production), use it.
// Otherwise, in development use the same-origin '/api' path so Vite's dev server
// proxy can forward requests to the backend. This prevents cross-site cookie
// issues during development.
const rawEndpoint = import.meta.env.VITE_URL_ENDPOINT
let baseURL
if (rawEndpoint) {
  baseURL = rawEndpoint.replace(/^https:\/\//i, 'http://').replace(/\/+$/, '') + '/api'
} else if (import.meta.env.DEV) {
  baseURL = '/api'
} else {
  baseURL = 'http://localhost:4000/api'
}

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
})

// Attach Authorization header automatically when a token is present in localStorage.
axiosInstance.interceptors.request.use((config) => {
  try {
    const userToken = localStorage.getItem('token')
    const sellerToken = localStorage.getItem('sellerToken')
    const token = userToken || sellerToken
    if (token) {
      config.headers = config.headers || {}
      if (!config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
  } catch (err) {
    // ignore localStorage errors
  }
  return config
}, (error) => Promise.reject(error))

export default axiosInstance
