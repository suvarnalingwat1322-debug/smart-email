import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Star, ShieldAlert, Briefcase, User, Zap, TrendingUp, TrendingDown } from 'lucide-react'
import { getAnalytics } from '../utils/api'
import { useAuth } from '../context/AuthContext'

const MOCK_STATS = {
  totalEmails: 284,
  importantEmails: 42,
  workEmails: 88,
  personalEmails: 61,
  spamEmails: 19,
  aiAccuracy: '97%'
}

const MOCK_CATEGORIES = [
  { name: 'Work', value: 88 },
  { name: 'Important', value: 42 },
  { name: 'Personal', value: 61 },
  { name: 'Promotions', value: 74 },
  { name: 'Spam', value: 19 },
]

const statCards = (stats) => [
  { label: 'Total Emails', value: stats.totalEmails, icon: Mail, color: 'from-blue-500 to-cyan-500', trend: '+12%', up: true },
  { label: 'Important', value: stats.importantEmails, icon: Star, color: 'from-yellow-400 to-orange-500', trend: '+5%', up: true },
  { label: 'Work Emails', value: stats.workEmails, icon: Briefcase, color: 'from-primary-500 to-purple-600', trend: '+8%', up: true },
  { label: 'Personal', value: stats.personalEmails, icon: User, color: 'from-green-500 to-emerald-500', trend: '+3%', up: true },
  { label: 'Spam Blocked', value: stats.spamEmails, icon: ShieldAlert, color: 'from-red-500 to-pink-500', trend: '-15%', up: false },
  { label: 'AI Accuracy', value: stats.aiAccuracy, icon: Zap, color: 'from-purple-500 to-indigo-600', trend: '+0.5%', up: true },
]

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState(MOCK_STATS)
  const [categories, setCategories] = useState(MOCK_CATEGORIES)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getAnalytics()
      .then(res => {
        if (res.data.stats) setStats(res.data.stats)
        if (res.data.categoryData) setCategories(res.data.categoryData)
      })
      .catch(() => {/* use mock */})
      .finally(() => setLoading(false))
  }, [])

  const cards = statCards(stats)

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl font-bold"
        >
          Good morning, {user?.name?.split(' ')[0] || 'User'} 👋
        </motion.h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Here's what's happening in your inbox today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            whileHover={{ y: -3, scale: 1.02 }}
            className="stat-card"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-3`}>
              <card.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold">{card.value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{card.label}</p>
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${card.up ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
              {card.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {card.trend} this week
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity & Category Summary */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Category list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6"
        >
          <h2 className="text-lg font-bold mb-4">Email Categories</h2>
          <div className="space-y-3">
            {categories.map((cat, i) => {
              const catColors = {
                Work: 'bg-blue-500',
                Important: 'bg-red-500',
                Personal: 'bg-green-500',
                Promotions: 'bg-yellow-500',
                Social: 'bg-purple-500',
                Spam: 'bg-gray-400',
              }
              const total = categories.reduce((acc, c) => acc + c.value, 0)
              const pct = Math.round((cat.value / total) * 100)
              return (
                <div key={cat.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{cat.name}</span>
                    <span className="text-gray-500 dark:text-gray-400">{cat.value} emails ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                      className={`h-full rounded-full ${catColors[cat.name] || 'bg-primary-500'}`}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* AI Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-6"
        >
          <h2 className="text-lg font-bold mb-4">AI Status</h2>
          <div className="space-y-4">
            {[
              { label: 'Classification Accuracy', value: 97, color: 'bg-primary-500' },
              { label: 'Spam Detection Rate', value: 99, color: 'bg-red-500' },
              { label: 'Summary Quality', value: 94, color: 'bg-purple-500' },
              { label: 'Sentiment Accuracy', value: 91, color: 'bg-green-500' },
            ].map((item, i) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{item.label}</span>
                  <span className="text-gray-500 dark:text-gray-400 font-semibold">{item.value}%</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ duration: 0.9, delay: i * 0.1 }}
                    className={`h-full rounded-full ${item.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0" />
            <p className="text-sm text-primary-700 dark:text-primary-300 font-medium">AI engine is active and processing emails in real-time</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
