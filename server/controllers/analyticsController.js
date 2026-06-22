const Email = require('../models/Email');

// GET /api/analytics
const getAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    // Category distribution
    const categoryData = await Email.aggregate([
      { $match: { userId, status: 'inbox' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Stats
    const totalEmails = await Email.countDocuments({ userId, status: 'inbox' });
    const importantEmails = await Email.countDocuments({ userId, category: 'Important' });
    const workEmails = await Email.countDocuments({ userId, category: 'Work' });
    const personalEmails = await Email.countDocuments({ userId, category: 'Personal' });
    const spamEmails = await Email.countDocuments({ userId, category: 'Spam' });
    const aiProcessedEmails = await Email.countDocuments({ userId, aiProcessed: true });

    // Weekly data (last 7 days)
    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const start = new Date(date.setHours(0, 0, 0, 0));
      const end = new Date(date.setHours(23, 59, 59, 999));

      const count = await Email.countDocuments({
        userId,
        createdAt: { $gte: start, $lte: end }
      });

      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      weeklyData.push({ day: days[start.getDay()], count });
    }

    const aiAccuracy = totalEmails > 0 ? Math.round((aiProcessedEmails / totalEmails) * 100) : 0;

    res.json({
      stats: {
        totalEmails,
        importantEmails,
        workEmails,
        personalEmails,
        spamEmails,
        aiAccuracy: `${aiAccuracy}%`
      },
      categoryData: categoryData.map(d => ({ name: d._id, value: d.count })),
      weeklyData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAnalytics };
