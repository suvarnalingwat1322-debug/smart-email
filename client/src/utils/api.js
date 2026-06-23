import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' }
})

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Global 401 handler — clear auth and redirect to login
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // Only redirect if not already on login/register/verify page
      const publicPaths = ['/login', '/register', '/verify-email']
      if (!publicPaths.some((p) => window.location.pathname.startsWith(p))) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

// ─── Auth (NO mock fallback — these must always reflect real server state) ───

export const register = (data) => API.post('/auth/register', data)

export const login = (data) => API.post('/auth/login', data)

export const getMe = () => API.get('/auth/me')

export const verifyEmail = (token) => API.get(`/auth/verify-email?token=${token}`)

export const resendVerification = (email) =>
  API.post('/auth/resend-verification', { email })

// ─── Non-auth routes (mock fallback acceptable for demo UX) ──────────────────

const withMockFallback = async (apiCall, mockData) => {
  try {
    return await apiCall()
  } catch (err) {
    console.warn('Backend unavailable. Using mock data fallback.')
    return { data: mockData }
  }
}

// Emails
export const getEmails = (params) =>
  withMockFallback(() => API.get('/emails', { params }), {
    emails: [], total: 0, page: 1, totalPages: 1
  })

export const createEmail = (data) =>
  withMockFallback(() => API.post('/emails', data), {
    email: { _id: 'e_' + Date.now(), ...data, createdAt: new Date().toISOString() }
  })

export const updateEmail = (id, data) =>
  withMockFallback(() => API.patch(`/emails/${id}`, data), { email: { _id: id, ...data } })

export const deleteEmail = (id) =>
  withMockFallback(() => API.delete(`/emails/${id}`), { message: 'Deleted (mock)' })

// AI
export const classifyEmail = (data) =>
  withMockFallback(() => API.post('/ai/classify', data), {
    category: 'General', confidenceScore: 0.9, isPriority: false,
    spamScore: 5, summary: 'Mock classification summary.',
    aiExplanation: 'Backend offline — using mock.', sentiment: 'Neutral',
    autoReplySuggestion: 'Thank you.'
  })

export const summarizeEmail = (data) =>
  withMockFallback(() => API.post('/ai/summarize', data), {
    summary: 'Mock summary — backend offline.'
  })

export const detectSpam = (data) =>
  withMockFallback(() => API.post('/ai/spam-detect', data), {
    spamScore: 10, isSpam: false, reasons: ['Backend offline']
  })

// Analytics
export const getAnalytics = () =>
  withMockFallback(() => API.get('/analytics'), { weeklyData: [], categoryData: [] })

export default API
