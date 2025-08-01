const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const path = require('path');
const fs = require('fs');

// Check if Cloudinary is properly configured
const isCloudinaryConfigured = () => {
  return cloudinary.cloudinary.config().cloud_name && 
         cloudinary.cloudinary.config().cloud_name !== 'demo' &&
         cloudinary.cloudinary.config().api_key &&
         cloudinary.cloudinary.config().api_key !== 'your_api_key';
};

// Local storage for development
const localStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, 'vistagram-' + uniqueSuffix + ext);
  }
});

// Cloudinary storage for production
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary.cloudinary,
  params: {
    folder: 'vistagram-posts',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      {
        width: 1080,
        height: 1080,
        crop: 'limit',
        quality: 'auto:good',
        fetch_format: 'auto'
      }
    ]
  }
});

// Choose storage based on configuration
const storage = isCloudinaryConfigured() ? cloudinaryStorage : localStorage;

// File filter function
const fileFilter = (req, file, cb) => {
  // Check file type
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1 // Only one file at a time
  }
});

// Error handling wrapper for multer
const uploadSingle = (fieldName) => {
  return (req, res, next) => {
    upload.single(fieldName)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // Multer-specific errors
        return res.status(400).json({
          success: false,
          error: {
            message: `Upload error: ${err.message}`,
            code: err.code
          }
        });
      } else if (err) {
        // Other errors (like file filter errors)
        return res.status(400).json({
          success: false,
          error: {
            message: err.message
          }
        });
      }

      // Handle local storage URLs
      if (req.file && !isCloudinaryConfigured()) {
        // Create a local URL for the uploaded file
        const protocol = req.protocol;
        const host = req.get('host');
        req.file.path = `${protocol}://${host}/uploads/${req.file.filename}`;
      }

      next();
    });
  };
};

module.exports = {
  uploadSingle
};