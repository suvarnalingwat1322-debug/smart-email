import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Moon, Sun, Bell, BellOff, Shield, Brain, User, Key,
  Mail, Save, CheckCircle, Eye, EyeOff, Loader2
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const Section = ({ title, desc, icon: Icon, children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass-card p-6"
  >
    <div className="flex items-center gap-3 mb-5">
      <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
      </div>
      <div>
        <h2 className="font-bold text-base">{title}</h2>
        {desc && <p className="text-xs text-gray-500 dark:text-gray-400">{desc}</p>}
      </div>
    </div>
    {children}
  </motion.div>
)

const Toggle = ({ label, desc, checked, onChange }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
    <div>
      <p className="text-sm font-medium">{label}</p>
      {desc && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{desc}</p>}
    </div>
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${checked ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${checked ? 'translate-x-5' : ''}`} />
    </button>
  </div>
)

export default function SettingsPage() {
  const { darkMode, toggleDark } = useTheme()
  const { user, logout } = useAuth()

  // Notification prefs
  const [notifs, setNotifs] = useState({
    importantEmails: true,
    spamAlerts: true,
    aiClassification: false,
    weeklyDigest: true,
    soundEnabled: false,
  })

  // AI settings
  const [aiSettings, setAiSettings] = useState({
    sensitivity: 'medium',
    autoArchiveSpam: true,
    autoSummarize: true,
    autoReply: false,
    showConfidence: true,
  })

  // Password change
  const [passwordForm, setPasswordForm] = useState({ current: '', next: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [savingPw, setSavingPw] = useState(false)

  const handleSavePassword = async (e) => {
    e.preventDefault()
    if (passwordForm.next !== passwordForm.confirm) {
      toast.error('Passwords do not match')
      return
    }
    if (passwordForm.next.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setSavingPw(true)
    await new Promise(r => setTimeout(r, 1000))
    setSavingPw(false)
    toast.success('Password updated successfully!')
    setPasswordForm({ current: '', next: '', confirm: '' })
  }

  const sensitivityLevels = [
    { value: 'low', label: 'Low', desc: 'More emails pass through to inbox' },
    { value: 'medium', label: 'Medium', desc: 'Balanced — recommended for most users' },
    { value: 'high', label: 'High', desc: 'Stricter filtering, fewer false positives' },
  ]

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Customize your SmartFilter AI experience.</p>
      </div>

      {/* Account Info */}
      <Section title="Account" desc="Your profile information" icon={User} delay={0.05}>
        <div className="flex items-center gap-4 py-3 border-b border-gray-100 dark:border-gray-800">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <p className="font-semibold text-base">{user?.name || 'User'}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email || 'user@example.com'}</p>
            <span className="inline-flex items-center gap-1 mt-1 text-xs text-green-600 dark:text-green-400 font-medium">
              <CheckCircle className="w-3 h-3" /> Verified Account
            </span>
          </div>
        </div>
        <div className="pt-3 grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Display Name</label>
            <input defaultValue={user?.name} className="input-field text-sm py-2" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Email Address</label>
            <input defaultValue={user?.email} className="input-field text-sm py-2" disabled />
          </div>
          <div className="col-span-2">
            <button onClick={() => toast.success('Profile saved!')} className="btn-primary py-2 px-5 text-sm flex items-center gap-2">
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </div>
      </Section>

      {/* Appearance */}
      <Section title="Appearance" desc="Customize the look and feel" icon={Sun} delay={0.1}>
        <div className="flex items-center justify-between py-3">
          <div>
            <p className="text-sm font-medium">Dark Mode</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Switch between light and dark theme</p>
          </div>
          <div className="flex items-center gap-3">
            <Sun className="w-4 h-4 text-yellow-500" />
            <button
              onClick={toggleDark}
              className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${darkMode ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${darkMode ? 'translate-x-5' : ''}`} />
            </button>
            <Moon className="w-4 h-4 text-primary-500" />
          </div>
        </div>
      </Section>

      {/* AI Settings */}
      <Section title="AI Configuration" desc="Control how the AI processes your emails" icon={Brain} delay={0.15}>
        {/* Sensitivity */}
        <div className="mb-4">
          <p className="text-sm font-semibold mb-2">Filter Sensitivity</p>
          <div className="grid grid-cols-3 gap-2">
            {sensitivityLevels.map(level => (
              <button
                key={level.value}
                onClick={() => setAiSettings(prev => ({ ...prev, sensitivity: level.value }))}
                className={`p-3 rounded-xl border-2 text-left transition-all text-xs ${
                  aiSettings.sensitivity === level.value
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                }`}
              >
                <span className={`font-bold block ${aiSettings.sensitivity === level.value ? 'text-primary-700 dark:text-primary-400' : ''}`}>
                  {level.label}
                </span>
                <span className="text-gray-500 dark:text-gray-400 mt-0.5 block">{level.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <Toggle label="Auto-archive Spam" desc="Automatically move spam to archive" checked={aiSettings.autoArchiveSpam} onChange={v => setAiSettings(p => ({ ...p, autoArchiveSpam: v }))} />
        <Toggle label="Auto-summarize Emails" desc="Generate AI summaries for all emails" checked={aiSettings.autoSummarize} onChange={v => setAiSettings(p => ({ ...p, autoSummarize: v }))} />
        <Toggle label="Auto-reply Suggestions" desc="Show AI-generated reply drafts" checked={aiSettings.autoReply} onChange={v => setAiSettings(p => ({ ...p, autoReply: v }))} />
        <Toggle label="Show Confidence Scores" desc="Display AI classification confidence" checked={aiSettings.showConfidence} onChange={v => setAiSettings(p => ({ ...p, showConfidence: v }))} />

        <button onClick={() => toast.success('AI settings saved!')} className="btn-primary py-2 px-5 text-sm flex items-center gap-2 mt-4">
          <Save className="w-4 h-4" /> Save AI Settings
        </button>
      </Section>

      {/* Notifications */}
      <Section title="Notifications" desc="Choose what alerts you receive" icon={Bell} delay={0.2}>
        <Toggle label="Important Email Alerts" desc="Get notified for priority emails" checked={notifs.importantEmails} onChange={v => setNotifs(p => ({ ...p, importantEmails: v }))} />
        <Toggle label="Spam Detection Alerts" desc="Alert when spam is blocked" checked={notifs.spamAlerts} onChange={v => setNotifs(p => ({ ...p, spamAlerts: v }))} />
        <Toggle label="AI Classification Complete" desc="Notify when batch analysis finishes" checked={notifs.aiClassification} onChange={v => setNotifs(p => ({ ...p, aiClassification: v }))} />
        <Toggle label="Weekly Digest" desc="Receive a weekly inbox summary" checked={notifs.weeklyDigest} onChange={v => setNotifs(p => ({ ...p, weeklyDigest: v }))} />
        <Toggle label="Sound Notifications" desc="Play a sound for new alerts" checked={notifs.soundEnabled} onChange={v => setNotifs(p => ({ ...p, soundEnabled: v }))} />
      </Section>

      {/* Security */}
      <Section title="Security" desc="Manage your account security" icon={Shield} delay={0.25}>
        <form onSubmit={handleSavePassword} className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Current Password</label>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} className="input-field text-sm py-2 pr-10"
                placeholder="••••••••" value={passwordForm.current}
                onChange={e => setPasswordForm(p => ({ ...p, current: e.target.value }))} required />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">New Password</label>
              <input type={showPw ? 'text' : 'password'} className="input-field text-sm py-2"
                placeholder="Min 6 characters" value={passwordForm.next}
                onChange={e => setPasswordForm(p => ({ ...p, next: e.target.value }))} required />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Confirm Password</label>
              <input type={showPw ? 'text' : 'password'} className="input-field text-sm py-2"
                placeholder="Repeat password" value={passwordForm.confirm}
                onChange={e => setPasswordForm(p => ({ ...p, confirm: e.target.value }))} required />
            </div>
          </div>
          <button type="submit" disabled={savingPw} className="btn-primary py-2 px-5 text-sm flex items-center gap-2">
            {savingPw ? <Loader2 className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
            {savingPw ? 'Updating...' : 'Update Password'}
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800">
          <p className="text-sm font-semibold text-red-600 dark:text-red-400 mb-3">Danger Zone</p>
          <button
            onClick={() => {
              if (confirm('Are you sure you want to log out of all devices?')) {
                logout()
                toast.success('Logged out from all devices')
              }
            }}
            className="px-4 py-2 rounded-xl border-2 border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
          >
            Sign Out All Devices
          </button>
        </div>
      </Section>

      {/* Connected Accounts */}
      <Section title="Connected Accounts" desc="Manage email provider integrations" icon={Mail} delay={0.3}>
        {[
          { name: 'Gmail', status: 'Not connected', icon: '📧', color: 'text-red-500' },
          { name: 'Outlook', status: 'Not connected', icon: '📨', color: 'text-blue-500' },
          { name: 'Yahoo Mail', status: 'Not connected', icon: '💌', color: 'text-purple-500' },
        ].map(acc => (
          <div key={acc.name} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{acc.icon}</span>
              <div>
                <p className="text-sm font-semibold">{acc.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{acc.status}</p>
              </div>
            </div>
            <button
              onClick={() => toast.success(`${acc.name} integration coming soon!`)}
              className="btn-outline py-1.5 px-3 text-xs"
            >
              Connect
            </button>
          </div>
        ))}
      </Section>
    </div>
  )
}
