const Post = require('../models/Post');
const { validationResult } = require('express-validator');

// @desc    Get all posts (timeline)
// @route   GET /api/posts
// @access  Public
const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const posts = await Post.getTimeline(limit, skip);
    const totalPosts = await Post.countDocuments();
    const totalPages = Math.ceil(totalPosts / limit);

    res.status(200).json({
      success: true,
      data: {
        posts,
        pagination: {
          currentPage: page,
          totalPages,
          totalPosts,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error fetching posts'
      }
    });
  }
};

// @desc    Create a new post
// @route   POST /api/posts
// @access  Public
const createPost = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          details: errors.array()
        }
      });
    }

    const { username, caption } = req.body;

    // Check if image was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Image is required'
        }
      });
    }

    // Create new post
    const post = new Post({
      username: username.trim(),
      imageUrl: req.file.path, // Cloudinary URL
      caption: caption.trim(),
      timestamp: new Date()
    });

    const savedPost = await post.save();

    res.status(201).json({
      success: true,
      data: {
        post: savedPost
      },
      message: 'Post created successfully'
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error creating post'
      }
    });
  }
};

// @desc    Get a single post by ID
// @route   GET /api/posts/:id
// @access  Public
const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).select('-__v');

    if (!post) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Post not found'
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        post
      }
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error fetching post'
      }
    });
  }
};

// @desc    Toggle like on a post
// @route   POST /api/posts/:id/like
// @access  Public
const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Post not found'
        }
      });
    }

    // Use IP address as user identifier (in a real app, use authenticated user ID)
    const userIdentifier = req.ip || req.connection.remoteAddress || 'anonymous';
    
    await post.toggleLike(userIdentifier);

    res.status(200).json({
      success: true,
      data: {
        postId: post._id,
        likesCount: post.likesCount,
        isLiked: post.likedBy.includes(userIdentifier)
      },
      message: 'Like toggled successfully'
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error toggling like'
      }
    });
  }
};

// @desc    Increment share count on a post
// @route   POST /api/posts/:id/share
// @access  Public
const sharePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Post not found'
        }
      });
    }

    await post.incrementShare();

    res.status(200).json({
      success: true,
      data: {
        postId: post._id,
        shareCount: post.shareCount,
        shareUrl: `${req.protocol}://${req.get('host')}/api/posts/${post._id}`
      },
      message: 'Post shared successfully'
    });
  } catch (error) {
    console.error('Error sharing post:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Error sharing post'
      }
    });
  }
};

module.exports = {
  getPosts,
  createPost,
  getPost,
  toggleLike,
  sharePost
};