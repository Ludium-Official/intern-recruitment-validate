import React from 'react';

const ErrorView = ({ error, onRetry }) => {
  return (
    <div className="error-container">
      <div className="error-message">
        ⚠️ {error}
      </div>
      <button className="retry-button" onClick={onRetry}>
        🔄 홈 화면으로 돌아가기
      </button>
    </div>
  );
};

export default ErrorView;