import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Eye, EyeOff, Loader2, CheckCircle, AlertCircle, Send } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

// ── Validation helpers ───────────────────────────────────────────────────────
const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email.trim())

const perks = [
  'AI email classification',
  'Smart spam detection',
  'Inbox analytics',
  'Free forever plan'
]

export default function RegisterPage() {
  const [form, setForm]         = useState({ name: '', email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [errors, setErrors]     = useState({})
  const [registered, setRegistered] = useState(false) // show success screen

  const { register } = useAuth()

  // ── Client-side field validation ──────────────────────────────────────────
  const validate = () => {
    const errs = {}
    if (!form.name.trim()) {
      errs.name = 'Full name is required.'
    }
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
    if (errors[field]) setErrors({ ...errors, [field]: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }

    setLoading(true)
    setErrors({})

    try {
      await register({
        name:     form.name.trim(),
        email:    form.email.trim(),
        password: form.password
      })
      // Registration succeeded — show "check your email" screen (do NOT log in)
      setRegistered(true)
    } catch (err) {
      const serverMsg = err.response?.data?.message
      setErrors({ general: serverMsg || 'Registration failed. Please try again.' })
      toast.error(serverMsg || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── Success / "Check your email" screen ───────────────────────────────────
  if (registered) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md text-center bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-10 border border-gray-100 dark:border-gray-800"
        >
          <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
            <Send className="w-9 h-9 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Check your email</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            We sent a verification link to
          </p>
          <p className="font-semibold text-primary-600 dark:text-primary-400 mb-6">
            {form.email.trim()}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-8">
            Click the link in the email to verify your account. The link expires in 24 hours.
            Check your spam folder if you don't see it.
          </p>
          <Link
            to="/login"
            className="btn-primary inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl w-full"
          >
            Go to Sign In
          </Link>
        </motion.div>
      </div>
    )
  }

  // ── Registration form ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">
      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden bg-gradient-to-br from-primary-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0">
          <div className="blob w-96 h-96 bg-white/10 top-0 right-0 animate-blob" />
          <div className="blob w-96 h-96 bg-white/10 bottom-0 left-0 animation-delay-4000" />
        </div>
        <div className="relative text-white text-center px-12">
          <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-8">
            <Mail className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Join SmartFilter AI</h1>
          <p className="text-xl text-white/80 mb-8">
            Start organizing your inbox with the power of artificial intelligence.
          </p>
          <div className="space-y-3 text-left">
            {perks.map((perk) => (
              <div key={perk} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3">
                <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0" />
                <span className="font-medium">{perk}</span>
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

          <h2 className="text-3xl font-bold mb-1">Create account</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Get started with SmartFilter AI today
          </p>

          {/* General error banner */}
          <AnimatePresence>
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 p-4 mb-6 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
              >
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700 dark:text-red-400 font-medium">{errors.general}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Full Name */}
            <div>
              <label htmlFor="reg-name" className="block text-sm font-semibold mb-1.5">
                Full Name
              </label>
              <input
                id="reg-name"
                type="text"
                placeholder="John Doe"
                className={`input-field ${errors.name ? 'border-red-400 dark:border-red-600' : ''}`}
                value={form.name}
                onChange={handleChange('name')}
                disabled={loading}
                autoComplete="name"
              />
              {errors.name && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="reg-email" className="block text-sm font-semibold mb-1.5">
                Email
              </label>
              <input
                id="reg-email"
                type="email"
                placeholder="you@example.com"
                className={`input-field ${errors.email ? 'border-red-400 dark:border-red-600' : ''}`}
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
              <label htmlFor="reg-password" className="block text-sm font-semibold mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="reg-password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="At least 8 characters"
                  className={`input-field pr-10 ${errors.password ? 'border-red-400 dark:border-red-600' : ''}`}
                  value={form.password}
                  onChange={handleChange('password')}
                  disabled={loading}
                  autoComplete="new-password"
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
              {/* Password strength hint */}
              {form.password && !errors.password && (
                <div className="mt-2 flex gap-1">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all ${
                        form.password.length >= [8, 10, 12, 14][i]
                          ? ['bg-red-400', 'bg-yellow-400', 'bg-blue-400', 'bg-green-500'][i]
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              id="register-submit"
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
