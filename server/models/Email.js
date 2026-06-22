const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    name: { type: String, required: true },
    email: { type: String, required: true }
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  preview: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['Important', 'Work', 'Personal', 'Promotions', 'Social', 'Updates', 'Spam', 'General'],
    default: 'General'
  },
  summary: {
    type: String,
    default: ''
  },
  spamScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  confidenceScore: {
    type: Number,
    min: 0,
    max: 1,
    default: 0
  },
  aiExplanation: {
    type: String,
    default: ''
  },
  sentiment: {
    type: String,
    enum: ['Positive', 'Neutral', 'Negative'],
    default: 'Neutral'
  },
  autoReplySuggestion: {
    type: String,
    default: ''
  },
  isPriority: {
    type: Boolean,
    default: false
  },
  isRead: {
    type: Boolean,
    default: false
  },
  isStarred: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['inbox', 'archived', 'deleted'],
    default: 'inbox'
  },
  aiProcessed: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Text index for search
emailSchema.index({ subject: 'text', 'sender.name': 'text', content: 'text' });

module.exports = mongoose.model('Email', emailSchema);
