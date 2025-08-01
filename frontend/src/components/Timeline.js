import React from 'react';
import PostCard from './PostCard';

const Timeline = ({ posts, onPostUpdate, onRefresh }) => {
  if (!posts || posts.length === 0) {
    return (
      <div className="timeline">
        <div className="refresh-container">
          <button className="refresh-btn" onClick={onRefresh}>
            🔄 Refresh Feed
          </button>
        </div>
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
          <h3>No posts yet!</h3>
          <p>Be the first to share something amazing.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="timeline">
      <div className="refresh-container">
        <button className="refresh-btn" onClick={onRefresh}>
          🔄 Refresh Feed
        </button>
      </div>
      
      <div className="posts-container">
        {posts.map(post => (
          <PostCard 
            key={post._id} 
            post={post} 
            onUpdate={onPostUpdate}
          />
        ))}
      </div>
      
      {posts.length >= 20 && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          <p>That's all for now! Create a new post to see more content.</p>
        </div>
      )}
    </main>
  );
};

export default Timeline;