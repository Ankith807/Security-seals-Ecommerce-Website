const express = require('express');
const router = express.Router();
const { submitFeedback, getFeedback } = require('../controllers/feedbackController');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .post(submitFeedback)
  .get(protect, authorize('admin'), getFeedback);

module.exports = router;
