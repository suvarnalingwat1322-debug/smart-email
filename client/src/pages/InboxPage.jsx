import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Archive, Trash2, Bot, RotateCcw, Plus, Search, Filter, Loader2, CheckCircle2 } from 'lucide-react'
import { getEmails, deleteEmail, updateEmail, createEmail, classifyEmail } from '../utils/api'
import { formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'

const DEMO_EMAILS = [
  {
    _id: '1',
    sender: { name: 'Alex Carter', email: 'alex@techcorp.com' },
    subject: '📊 Q3 Strategy Planning & Roadmap Review',
    preview: 'Hi team, I have attached the latest Q3 roadmap. We need to focus on AI features this quarter to stay ahead of competitors...',
    category: 'Work',
    isPriority: true,
    isRead: false,
    isStarred: false,
    spamScore: 2,
    confidenceScore: 0.95,
    sentiment: 'Neutral',
    summary: 'Meeting to review Q3 AI strategy roadmap.',
    createdAt: new Date(Date.now() - 15 * 60000).toISOString()
  },
  {
    _id: '2',
    sender: { name: 'GitHub', email: 'noreply@github.com' },
    subject: '🔐 Security Alert: Critical Vulnerability Found',
    preview: 'We detected a critical security vulnerability in one of your repository dependencies. Immediate action recommended.',
    category: 'Important',
    isPriority: true,
    isRead: false,
    isStarred: true,
    spamScore: 1,
    confidenceScore: 0.98,
    sentiment: 'Negative',
    summary: 'Critical security vulnerability found in your GitHub repository.',
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString()
  },
  {
    _id: '3',
    sender: { name: 'Mom', email: 'mom@gmail.com' },
    subject: '🍽️ Dinner this Sunday?',
    preview: 'Hi honey, are you free this Sunday for dinner? We are making your favorite roast chicken. Dad wants to hear about your new job!',
    category: 'Personal',
    isPriority: false,
    isRead: true,
    isStarred: false,
    spamScore: 0,
    confidenceScore: 0.92,
    sentiment: 'Positive',
    summary: 'Family dinner invitation for Sunday.',
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString()
  },
  {
    _id: '4',
    sender: { name: 'Spotify', email: 'no-reply@spotify.com' },
    subject: '🎵 New releases for you this Friday!',
    preview: 'Check out the latest drops from artists you love. This week: Taylor Swift, Drake, and your personalized Daily Mix...',
    category: 'Promotions',
    isPriority: false,
    isRead: true,
    isStarred: false,
    spamScore: 25,
    confidenceScore: 0.88,
    sentiment: 'Positive',
    summary: 'Weekly music recommendations from Spotify.',
    createdAt: new Date(Date.now() - 48 * 3600000).toISOString()
  },
  {
    _id: '5',
    sender: { name: 'Crypto Scammer', email: 'winner@free-btc-now.xyz' },
    subject: '🚀 YOU WON 5 BITCOIN! Claim Now Before It Expires!!!',
    preview: 'Congratulations! You have been selected as our lucky winner. Click this link immediately to claim your prize...',
    category: 'Spam',
    isPriority: false,
    isRead: true,
    isStarred: false,
    spamScore: 97,
    confidenceScore: 0.99,
    sentiment: 'Positive',
    summary: 'Detected as phishing/scam email.',
    createdAt: new Date(Date.now() - 72 * 3600000).toISOString()
  },
]

const CATEGORY_COLORS = {
  Important: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  Work: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Personal: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Promotions: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Social: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  Updates: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  Spam: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
  General: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
}

const SENTIMENT_ICONS = { Positive: '😊', Neutral: '😐', Negative: '😟' }

const ComposeModal = ({ onClose, onSend }) => {
  const [form, setForm] = useState({
    senderName: '', senderEmail: '', subject: '', content: ''
  })
  const [analyzing, setAnalyzing] = useState(false)

  const handleSend = async (e) => {
    e.preventDefault()
    setAnalyzing(true)
    try {
      // Classify with AI first
      let aiResult = {}
      try {
        const classRes = await classifyEmail({
          sender: `${form.senderName} <${form.senderEmail}>`,
          subject: form.subject,
          content: form.content
        })
        aiResult = classRes.data
      } catch { /* use defaults */ }

      await onSend({
        sender: { name: form.senderName, email: form.senderEmail },
        subject: form.subject,
        content: form.content,
        ...aiResult
      })
      onClose()
    } catch (err) {
      toast.error('Failed to send')
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="glass-card w-full max-w-lg p-6"
      >
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary-600" />
          Add Email (AI will classify automatically)
        </h2>
        <form onSubmit={handleSend} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Sender Name</label>
              <input className="input-field text-sm py-2" placeholder="John Doe" required
                value={form.senderName} onChange={e => setForm({...form, senderName: e.target.value})} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Sender Email</label>
              <input className="input-field text-sm py-2" placeholder="john@example.com" type="email" required
                value={form.senderEmail} onChange={e => setForm({...form, senderEmail: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Subject</label>
            <input className="input-field text-sm py-2" placeholder="Email subject..." required
              value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Email Content</label>
            <textarea rows={5} className="input-field text-sm py-2 resize-none" placeholder="Email body..."
              value={form.content} onChange={e => setForm({...form, content: e.target.value})} required />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-outline flex-1 py-2.5 text-sm">Cancel</button>
            <button type="submit" disabled={analyzing} className="btn-primary flex-1 py-2.5 text-sm flex items-center justify-center gap-2">
              {analyzing ? <><Loader2 className="w-4 h-4 animate-spin" />Analyzing...</> : <><Bot className="w-4 h-4" />Analyze & Add</>}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

const EmailDetail = ({ email, onClose }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
    className="fixed inset-0 md:relative md:inset-auto bg-white dark:bg-gray-950 md:bg-transparent z-30 overflow-y-auto"
  >
    <div className="glass-card p-6 h-full md:h-auto">
      <button onClick={onClose} className="md:hidden mb-4 text-sm text-primary-600">← Back</button>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold">{email.subject}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            From: {email.sender.name} &lt;{email.sender.email}&gt;
          </p>
        </div>
        <span className={`badge ${CATEGORY_COLORS[email.category] || CATEGORY_COLORS.General}`}>{email.category}</span>
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-xl p-4 mb-4 space-y-2">
        <div className="flex items-center gap-2 text-primary-700 dark:text-primary-300 font-semibold text-sm">
          <Bot className="w-4 h-4" />
          AI Analysis
        </div>
        {email.summary && (
          <div className="text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-300">Summary: </span>
            <span className="text-gray-600 dark:text-gray-400">{email.summary}</span>
          </div>
        )}
        <div className="flex flex-wrap gap-3 text-xs">
          <span className="bg-white dark:bg-gray-800 rounded-lg px-2.5 py-1 font-medium">
            Confidence: {Math.round((email.confidenceScore || 0) * 100)}%
          </span>
          <span className="bg-white dark:bg-gray-800 rounded-lg px-2.5 py-1 font-medium">
            Spam Risk: {email.spamScore || 0}%
          </span>
          <span className="bg-white dark:bg-gray-800 rounded-lg px-2.5 py-1 font-medium">
            Sentiment: {SENTIMENT_ICONS[email.sentiment]} {email.sentiment}
          </span>
        </div>
        {email.autoReplySuggestion && (
          <div className="text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-300">Suggested Reply: </span>
            <span className="text-gray-600 dark:text-gray-400 italic">"{email.autoReplySuggestion}"</span>
          </div>
        )}
      </div>

      <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap border-t border-gray-100 dark:border-gray-800 pt-4">
        {email.content || email.preview}
      </div>
    </div>
  </motion.div>
)

export default function InboxPage() {
  const [emails, setEmails] = useState(DEMO_EMAILS)
  const [selectedEmail, setSelectedEmail] = useState(null)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [showCompose, setShowCompose] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    getEmails({ status: 'inbox' })
      .then(res => {
        if (res.data.emails?.length > 0) setEmails(res.data.emails)
      })
      .catch(() => { /* use demo */ })
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id, e) => {
    e?.stopPropagation()
    setEmails(prev => prev.filter(em => em._id !== id))
    if (selectedEmail?._id === id) setSelectedEmail(null)
    try { await deleteEmail(id) } catch { }
    toast.success('Email deleted')
  }

  const handleArchive = async (id, e) => {
    e?.stopPropagation()
    setEmails(prev => prev.filter(em => em._id !== id))
    try { await updateEmail(id, { status: 'archived' }) } catch { }
    toast.success('Email archived')
  }

  const handleStar = async (id, e) => {
    e?.stopPropagation()
    setEmails(prev => prev.map(em => em._id === id ? { ...em, isStarred: !em.isStarred } : em))
    const email = emails.find(e => e._id === id)
    try { await updateEmail(id, { isStarred: !email?.isStarred }) } catch { }
  }

  const handleAddEmail = async (data) => {
    try {
      const res = await createEmail(data)
      setEmails(prev => [res.data.email, ...prev])
      toast.success('✨ Email added and AI-classified!')
    } catch {
      // Add to local state anyway
      const newEmail = { _id: Date.now().toString(), ...data, createdAt: new Date().toISOString(), isRead: false }
      setEmails(prev => [newEmail, ...prev])
      toast.success('✨ Email added (demo mode)')
    }
  }

  const filtered = emails.filter(em => {
    const matchFilter = filter === 'all' || em.category === filter
    const matchSearch = !search || em.subject.toLowerCase().includes(search.toLowerCase())
      || em.sender.name.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const FILTERS = ['all', 'Important', 'Work', 'Personal', 'Promotions', 'Social', 'Updates', 'Spam']

  return (
    <div className="h-full flex gap-4 max-w-7xl mx-auto">
      {/* Email List */}
      <div className={`flex flex-col ${selectedEmail ? 'hidden md:flex md:w-1/2 lg:w-3/5' : 'w-full'} glass-card overflow-hidden`}>
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Inbox</h1>
            <button onClick={() => setShowCompose(true)} className="btn-primary py-2 px-4 text-sm flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Email
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input placeholder="Search emails..." className="input-field pl-9 py-2 text-sm"
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {FILTERS.map(f => (
              <button key={f}
                onClick={() => setFilter(f)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  filter === f
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-500/25'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}>
                {f === 'all' ? 'All' : f}
              </button>
            ))}
          </div>
        </div>

        {/* Email Rows */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence>
            {filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 gap-3 text-center"
              >
                <CheckCircle2 className="w-12 h-12 text-green-500" />
                <p className="font-semibold">All caught up!</p>
                <p className="text-sm text-gray-500">No emails match this filter.</p>
              </motion.div>
            ) : (
              filtered.map((email, i) => (
                <motion.div
                  key={email._id}
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.2 }}
                  className={`email-row group ${!email.isRead ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''} ${selectedEmail?._id === email._id ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
                  onClick={() => {
                    setSelectedEmail(email)
                    setEmails(prev => prev.map(e => e._id === email._id ? { ...e, isRead: true } : e))
                  }}
                >
                  {/* Star */}
                  <button onClick={(e) => handleStar(email._id, e)} className="flex-shrink-0">
                    <Star className={`w-4 h-4 ${email.isStarred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600 hover:text-yellow-400'}`} />
                  </button>

                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {email.sender.name[0].toUpperCase()}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm truncate ${!email.isRead ? 'font-bold' : 'font-medium'}`}>
                        {email.sender.name}
                      </span>
                      {email.isPriority && <span className="text-xs text-red-500 font-bold flex-shrink-0">●</span>}
                    </div>
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className={`text-xs truncate ${!email.isRead ? 'font-semibold text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400'}`}>
                        {email.subject}
                      </span>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="flex-shrink-0 flex flex-col items-end gap-1">
                    <span className={`badge ${CATEGORY_COLORS[email.category] || CATEGORY_COLORS.General}`}>
                      {email.category}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(email.createdAt), { addSuffix: true })}
                    </span>
                  </div>

                  {/* Hover actions */}
                  <div className="hidden group-hover:flex items-center gap-1 flex-shrink-0">
                    <button onClick={(e) => handleArchive(email._id, e)} className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                      <Archive className="w-4 h-4 text-gray-500" />
                    </button>
                    <button onClick={(e) => handleDelete(email._id, e)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Email Detail */}
      <AnimatePresence>
        {selectedEmail && (
          <div className="flex-1 hidden md:block">
            <EmailDetail email={selectedEmail} onClose={() => setSelectedEmail(null)} />
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Email Detail */}
      <AnimatePresence>
        {selectedEmail && (
          <div className="md:hidden fixed inset-0 z-30 p-4 bg-gray-50 dark:bg-gray-950 overflow-y-auto">
            <EmailDetail email={selectedEmail} onClose={() => setSelectedEmail(null)} />
          </div>
        )}
      </AnimatePresence>

      {/* Compose Modal */}
      <AnimatePresence>
        {showCompose && (
          <ComposeModal onClose={() => setShowCompose(false)} onSend={handleAddEmail} />
        )}
      </AnimatePresence>
    </div>
  )
}
