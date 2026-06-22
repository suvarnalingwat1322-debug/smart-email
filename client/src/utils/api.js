import axios from 'axios'

const API = axios.create({
  baseURL: '/api',
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

// Auth
export const register = (data) => API.post('/auth/register', data)
export const login = (data) => API.post('/auth/login', data)
export const getMe = () => API.get('/auth/me')

// Emails
export const getEmails = (params) => API.get('/emails', { params })
export const createEmail = (data) => API.post('/emails', data)
export const updateEmail = (id, data) => API.patch(`/emails/${id}`, data)
export const deleteEmail = (id) => API.delete(`/emails/${id}`)

// AI
export const classifyEmail = (data) => API.post('/ai/classify', data)
export const summarizeEmail = (data) => API.post('/ai/summarize', data)
export const detectSpam = (data) => API.post('/ai/spam-detect', data)

// Analytics
export const getAnalytics = () => API.get('/analytics')

export default API
