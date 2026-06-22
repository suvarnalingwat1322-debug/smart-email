import { Link, useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Bot, Shield, Zap, Inbox, Star, BarChart2, Mail, CheckCircle2, ChevronRight } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { Sun, Moon } from 'lucide-react'

const categories = [
  { label: 'Important', color: 'bg-red-500', desc: 'High priority items', icon: '🔴' },
  { label: 'Work', color: 'bg-blue-500', desc: 'Professional emails', icon: '💼' },
  { label: 'Personal', color: 'bg-green-500', desc: 'Friends & family', icon: '👤' },
  { label: 'Promotions', color: 'bg-yellow-500', desc: 'Deals & offers', icon: '🎁' },
  { label: 'Social', color: 'bg-purple-500', desc: 'Social networks', icon: '💬' },
  { label: 'Spam', color: 'bg-gray-400', desc: 'Filtered out', icon: '🚫' },
]

const features = [
  {
    icon: Bot,
    title: 'AI Classification',
    desc: 'Intelligent email categorization powered by OpenAI GPT-4, classifying with 98%+ accuracy.',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Zap,
    title: 'Smart Summaries',
    desc: 'Get a TL;DR of any long email thread in 1-2 sentences so you never miss what matters.',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    icon: Shield,
    title: 'Spam Detection',
    desc: 'Advanced phishing and scam detection stops harmful emails before they reach your inbox.',
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    icon: BarChart2,
    title: 'Inbox Analytics',
    desc: 'Beautiful charts and insights to understand your email habits and optimize your workflow.',
    gradient: 'from-orange-500 to-red-500'
  },
]

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Product Manager at Stripe',
    text: 'SmartFilter AI saved me 2+ hours every day. The AI summaries are frighteningly accurate.',
    avatar: 'SJ',
    rating: 5
  },
  {
    name: 'Raj Patel',
    role: 'Founder at CloudScale',
    text: 'Finally, an email tool that understands context. The spam detection alone is worth the price.',
    avatar: 'RP',
    rating: 5
  },
  {
    name: 'Emily Chen',
    role: 'UX Designer at Figma',
    text: 'The most beautiful email app I\'ve ever used. Dark mode is stunning and animations are buttery smooth.',
    avatar: 'EC',
    rating: 5
  },
]

const floatingEmails = [
  { from: 'Alex Carter', subject: '📊 Q3 Strategy Review', category: 'Work', color: 'blue', delay: 0 },
  { from: 'GitHub', subject: '✅ PR #148 merged', category: 'Updates', color: 'green', delay: 0.3 },
  { from: 'Spotify', subject: '🎵 New Releases Friday', category: 'Promotions', color: 'yellow', delay: 0.6 },
  { from: 'CEO', subject: '🚨 Urgent: Board Meeting', category: 'Important', color: 'red', delay: 0.9 },
]

