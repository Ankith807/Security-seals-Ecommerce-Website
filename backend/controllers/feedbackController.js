const Feedback = require('../models/Feedback');


exports.submitFeedback = async (req, res) => {
  try {
    const { name, email, subject, message, rating } = req.body;

    const feedback = new Feedback({
      user: req.user ? req.user._id : undefined, // Bind if logged in
      name,
      email,
      subject,
      message,
      rating: rating ? Number(rating) : 5
    });

    const createdFeedback = await feedback.save();

    res.status(201).json({ success: true, data: createdFeedback, message: 'Feedback submitted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.getFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({}).sort({ createdAt: -1 });
    res.json({ success: true, count: feedbacks.length, data: feedbacks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
