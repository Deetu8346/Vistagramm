import React from 'react';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="error-container">
      <p className="error-message">{message}</p>
      {onRetry && (
        <button 
          className="retry-btn"
          onClick={onRetry}
          aria-label="Retry action"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;