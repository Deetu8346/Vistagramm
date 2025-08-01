import React, { useState, useRef, useEffect } from 'react';
import { createPost, validateImageFile } from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const CreatePost = ({ onPostCreated, onCancel }) => {
  const [formData, setFormData] = useState({
    username: '',
    caption: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState(null);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Cleanup camera on component unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageSelect = (file) => {
    try {
      validateImageFile(file);
      setFormData(prev => ({ ...prev, image: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
      
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // Camera functionality
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        } 
      });
      setStream(mediaStream);
      setShowCamera(true);
      setError(null);
      
      // Wait for next tick to ensure DOM is updated, then set video stream
      setTimeout(() => {
        if (videoRef.current && mediaStream) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play().catch(e => console.log('Video play error:', e));
        }
      }, 100);
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Cannot access camera. Please check permissions or use file upload.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (blob) {
        // Create a File object from the blob
        const file = new File([blob], `camera-capture-${Date.now()}.jpg`, {
          type: 'image/jpeg',
          lastModified: Date.now()
        });

        handleImageSelect(file);
        stopCamera();
      }
    }, 'image/jpeg', 0.8);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username.trim()) {
      setError('Please enter a username');
      return;
    }
    
    if (!formData.caption.trim()) {
      setError('Please enter a caption');
      return;
    }
    
    if (!formData.image) {
      setError('Please select an image');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('Creating post with data:', {
        username: formData.username,
        caption: formData.caption,
        imageType: formData.image?.type,
        imageSize: formData.image?.size
      });

      const response = await createPost(formData);
      
      if (response.data.success) {
        console.log('Post created successfully:', response.data.data.post);
        onPostCreated(response.data.data.post);
        // Reset form
        setFormData({ username: '', caption: '', image: null });
        setImagePreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        throw new Error('Failed to create post');
      }
    } catch (err) {
      console.error('Error creating post:', err);
      setError(err.response?.data?.error?.message || err.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-modal" onClick={(e) => e.target.className === 'create-post-modal' && onCancel()}>
      <div className="create-post-content">
        <div className="modal-header">
          <h2 className="modal-title">Create New Post</h2>
          <button 
            className="close-btn" 
            onClick={onCancel}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {error && <ErrorMessage message={error} />}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter your username"
              maxLength={30}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="caption" className="form-label">Caption</label>
            <textarea
              id="caption"
              name="caption"
              value={formData.caption}
              onChange={handleInputChange}
              className="form-textarea"
              placeholder="Write a caption..."
              maxLength={500}
              required
            />
            <small style={{ color: '#666', fontSize: '0.8rem' }}>
              {formData.caption.length}/500 characters
            </small>
          </div>

          <div className="form-group">
            <label className="form-label">Image</label>
            
            {/* Camera and File Upload Options */}
            <div className="upload-options">
              <button
                type="button"
                className="btn btn-secondary camera-btn"
                onClick={startCamera}
                disabled={loading || showCamera}
              >
                📸 Take Photo
              </button>
              <span style={{ margin: '0 10px', color: '#666' }}>or</span>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading || showCamera}
              >
                📁 Choose File
              </button>
            </div>

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              accept="image/*"
              style={{ display: 'none' }}
              aria-label="Select image file"
            />

            {/* Camera Interface */}
            {showCamera && (
              <div className="camera-interface">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="camera-video"
                />
                <canvas
                  ref={canvasRef}
                  style={{ display: 'none' }}
                />
                <div className="camera-controls">
                  <button
                    type="button"
                    className="btn btn-primary capture-btn"
                    onClick={capturePhoto}
                  >
                    📸 Capture
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={stopCamera}
                  >
                    ❌ Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Drag and Drop Area (only when no camera) */}
            {!showCamera && !imagePreview && (
              <div 
                className={`file-upload-area ${dragOver ? 'dragover' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="upload-icon">📷</div>
                <p className="upload-text">Or drag and drop an image here</p>
                <p className="upload-hint">Supports: JPEG, PNG, GIF, WebP (max 10MB)</p>
              </div>
            )}

            {imagePreview && (
              <div className="image-preview">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="preview-image"
                  onLoad={() => console.log('Preview image loaded successfully')}
                  onError={(e) => console.error('Preview image failed to load:', e)}
                />
                <button
                  type="button"
                  className="remove-image"
                  onClick={removeImage}
                  aria-label="Remove image"
                >
                  ×
                </button>
                <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
                  Image ready for upload: {formData.image?.name || 'Camera capture'}
                </div>
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading || !formData.username.trim() || !formData.caption.trim() || !formData.image}
            >
              {loading ? <LoadingSpinner message="" /> : 'Share Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;