import axios from "axios"

// If VITE_URL_ENDPOINT is set (for example in production), use it.
// Otherwise, in development use the same-origin '/api' path so Vite's dev server
// proxy can forward requests to the backend. This prevents cross-site cookie
// issues during development.
const rawEndpoint = import.meta.env.VITE_URL_ENDPOINT
let baseURL
if (rawEndpoint) {
  // Preserve the protocol (https/http) and only trim trailing slashes.
  baseURL = rawEndpoint.replace(/\/+$/, '') + '/api'
} else if (import.meta.env.DEV) {
  // During local dev we proxy `/api` to the backend via Vite config.
  baseURL = '/api'
} else {
  // Production fallback: explicit localhost is almost always wrong for deployed clients.
  // Warn loudly so it's obvious in the browser console that an env var is missing.
  baseURL = 'http://localhost:4000/api'
  // eslint-disable-next-line no-console
  console.warn('[axios] VITE_URL_ENDPOINT is not set in production. Falling back to', baseURL, "— deployed frontend will try to call localhost which will fail unless the backend is publicly reachable. Set VITE_URL_ENDPOINT in your deployment settings.")
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
