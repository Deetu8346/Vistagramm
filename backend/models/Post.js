const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    trim: true,
    minlength: [2, 'Username must be at least 2 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required'],
    validate: {
      validator: function(v) {
        // Allow URLs with or without query parameters, and common image hosts
        return /^https?:\/\/.+/i.test(v) && (
          /\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(v) || 
          /unsplash\.com/i.test(v) ||
          /cloudinary\.com/i.test(v) ||
          /images\./i.test(v)
        );
      },
      message: 'Please provide a valid image URL'
    }
  },
  caption: {
    type: String,
    required: [true, 'Caption is required'],
    trim: true,
    maxlength: [500, 'Caption cannot exceed 500 characters']
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true // Index for efficient sorting
  },
  likesCount: {
    type: Number,
    default: 0,
    min: [0, 'Likes count cannot be negative']
  },
  shareCount: {
    type: Number,
    default: 0,
    min: [0, 'Share count cannot be negative']
  },
  // Optional: Track who liked the post (for future features)
  likedBy: [{
    type: String, // Could be IP address or user ID in future
    default: []
  }],
  // Metadata for tracking
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for formatted timestamp
postSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const posted = new Date(this.timestamp);
  const diffInSeconds = Math.floor((now - posted) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return posted.toLocaleDateString();
});

// Index for efficient timeline queries
postSchema.index({ timestamp: -1 });

// Pre-save middleware to update the updatedAt field
postSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.updatedAt = new Date();
  }
  next();
});

// Static method to get timeline posts
postSchema.statics.getTimeline = function(limit = 50, skip = 0) {
  return this.find()
    .sort({ timestamp: -1 })
    .limit(limit)
    .skip(skip)
    .select('-__v')
    .lean();
};

// Instance method to toggle like
postSchema.methods.toggleLike = function(userIdentifier) {
  const hasLiked = this.likedBy.includes(userIdentifier);
  
  if (hasLiked) {
    this.likedBy.pull(userIdentifier);
    this.likesCount = Math.max(0, this.likesCount - 1);
  } else {
    this.likedBy.push(userIdentifier);
    this.likesCount += 1;
  }
  
  return this.save();
};

// Instance method to increment share count
postSchema.methods.incrementShare = function() {
  this.shareCount += 1;
  return this.save();
};

module.exports = mongoose.model('Post', postSchema);