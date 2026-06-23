import { createContext, useContext, useState, useEffect } from 'react'
import {
  login as loginApi,
  register as registerApi,
  getMe,
  resendVerification as resendVerificationApi
} from '../utils/api'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  // Rehydrate session on mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      getMe()
        .then((res) => setUser(res.data.user))
        .catch(() => {
          // Token invalid / expired — clear storage
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  /**
   * login — only called after the server confirms valid credentials + verified account.
   * Stores JWT and sets user state.
   */
  const login = async (data) => {
    const res = await loginApi(data) // throws on error (no mock fallback)
    localStorage.setItem('token', res.data.token)
    setUser(res.data.user)
    return res.data
  }

  /**
   * register — sends registration request.
   * Does NOT set user state or store token — user must verify email first.
   * Returns the success message from the server.
   */
  const register = async (data) => {
    const res = await registerApi(data) // throws on error (no mock fallback)
    // Intentionally NOT storing token or setting user here
    return res.data
  }

  /**
   * resendVerification — re-sends verification email for given address.
   */
  const resendVerification = async (email) => {
    const res = await resendVerificationApi(email)
    return res.data
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    toast.success('Logged out successfully')
  }

  return (
    <AuthContext.Provider value={{ user, login, register, resendVerification, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
