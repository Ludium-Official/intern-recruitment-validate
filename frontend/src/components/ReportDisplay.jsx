import React from 'react';

function formatCheckTitle(key) {
  const result = key.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
}

function getCheckEmoji(key) {
  const emojiMap = {
    scamCheck: '🚨',
    validityCheck: '⚙️', 
    performanceCheck: '🚀',
    securityCheck: '🛡️',
  };
  return emojiMap[key] || '📊';
}

function ReportDisplay({ report }) {
  
  const isFail = report.finalDecision !== 'CLEAN';
  const reportDetails = report.reportDetails;
  const checkKeys = Object.keys(reportDetails);

  return (
    <div className={`report-container ${isFail ? 'status-fail' : 'status-pass'}`}>
      <div className="report-header">
        <h2>
          {isFail ? '❌ 검증 실패 (Fail)' : '✅ 검증 통과 (Pass)'}
        </h2>
        <p className="report-summary">{report.summary}</p>
      </div>

      <div className="report-body">
        {checkKeys.map((key) => {
          const checkData = reportDetails[key];

          if (!checkData || !checkData.issues) {
            return null; 
          }

          const issues = checkData.issues;
          const noIssues = issues.length === 0 || (issues.length === 1 && issues[0].toLowerCase() === '없음'); 

          return (
            <div className="check-section" key={key}>
              <h3>
                <span role="img" aria-label={key}>
                  {getCheckEmoji(key)}
                </span>
                {formatCheckTitle(key)}
              </h3>
              
              {noIssues ? (
                <p className="no-issues">발견된 이슈가 없습니다.</p>
              ) : (
                <ul className="issue-list">
                  {issues.map((issue, index) => (
                    <li key={index} className={`issue-item issue-item-${key}`}>
                      <p>{issue}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
        
      </div>
    </div>
  );
} 

export default ReportDisplay;