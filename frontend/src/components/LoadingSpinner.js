import React from 'react';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="loading-container">
      <div className="spinner" aria-label="Loading"></div>
      <p className="loading-text">{message}</p>
    </div>
  );
};

export default LoadingSpinner;