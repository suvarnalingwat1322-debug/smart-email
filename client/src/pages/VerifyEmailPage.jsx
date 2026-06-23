import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { verifyEmail } from '../utils/api'

export default function VerifyEmailPage() {
  const [searchParams]    = useSearchParams()
  const [status, setStatus] = useState('loading') // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('')

  useEffect(() => {
    const token = searchParams.get('token')

    if (!token) {
      setStatus('error')
      setMessage('No verification token found in the link. Please use the link sent to your email.')
      return
    }

    verifyEmail(token)
      .then((res) => {
        setStatus('success')
        setMessage(res.data.message || 'Email verified successfully! You can now log in.')
      })
      .catch((err) => {
        setStatus('error')
        setMessage(
          err.response?.data?.message ||
          'Verification failed. The link may have expired. Please request a new one.'
        )
      })
  }, [searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md text-center bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-10 border border-gray-100 dark:border-gray-800"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-purple-600 flex items-center justify-center">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl gradient-text">SmartFilter AI</span>
        </div>

        {/* Status icon */}
        {status === 'loading' && (
          <>
            <div className="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-9 h-9 text-primary-600 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Verifying your email…</h2>
            <p className="text-gray-500 dark:text-gray-400">Please wait a moment.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
            </motion.div>
            <h2 className="text-2xl font-bold mb-3 text-green-700 dark:text-green-400">
              Email Verified!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">{message}</p>
            <Link
              to="/login"
              id="verify-go-to-login"
              className="btn-primary inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl w-full"
            >
              Sign In to Your Account
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-6"
            >
              <XCircle className="w-10 h-10 text-red-500 dark:text-red-400" />
            </motion.div>
            <h2 className="text-2xl font-bold mb-3 text-red-700 dark:text-red-400">
              Verification Failed
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">{message}</p>
            <div className="space-y-3">
              <Link
                to="/login"
                className="btn-primary inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl w-full"
              >
                Go to Sign In
              </Link>
              <Link
                to="/register"
                className="block text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                Create a new account
              </Link>
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}
