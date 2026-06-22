import { motion } from 'framer-motion'
import { Bot, ShieldAlert, Star, Bell, CheckCircle2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

const NOTIFICATIONS = [
  { id: 1, type: 'important', icon: Star, title: 'Priority Email from CEO', desc: 'Board meeting rescheduled to tomorrow at 9 AM', time: new Date(Date.now() - 5 * 60000), read: false, color: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' },
  { id: 2, type: 'spam', icon: ShieldAlert, title: 'Spam Alert Blocked', desc: '3 phishing emails were automatically quarantined', time: new Date(Date.now() - 30 * 60000), read: false, color: 'text-red-500 bg-red-50 dark:bg-red-900/20' },
  { id: 3, type: 'ai', icon: Bot, title: 'AI Classification Complete', desc: '42 new emails were analyzed and categorized', time: new Date(Date.now() - 2 * 3600000), read: true, color: 'text-primary-600 bg-primary-50 dark:bg-primary-900/20' },
  { id: 4, type: 'message', icon: Bell, title: 'New Email from Alex Carter', desc: 'Re: Q3 Strategy — "Please review the attached..."', time: new Date(Date.now() - 3 * 3600000), read: true, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
  { id: 5, type: 'ai', icon: Bot, title: 'Summary Generated', desc: 'AI summarized 8 long email threads for quick review', time: new Date(Date.now() - 12 * 3600000), read: true, color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20' },
  { id: 6, type: 'important', icon: Star, title: 'High Priority Flag', desc: 'Meeting invitation for product launch review', time: new Date(Date.now() - 24 * 3600000), read: true, color: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' },
]

export default function NotificationsPage() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Notifications</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Stay updated on your inbox activity.</p>
        </div>
        <span className="badge bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 text-xs px-3 py-1.5">
          2 unread
        </span>
      </div>

      <div className="space-y-3">
        {NOTIFICATIONS.map((notif, i) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className={`glass-card p-4 flex items-start gap-4 ${!notif.read ? 'ring-1 ring-primary-200 dark:ring-primary-800' : ''}`}
          >
            <div className={`w-10 h-10 rounded-full ${notif.color} flex items-center justify-center flex-shrink-0`}>
              <notif.icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className={`text-sm font-semibold ${!notif.read ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                  {notif.title}
                  {!notif.read && <span className="ml-2 w-2 h-2 bg-primary-500 rounded-full inline-block" />}
                </p>
                <span className="text-xs text-gray-400 flex-shrink-0">
                  {formatDistanceToNow(notif.time, { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 truncate">{notif.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-center justify-center py-4 gap-2 text-sm text-gray-500 dark:text-gray-400"
      >
        <CheckCircle2 className="w-4 h-4 text-green-500" />
        You're all caught up!
      </motion.div>
    </div>
  )
}
