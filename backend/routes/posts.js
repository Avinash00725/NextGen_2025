const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const Notification = require('../models/Notification');

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `image-${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

// Get all community posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'name')
      .populate('comments.user', 'name')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new community post
router.post('/', auth, upload.single('image'), async (req, res) => {
  const { content, video } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : '';

  try {
    const post = new Post({
      user: req.user.id,
      content,
      image,
      video,
    });

    await post.save();
    const populatedPost = await Post.findById(post._id)
      .populate('user', 'name')
      .populate('comments.user', 'name');

    // Emit Socket.IO event
    const io = req.app.get('socketio');
    io.emit('newPost', populatedPost);

    res.status(201).json(populatedPost);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Upvote a post
router.post('/:id/upvote', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.upvotes += 1;
    await post.save();

    const populatedPost = await Post.findById(post._id)
      .populate('user', 'name')
      .populate('comments.user', 'name');

    // Emit Socket.IO event
    const io = req.app.get('socketio');
    io.emit('postUpdated', populatedPost);

    res.json(populatedPost);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Downvote a post
router.post('/:id/downvote', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.downvotes += 1;
    await post.save();

    const populatedPost = await Post.findById(post._id)
      .populate('user', 'name')
      .populate('comments.user', 'name');

    // Emit Socket.IO event
    const io = req.app.get('socketio');
    io.emit('postUpdated', populatedPost);

    res.json(populatedPost);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a comment to a post
router.post('/:id/comment', auth, async (req, res) => {
  const { text } = req.body;

  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.comments.push({ user: req.user.id, text });
    await post.save();

    const populatedPost = await Post.findById(post._id)
      .populate('user', 'name')
      .populate('comments.user', 'name');

    // Create a notification for the post owner
    if (post.user.toString() !== req.user.id) {
      const notification = new Notification({
        user: post.user,
        message: `${populatedPost.user.name} commented on your post: "${text}"`,
      });
      await notification.save();

      // Emit Socket.IO event for the notification
      const io = req.app.get('socketio');
      io.emit('newNotification', notification);
    }

    // Emit Socket.IO event for the post update
    const io = req.app.get('socketio');
    io.emit('postUpdated', populatedPost);

    res.json(populatedPost);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a post (optional, for post owner)
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await post.remove();
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;