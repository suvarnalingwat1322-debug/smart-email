import axios from 'axios'

const API = axios.create({
  // Use VITE_API_URL if provided (for Vercel deployment), otherwise default to local proxy or local server URL
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' }
})

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// Helper for mock data fallback
const withMockFallback = async (apiCall, mockData) => {
  try {
    return await apiCall();
  } catch (err) {
    console.warn("Backend unavailable or returned error. Using Mock Data Fallback.");
    return { data: mockData };
  }
};

// Auth
export const register = (data) => withMockFallback(() => API.post('/auth/register', data), {
  token: 'mock_token_' + Date.now(),
  user: { _id: 'u1', name: data.name, email: data.email, preferences: {} }
});

export const login = (data) => withMockFallback(() => API.post('/auth/login', data), {
  token: 'mock_token_' + Date.now(),
  user: { _id: 'u1', name: 'Demo User', email: data.email, preferences: {} }
});

export const getMe = () => withMockFallback(() => API.get('/auth/me'), {
  user: { _id: 'u1', name: 'Demo User', email: 'demo@smartfilter.ai', preferences: {} }
});

// Emails
export const getEmails = (params) => withMockFallback(() => API.get('/emails', { params }), {
  emails: [],
  total: 0,
  page: 1,
  totalPages: 1
});

export const createEmail = (data) => withMockFallback(() => API.post('/emails', data), {
  email: { _id: 'e_' + Date.now(), ...data, createdAt: new Date().toISOString() }
});

export const updateEmail = (id, data) => withMockFallback(() => API.patch(`/emails/${id}`, data), {
  email: { _id: id, ...data }
});

export const deleteEmail = (id) => withMockFallback(() => API.delete(`/emails/${id}`), {
  message: 'Deleted successfully (Mock)'
});

// AI
export const classifyEmail = (data) => withMockFallback(() => API.post('/ai/classify', data), {
  category: 'General',
  confidenceScore: 0.9,
  isPriority: false,
  spamScore: 5,
  summary: 'Mock classification summary.',
  aiExplanation: 'Backend is offline, using mock.',
  sentiment: 'Neutral',
  autoReplySuggestion: 'Thank you.'
});

export const summarizeEmail = (data) => withMockFallback(() => API.post('/ai/summarize', data), {
  summary: 'This is a mock summary because the backend is not connected.'
});

export const detectSpam = (data) => withMockFallback(() => API.post('/ai/spam-detect', data), {
  spamScore: 10,
  isSpam: false,
  reasons: ['Backend offline']
});

// Analytics
export const getAnalytics = () => withMockFallback(() => API.get('/analytics'), {
  weeklyData: [],
  categoryData: []
});

export default API
