import { motion } from 'framer-motion'
import { Tags } from 'lucide-react'

const CATEGORIES = [
  { name: 'Important', count: 42, color: 'from-red-500 to-pink-500', icon: '🔴', desc: 'High priority emails requiring immediate attention' },
  { name: 'Work', count: 88, color: 'from-blue-500 to-cyan-500', icon: '💼', desc: 'Professional emails, meetings, and project updates' },
  { name: 'Personal', count: 61, color: 'from-green-500 to-emerald-500', icon: '👤', desc: 'Friends, family, and personal communication' },
  { name: 'Promotions', count: 74, color: 'from-yellow-500 to-orange-500', icon: '🎁', desc: 'Deals, offers, and marketing emails' },
  { name: 'Social', count: 30, color: 'from-purple-500 to-indigo-500', icon: '💬', desc: 'Social media and networking notifications' },
  { name: 'Updates', count: 55, color: 'from-cyan-500 to-blue-500', icon: '📢', desc: 'System notifications and newsletter updates' },
  { name: 'Spam', count: 19, color: 'from-gray-400 to-gray-600', icon: '🚫', desc: 'Filtered spam, scams, and phishing attempts' },
]

export default function CategoriesPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Categories</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">AI-powered email classification at a glance.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {CATEGORIES.map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="glass-card p-5 cursor-pointer group"
          >
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform`}>
              {cat.icon}
            </div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-lg">{cat.name}</h3>
              <span className="text-2xl font-black gradient-text">{cat.count}</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{cat.desc}</p>
            <div className="mt-3 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${cat.color}`}
                style={{ width: `${Math.min((cat.count / 100) * 100, 100)}%` }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
