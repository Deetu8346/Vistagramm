import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    // Handle specific error cases
    if (error.response?.status === 413) {
      error.message = 'File too large. Please choose a smaller image.';
    } else if (error.response?.status === 429) {
      error.message = 'Too many requests. Please wait a moment before trying again.';
    } else if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout. Please check your connection and try again.';
    } else if (!error.response) {
      error.message = 'Network error. Please check your connection.';
    }
    
    return Promise.reject(error);
  }
);

// Posts API functions
export const getPosts = async (page = 1, limit = 20) => {
  try {
    const response = await api.get(`/posts?page=${page}&limit=${limit}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getPost = async (postId) => {
  try {
    const response = await api.get(`/posts/${postId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const createPost = async (postData) => {
  try {
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('username', postData.username);
    formData.append('caption', postData.caption);
    formData.append('image', postData.image);

    const response = await api.post('/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const toggleLike = async (postId) => {
  try {
    const response = await api.post(`/posts/${postId}/like`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const sharePost = async (postId) => {
  try {
    const response = await api.post(`/posts/${postId}/share`);
    return response;
  } catch (error) {
    throw error;
  }
};

// Utility functions
export const validateImageFile = (file) => {
  const maxSize = 10 * 1024 * 1024; // 10MB

  // Be more lenient with file types for camera captures
  if (!file.type.startsWith('image/')) {
    throw new Error('Please select a valid image file');
  }

  if (file.size > maxSize) {
    throw new Error('Image size must be less than 10MB');
  }

  return true;
};

export const formatTimeAgo = (timestamp) => {
  const now = new Date();
  const posted = new Date(timestamp);
  const diffInSeconds = Math.floor((now - posted) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return posted.toLocaleDateString();
};

export default api;