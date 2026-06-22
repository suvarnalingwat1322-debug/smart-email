const Email = require('../models/Email');

// GET /api/emails
const getEmails = async (req, res) => {
  try {
    const { category, status, search, page = 1, limit = 20 } = req.query;
    const query = { userId: req.user._id };

    if (category && category !== 'all') query.category = category;
    if (status) query.status = status;
    else query.status = 'inbox';

    if (search) {
      query.$text = { $search: search };
    }

    const emails = await Email.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Email.countDocuments(query);

    res.json({ emails, total, page: Number(page), totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/emails
const createEmail = async (req, res) => {
  try {
    const { sender, subject, content, category, summary, spamScore, confidenceScore, aiExplanation, sentiment, autoReplySuggestion, isPriority } = req.body;

    const preview = content.substring(0, 150) + (content.length > 150 ? '...' : '');

    const email = await Email.create({
      userId: req.user._id,
      sender,
      subject,
      content,
      preview,
      category: category || 'General',
      summary: summary || '',
      spamScore: spamScore || 0,
      confidenceScore: confidenceScore || 0,
      aiExplanation: aiExplanation || '',
      sentiment: sentiment || 'Neutral',
      autoReplySuggestion: autoReplySuggestion || '',
      isPriority: isPriority || false,
      aiProcessed: !!(category && confidenceScore)
    });

    res.status(201).json({ email });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/emails/:id
const deleteEmail = async (req, res) => {
  try {
    const email = await Email.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!email) return res.status(404).json({ message: 'Email not found' });
    res.json({ message: 'Email deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/emails/:id
const updateEmail = async (req, res) => {
  try {
    const email = await Email.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!email) return res.status(404).json({ message: 'Email not found' });
    res.json({ email });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getEmails, createEmail, deleteEmail, updateEmail };
