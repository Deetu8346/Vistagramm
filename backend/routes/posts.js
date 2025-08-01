const express = require('express');
const router = express.Router();
const {
  getPosts,
  createPost,
  getPost,
  toggleLike,
  sharePost
} = require('../controllers/postController');
const { uploadSingle } = require('../middleware/uploadMiddleware');
const { validateCreatePost, validateObjectId } = require('../middleware/validation');

// @route   GET /api/posts
// @desc    Get all posts (timeline) with pagination
// @access  Public
router.get('/', getPosts);

// @route   POST /api/posts
// @desc    Create a new post with image upload
// @access  Public
router.post('/', 
  uploadSingle('image'), // Handle image upload first
  validateCreatePost,    // Then validate text fields
  createPost
);

// @route   GET /api/posts/:id
// @desc    Get a single post by ID
// @access  Public
router.get('/:id',
  validateObjectId('id'),
  getPost
);

// @route   POST /api/posts/:id/like
// @desc    Toggle like/unlike on a post
// @access  Public
router.post('/:id/like',
  validateObjectId('id'),
  toggleLike
);

// @route   POST /api/posts/:id/share
// @desc    Increment share count and get share URL
// @access  Public
router.post('/:id/share',
  validateObjectId('id'),
  sharePost
);

module.exports = router;