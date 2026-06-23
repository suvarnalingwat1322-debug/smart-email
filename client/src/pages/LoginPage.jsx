import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

// ── Validation helpers ───────────────────────────────────────────────────────
const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email.trim())

export default function LoginPage() {
  const [form, setForm]         = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [errors, setErrors]     = useState({})
  // Special state for unverified accounts — show resend option
  const [unverifiedEmail, setUnverifiedEmail] = useState(null)
  const [resendLoading, setResendLoading]     = useState(false)

  const { login, resendVerification } = useAuth()
  const navigate = useNavigate()

  // ── Client-side field validation ──────────────────────────────────────────
  const validate = () => {
    const errs = {}
    if (!form.email.trim()) {
      errs.email = 'Email is required.'
    } else if (!isValidEmail(form.email)) {
      errs.email = 'Please enter a valid email address.'
    }
    if (!form.password) {
      errs.password = 'Password is required.'
    } else if (form.password.length < 8) {
      errs.password = 'Password must be at least 8 characters.'
    }
    return errs
  }

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value })
    // Clear field error on change
    if (errors[field]) setErrors({ ...errors, [field]: '' })
    setUnverifiedEmail(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUnverifiedEmail(null)

    // Run client-side validation first
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }

    setLoading(true)
    setErrors({})

    try {
      await login({ email: form.email.trim(), password: form.password })
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (err) {
      const serverMsg = err.response?.data?.message
      const needsVerification = err.response?.data?.needsVerification

      if (needsVerification) {
        // Show a targeted unverified-account message with resend option
        setUnverifiedEmail(err.response.data.email || form.email.trim())
        setErrors({ general: serverMsg })
      } else {
        setErrors({ general: serverMsg || 'Login failed. Please try again.' })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!unverifiedEmail) return
    setResendLoading(true)
    try {
      await resendVerification(unverifiedEmail)
      toast.success('Verification email sent! Please check your inbox.')
      setUnverifiedEmail(null)
      setErrors({})
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not resend email. Try again.')
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">
      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden bg-gradient-to-br from-primary-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0">
          <div className="blob w-96 h-96 bg-white/10 top-0 left-0 animate-blob" />
          <div className="blob w-96 h-96 bg-white/10 bottom-0 right-0 animation-delay-2000" />
        </div>
        <div className="relative text-white text-center px-12">
          <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-8">
            <Mail className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">SmartFilter AI</h1>
          <p className="text-xl text-white/80 max-w-md">
            Your intelligent email assistant that keeps your inbox organized and your mind clear.
          </p>
          <div className="mt-12 grid grid-cols-2 gap-4 text-sm">
            {['98% AI Accuracy', 'Zero Spam', 'Real-time Sync', 'Smart Summaries'].map((f) => (
              <div key={f} className="bg-white/10 backdrop-blur-sm rounded-xl py-3 px-4 font-medium">
                ✓ {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-600 to-purple-600 flex items-center justify-center">
              <Mail className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl gradient-text">SmartFilter AI</span>
          </div>

          <h2 className="text-3xl font-bold mb-1">Welcome back</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Sign in to your account to continue</p>

          {/* General error banner */}
          {errors.general && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 p-4 mb-6 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-700 dark:text-red-400 font-medium">{errors.general}</p>
                {unverifiedEmail && (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendLoading}
                    className="mt-2 text-sm text-primary-600 dark:text-primary-400 hover:underline font-semibold disabled:opacity-60"
                  >
                    {resendLoading ? 'Sending...' : 'Resend verification email →'}
                  </button>
                )}
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email */}
            <div>
              <label htmlFor="login-email" className="block text-sm font-semibold mb-1.5">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                className={`input-field ${errors.email ? 'border-red-400 dark:border-red-600 focus:ring-red-300' : ''}`}
                value={form.email}
                onChange={handleChange('email')}
                disabled={loading}
                autoComplete="email"
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="login-password" className="block text-sm font-semibold">
                  Password
                </label>
                <a href="#" className="text-xs text-primary-600 dark:text-primary-400 hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="At least 8 characters"
                  className={`input-field pr-10 ${errors.password ? 'border-red-400 dark:border-red-600 focus:ring-red-300' : ''}`}
                  value={form.password}
                  onChange={handleChange('password')}
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.password}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
