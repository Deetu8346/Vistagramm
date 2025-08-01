import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import CreatePost from './components/CreatePost';
import Timeline from './components/Timeline';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import { getPosts } from './services/api';

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreatePost, setShowCreatePost] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getPosts();
      
      if (response.data.success) {
        setPosts(response.data.data.posts);
      } else {
        throw new Error('Failed to load posts');
      }
    } catch (err) {
      console.error('Error loading posts:', err);
      setError(err.response?.data?.error?.message || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (newPost) => {
    // Add new post to the beginning of the timeline
    setPosts(prevPosts => [newPost, ...prevPosts]);
    setShowCreatePost(false);
  };

  const handlePostUpdate = (updatedPost) => {
    // Update post in the timeline (for likes/shares)
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post._id === updatedPost._id ? updatedPost : post
      )
    );
  };

  const toggleCreatePost = () => {
    setShowCreatePost(!showCreatePost);
  };

  if (loading) {
    return (
      <div className="app">
        <Header />
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="app">
      <Header onCreatePost={toggleCreatePost} />
      
      {error && (
        <ErrorMessage 
          message={error} 
          onRetry={loadPosts}
        />
      )}

      {showCreatePost && (
        <CreatePost 
          onPostCreated={handlePostCreated}
          onCancel={toggleCreatePost}
        />
      )}

      <Timeline 
        posts={posts}
        onPostUpdate={handlePostUpdate}
        onRefresh={loadPosts}
      />
    </div>
  );
}

export default App;