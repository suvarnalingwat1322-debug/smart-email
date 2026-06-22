# Smart Email Filter AI 🚀

A modern, full-stack AI-powered email management platform.

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + Vite + Tailwind CSS + Framer Motion |
| Backend | Node.js + Express.js + MongoDB |
| Auth | JWT (JSON Web Tokens) |
| AI Engine | OpenAI GPT-4o-mini |
| Charts | Chart.js + react-chartjs-2 |

---

## Quick Start

### 1. Start the Backend

```bash
cd server
npm install
# Copy .env.example to .env and fill in your values
cp .env.example .env
node index.js
```

The server runs at **http://localhost:5000**

### 2. Start the Frontend

```bash
cd client
npm install
npm run dev
```

The app opens at **http://localhost:5173**

---

## Environment Variables (server/.env)

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/smart-email-filter
JWT_SECRET=your_super_secret_key
OPENAI_API_KEY=sk-your-openai-key-here
```

> **Note:** The app works without a MongoDB or OpenAI key using intelligent mock data and pattern-based AI classification.

---

## Features

- ✅ AI Email Classification (7 categories)
- ✅ Smart Spam Detection
- ✅ AI-powered Email Summarization
- ✅ Sentiment Analysis
- ✅ Auto-reply Suggestions
- ✅ Analytics Dashboard (Pie, Bar, Line charts)
- ✅ Dark / Light Mode
- ✅ JWT Authentication (Register / Login)
- ✅ Animated Gmail-inspired Inbox
- ✅ Responsive Design (Mobile-first)
- ✅ Glassmorphism UI

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/emails` | List emails |
| POST | `/api/emails` | Add email |
| PATCH | `/api/emails/:id` | Update email |
| DELETE | `/api/emails/:id` | Delete email |
| POST | `/api/ai/classify` | Classify email |
| POST | `/api/ai/summarize` | Summarize email |
| POST | `/api/ai/spam-detect` | Detect spam |
| GET | `/api/analytics` | Get analytics |

---

## Project Structure

```
smart email/
├── client/                 ← React + Vite Frontend
│   ├── src/
│   │   ├── pages/          ← All page components
│   │   ├── components/     ← Reusable components
│   │   ├── context/        ← Auth & Theme context
│   │   └── utils/          ← API service layer
│   └── package.json
│
└── server/                 ← Node.js + Express Backend
    ├── controllers/        ← Route handlers
    ├── models/             ← Mongoose models
    ├── routes/             ← Express routers
    ├── middleware/         ← Auth middleware
    └── index.js
```

---

Built with ❤️ for hackathons, portfolios, and final-year projects.
