import React from 'react';

const Header = ({ onCreatePost }) => {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="logo">📸 Vistagram</h1>
        <button 
          className="create-btn"
          onClick={onCreatePost}
          aria-label="Create new post"
        >
          + New Post
        </button>
      </div>
    </header>
  );
};

export default Header;