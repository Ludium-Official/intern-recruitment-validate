import React from 'react';

const SkeletonLoader = () => {
  return (
    <div className="skeleton-container">
      <div className="skeleton-tabs">
        <div className="skeleton skeleton-tab"></div>
        <div className="skeleton skeleton-tab"></div>
        <div className="skeleton skeleton-tab"></div>
      </div>

      <div className="skeleton-split">
        
        <div className="skeleton-pane">

          <div className="skeleton skeleton-line short" style={{ marginBottom: '20px', height: '20px' }}></div>
          {[...Array(15)].map((_, i) => (
            <div 
              key={`code-${i}`} 
              className={`skeleton skeleton-line ${i % 3 === 0 ? 'short' : i % 2 === 0 ? 'medium' : ''}`}
            ></div>
          ))}
        </div>

        <div className="skeleton-pane">
          <div className="skeleton skeleton-line short" style={{ margin: '0 auto 20px auto', height: '30px' }}></div>
          <div className="skeleton skeleton-line medium" style={{ margin: '0 auto 30px auto' }}></div>
          
          {[...Array(4)].map((_, i) => (
            <div key={`report-${i}`} style={{ marginTop: '20px' }}>
              <div className="skeleton skeleton-line short" style={{ marginBottom: '10px' }}></div>
              <div className="skeleton skeleton-line" style={{ height: '60px', borderRadius: '8px' }}></div>
            </div>
          ))}
        </div>
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-color-light)' }}>
        <p>AI가 코드를 정밀 분석 중입니다...</p>
        <small style={{ fontSize: '0.8rem', opacity: 0.7 }}>
          (서버 상태에 따라 몇 분 정도 소요될 수 있습니다)
        </small>
      </div>
    </div>
  );
};

export default SkeletonLoader;