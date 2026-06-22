const express = require('express');
const router = express.Router();
const { classifyEmail, summarizeEmail, detectSpam } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/classify', classifyEmail);
router.post('/summarize', summarizeEmail);
router.post('/spam-detect', detectSpam);

module.exports = router;