export default function LandingPage() {
  const { darkMode, toggleDark } = useTheme()
  const navigate = useNavigate()

  const catColors = {
    blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    green: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
    yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
    red: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white overflow-x-hidden">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-purple-600 flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl gradient-text">SmartFilter AI</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {['Features', 'How it Works', 'Pricing'].map(link => (
              <a key={link} href={`#${link.toLowerCase().replace(' ', '-')}`}
                className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                {link}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggleDark} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link to="/login" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 transition-colors">
              Sign in
            </Link>
            <Link to="/register" className="btn-primary text-sm py-2 px-4">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        {/* Animated blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="blob w-96 h-96 bg-primary-400 top-20 -left-20 animation-delay-2000" />
          <div className="blob w-96 h-96 bg-purple-400 top-40 right-0 animation-delay-4000" />
          <div className="blob w-72 h-72 bg-pink-400 bottom-20 left-1/4" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Copy */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-semibold mb-6 border border-primary-200 dark:border-primary-700">
                  <Bot className="w-3.5 h-3.5" />
                  Powered by OpenAI GPT-4
                </span>
                <h1 className="text-5xl md:text-6xl xl:text-7xl font-extrabold leading-tight mb-6">
                  Let AI{' '}
                  <span className="gradient-text">Organize</span>{' '}
                  Your Inbox
                </h1>
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed max-w-lg">
                  Automatically filter, prioritize, summarize, and manage emails with intelligent AI. Say goodbye to inbox chaos forever.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={() => navigate('/register')} className="btn-primary flex items-center justify-center gap-2 text-base py-3 px-7">
                    Start Free Today <ArrowRight className="w-4 h-4" />
                  </button>
                  <button onClick={() => navigate('/login')} className="btn-outline flex items-center justify-center gap-2 text-base py-3">
                    Sign In <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-6 mt-8">
                  <div className="flex -space-x-2">
                    {['A', 'B', 'C', 'D'].map((l, i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-900 bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center text-xs text-white font-bold">
                        {l}
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-bold text-gray-900 dark:text-white">12,000+</span> users organizing smarter
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Right: Floating Email Cards */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative h-[480px] hidden lg:block"
            >
              {floatingEmails.map((email, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{
                    opacity: 1,
                    y: [0, -12, 0],
                  }}
                  transition={{
                    opacity: { duration: 0.5, delay: email.delay },
                    y: { duration: 3 + i * 0.5, repeat: Infinity, delay: email.delay, ease: 'easeInOut' }
                  }}
                  className="glass-card px-4 py-3 absolute w-72 cursor-default"
                  style={{
                    top: `${i * 22 + 2}%`,
                    left: i % 2 === 0 ? '0%' : '12%',
                    zIndex: floatingEmails.length - i
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {email.from[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold truncate">{email.from}</span>
                        <span className={`badge ${catColors[email.color]} ml-2 flex-shrink-0`}>{email.category}</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{email.subject}</p>
                    </div>
                  </div>
                  {/* AI indicator */}
                  <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700 flex items-center gap-1.5 text-xs text-primary-600 dark:text-primary-400">
                    <Bot className="w-3 h-3" />
                    <span>AI classified • 97% confidence</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Category pills */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl font-bold mb-2">Intelligent Categories</h2>
            <p className="text-gray-600 dark:text-gray-400">AI automatically sorts every email into the right place</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="glass-card p-4 text-center cursor-default"
              >
                <div className="text-2xl mb-2">{cat.icon}</div>
                <p className="font-semibold text-sm">{cat.label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{cat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Everything You Need</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              A complete AI-powered inbox management platform built for productivity.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                className="glass-card p-8 flex gap-5"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feat.gradient} flex items-center justify-center flex-shrink-0`}>
                  <feat.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{feat.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Three simple steps to a cleaner inbox</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Connect & Import', desc: 'Sign up and add your emails. SmartFilter works instantly with any email content.', icon: Inbox },
              { step: '02', title: 'AI Analyzes', desc: 'Our GPT-powered engine reads each email, understands context, and classifies it intelligently.', icon: Bot },
              { step: '03', title: 'Stay Organized', desc: 'Enjoy a perfectly sorted inbox with summaries, priority tags, and spam safely blocked.', icon: CheckCircle2 },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                className="glass-card p-8 text-center"
              >
                <div className="text-5xl font-black gradient-text mb-4">{item.step}</div>
                <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Loved by Thousands</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-6"
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-purple-600 to-pink-600" />
        <div className="absolute inset-0 opacity-30">
          <div className="blob w-96 h-96 bg-white/20 top-0 left-0" />
          <div className="blob w-96 h-96 bg-white/20 bottom-0 right-0 animation-delay-2000" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Inbox?</h2>
            <p className="text-xl text-white/80 mb-8">
              Join 12,000+ users who've taken back control of their email with AI.
            </p>
            <button
              onClick={() => navigate('/register')}
              className="bg-white text-primary-600 font-bold text-lg py-4 px-10 rounded-2xl hover:bg-gray-50 transition-all hover:shadow-2xl hover:scale-105 active:scale-95"
            >
              Start for Free <ArrowRight className="inline-block ml-2 w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-purple-600 flex items-center justify-center">
                <Mail className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white">SmartFilter AI</span>
            </div>
            <p className="text-sm">© 2026 SmartFilter AI. All rights reserved.</p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
