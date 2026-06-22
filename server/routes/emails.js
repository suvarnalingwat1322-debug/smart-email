const express = require('express');
const router = express.Router();
const { getEmails, createEmail, deleteEmail, updateEmail } = require('../controllers/emailController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getEmails)
  .post(createEmail);

router.route('/:id')
  .delete(deleteEmail)
  .patch(updateEmail);

module.exports = router;
