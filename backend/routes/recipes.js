const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const Recipe = require('../models/Recipe');
const User = require('../models/User');

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

// Get all recipes (for Homepage)
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find().populate('createdBy', 'name');
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's posted recipes (for User Dashboard)
router.get('/user', auth, async (req, res) => {
  try {
    const recipes = await Recipe.find({ createdBy: req.user.id });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new recipe (for Create Recipe page)
router.post('/', auth, upload.single('image'), async (req, res) => {
  const { title, prepTime } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : '';

  try {
    const recipe = new Recipe({
      title,
      image,
      prepTime,
      createdBy: req.user.id,
    });

    await recipe.save();

    // Update user's postedRecipes count
    const user = await User.findById(req.user.id);
    user.postedRecipes += 1;
    user.rank = getUserRank(user.postedRecipes);
    await user.save();

    res.status(201).json(recipe);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a recipe (for User Dashboard)
// Delete a recipe (for User Dashboard)
router.delete('/:id', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    if (recipe.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await recipe.remove();

    // Update user's postedRecipes count
    const user = await User.findById(req.user.id);
    user.postedRecipes -= 1;
    user.rank = getUserRank(user.postedRecipes);
    await user.save();

    res.json({ message: 'Recipe deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to calculate user rank
const getUserRank = (postedRecipes) => {
  if (postedRecipes >= 16) return 'Legendary Chef';
  if (postedRecipes >= 11) return 'Master Chef';
  if (postedRecipes >= 6) return 'Professional Chef';
  if (postedRecipes >= 1) return 'Pro';
  return 'Beginner';
};

module.exports = router;