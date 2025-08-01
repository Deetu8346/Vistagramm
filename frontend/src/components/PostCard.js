import React, { useState } from 'react';
import { toggleLike, sharePost, formatTimeAgo } from '../services/api';

const PostCard = ({ post, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false); // In a real app, this would come from user state

  const handleLike = async () => {
    if (loading) return;
    
    try {
      setLoading(true);
      const response = await toggleLike(post._id);
      
      if (response.data.success) {
        const updatedPost = {
          ...post,
          likesCount: response.data.data.likesCount
        };
        setIsLiked(response.data.data.isLiked);
        onUpdate(updatedPost);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      // Show a toast or error message in a real app
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (loading) return;
    
    try {
      setLoading(true);
      const response = await sharePost(post._id);
      
      if (response.data.success) {
        const updatedPost = {
          ...post,
          shareCount: response.data.data.shareCount
        };
        onUpdate(updatedPost);
        
        // Copy share URL to clipboard
        const shareUrl = response.data.data.shareUrl;
        if (navigator.share) {
          // Use native sharing if available
          navigator.share({
            title: `Check out this post by @${post.username}`,
            text: post.caption,
            url: shareUrl
          });
        } else if (navigator.clipboard) {
          // Fallback to clipboard
          navigator.clipboard.writeText(shareUrl);
          // Show feedback - in a real app, use a toast
          alert('Share link copied to clipboard!');
        } else {
          // Final fallback
          alert(`Share this post: ${shareUrl}`);
        }
      }
    } catch (error) {
      console.error('Error sharing post:', error);
      // Show error message in a real app
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = (e) => {
    console.error('Image failed to load:', e.target.src);
    e.target.style.display = 'none';
    // Show a placeholder div instead
    const placeholder = document.createElement('div');
    placeholder.style.cssText = `
      width: 100%;
      height: 400px;
      background: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #999;
      font-size: 14px;
    `;
    placeholder.textContent = 'Image unavailable';
    e.target.parentNode.insertBefore(placeholder, e.target);
  };

  return (
    <article className="post-card">
      <div className="post-header">
        <span className="username">@{post.username}</span>
        <span className="timestamp">{formatTimeAgo(post.timestamp)}</span>
      </div>
      
      <img 
        src={post.imageUrl} 
        alt={`Post by ${post.username}`}
        className="post-image"
        onError={handleImageError}
        onLoad={() => console.log('Image loaded successfully:', post.imageUrl)}
        loading="lazy"
        crossOrigin="anonymous"
      />
      
      <div className="post-content">
        <div className="post-actions">
          <button 
            className={`action-btn ${isLiked ? 'liked' : ''}`}
            onClick={handleLike}
            disabled={loading}
            aria-label={isLiked ? 'Unlike post' : 'Like post'}
          >
            {isLiked ? '❤️' : '🤍'}
            <span className="action-count">{post.likesCount}</span>
          </button>
          
          <button 
            className="action-btn"
            onClick={handleShare}
            disabled={loading}
            aria-label="Share post"
          >
            📤
            <span className="action-count">{post.shareCount}</span>
          </button>
        </div>
        
        <div className="post-stats">
          <span>{post.likesCount} {post.likesCount === 1 ? 'like' : 'likes'}</span>
          <span>{post.shareCount} {post.shareCount === 1 ? 'share' : 'shares'}</span>
        </div>
        
        <p className="post-caption">
          <strong>@{post.username}</strong> {post.caption}
        </p>
      </div>
    </article>
  );
};

export default PostCard;