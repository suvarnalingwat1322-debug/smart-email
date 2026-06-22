import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, AreaChart, Area
} from 'recharts'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { getAnalytics } from '../utils/api'
import { TrendingUp } from 'lucide-react'

const MOCK_WEEKLY = [
  { day: 'Mon', emails: 45, spam: 4 },
  { day: 'Tue', emails: 72, spam: 7 },
  { day: 'Wed', emails: 89, spam: 9 },
  { day: 'Thu', emails: 61, spam: 5 },
  { day: 'Fri', emails: 55, spam: 3 },
  { day: 'Sat', emails: 20, spam: 1 },
  { day: 'Sun', emails: 30, spam: 2 },
]

const MOCK_CATEGORIES = [
  { name: 'Work', value: 88 },
  { name: 'Important', value: 42 },
  { name: 'Personal', value: 61 },
  { name: 'Promotions', value: 74 },
  { name: 'Social', value: 30 },
  { name: 'Spam', value: 19 },
]

const MOCK_GROWTH = [
  { month: 'Jan', inbox: 180 },
  { month: 'Feb', inbox: 220 },
  { month: 'Mar', inbox: 260 },
  { month: 'Apr', inbox: 230 },
  { month: 'May', inbox: 310 },
  { month: 'Jun', inbox: 284 },
]

const COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#a855f7', '#6b7280']

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card px-3 py-2 text-sm shadow-xl border-0">
        {label && <p className="font-semibold mb-1">{label}</p>}
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="font-medium">
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function AnalyticsPage() {
  const [weekly, setWeekly] = useState(MOCK_WEEKLY)
  const [categories, setCategories] = useState(MOCK_CATEGORIES)
  const [growth, setGrowth] = useState(MOCK_GROWTH)

  useEffect(() => {
    getAnalytics()
      .then(res => {
        if (res.data.weeklyData?.length) {
          setWeekly(res.data.weeklyData.map(d => ({ ...d, emails: d.count, spam: Math.floor(d.count * 0.1) })))
        }
        if (res.data.categoryData?.length) setCategories(res.data.categoryData)
      })
      .catch(() => {/* use mock */})
  }, [])

  const axisStyle = { fill: '#9ca3af', fontSize: 12, fontFamily: 'Inter' }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Analytics</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Insights into your email patterns and AI performance.</p>
      </div>

      {/* Top row */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 lg:col-span-2"
        >
          <h2 className="text-base font-bold mb-1">Category Distribution</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">AI classification breakdown</p>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={categories}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {categories.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value) => <span className="text-xs text-gray-600 dark:text-gray-400">{value}</span>}
                iconSize={10}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 lg:col-span-3"
        >
          <h2 className="text-base font-bold mb-1">Weekly Email Volume</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Emails received vs. spam blocked per day</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={weekly} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(156,163,175,0.15)" vertical={false} />
              <XAxis dataKey="day" tick={axisStyle} axisLine={false} tickLine={false} />
              <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.05)' }} />
              <Bar dataKey="emails" name="Emails" fill="#6366f1" radius={[6, 6, 0, 0]} />
              <Bar dataKey="spam" name="Spam" fill="#ef4444" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Line chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold">Email Activity Trends</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Daily traffic over the past week</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400 font-semibold bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full">
            <TrendingUp className="w-3.5 h-3.5" />
            +12% this week
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={weekly}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(156,163,175,0.15)" vertical={false} />
            <XAxis dataKey="day" tick={axisStyle} axisLine={false} tickLine={false} />
            <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="emails" name="Emails" stroke="#6366f1" strokeWidth={2.5} dot={{ fill: '#6366f1', r: 4 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="spam" name="Spam" stroke="#ef4444" strokeWidth={2.5} strokeDasharray="5 4" dot={{ fill: '#ef4444', r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Area Chart — Inbox Growth */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6"
      >
        <h2 className="text-base font-bold mb-1">Inbox Growth</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Monthly cumulative email volume</p>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={growth}>
            <defs>
              <linearGradient id="inboxGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(156,163,175,0.15)" vertical={false} />
            <XAxis dataKey="month" tick={axisStyle} axisLine={false} tickLine={false} />
            <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="inbox" name="Total Emails" stroke="#6366f1" strokeWidth={2.5} fill="url(#inboxGrad)" dot={{ fill: '#6366f1', r: 4 }} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Summary Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-6"
      >
        <h2 className="text-base font-bold mb-4">Category Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold text-right">Count</th>
                <th className="pb-3 font-semibold text-right">Share</th>
                <th className="pb-3 font-semibold text-right">Trend</th>
                <th className="pb-3 font-semibold">Volume</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {categories.map((cat, i) => {
                const total = categories.reduce((acc, c) => acc + c.value, 0)
                const pct = Math.round((cat.value / total) * 100)
                const trends = ['+12%', '+5%', '+8%', '+3%', '+2%', '-15%']
                const trendColors = ['text-green-600 dark:text-green-400', 'text-green-600 dark:text-green-400', 'text-green-600 dark:text-green-400', 'text-green-600 dark:text-green-400', 'text-green-600 dark:text-green-400', 'text-red-500 dark:text-red-400']
                return (
                  <tr key={cat.name} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className="font-medium">{cat.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-right font-semibold">{cat.value}</td>
                    <td className="py-3 text-right text-gray-500">{pct}%</td>
                    <td className={`py-3 text-right font-semibold ${trendColors[i]}`}>{trends[i]}</td>
                    <td className="py-3 w-32">
                      <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: COLORS[i % COLORS.length] }} />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
