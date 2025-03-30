const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Notification = require('../models/Notification');

// Get notifications for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new notification (e.g., triggered by likes or comments)
router.post('/', auth, async (req, res) => {
  const { message, userId } = req.body;

  try {
    const notification = new Notification({
      user: userId || req.user.id,
      message,
    });

    await notification.save();
    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;