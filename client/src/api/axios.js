import axios from "axios"

// Determine API base URL.
const rawEndpoint = import.meta.env.VITE_URL_ENDPOINT
let baseURL
let missingEndpointInProd = false

if (rawEndpoint) {
  // Keep the protocol provided by VITE_URL_ENDPOINT and trim trailing slashes
  baseURL = rawEndpoint.replace(/\/+$/, '') + '/api'
} else if (import.meta.env.DEV) {
  // In development we proxy '/api' to the local backend via Vite
  baseURL = '/api'
} else {
  // Production build with no endpoint configured — fail fast and warn.
  // Trying to reach localhost from a deployed frontend is a common misconfig.
  // We'll mark this state and prevent silent requests.
  // eslint-disable-next-line no-console
  console.error('[axios] VITE_URL_ENDPOINT is not set in production. The frontend cannot reach your backend. Set VITE_URL_ENDPOINT to the public API base URL (e.g. https://api.example.com) in your deployment environment variables.')
  missingEndpointInProd = true
  baseURL = undefined
}

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
})

// Fail fast in production when no backend endpoint is configured.
axiosInstance.interceptors.request.use((config) => {
  if (missingEndpointInProd) {
    return Promise.reject(new Error('VITE_URL_ENDPOINT is not set in production. Requests are disabled.'))
  }

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
