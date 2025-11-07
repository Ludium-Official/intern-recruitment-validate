import React from 'react';

function formatCheckTitle(key) {
  const result = key.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
}

function getCheckEmoji(key) {
  const emojiMap = {
    scamCheck: '🚨',
    validityCheck: '⚙️', 
    sensationalCheck: '🧐',
    dataCollectionCheck: '🕵️'
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

          if (!checkData || !checkData.issues) return null; 

          const issues = checkData.issues;

          return (
            <div className="check-section" key={key}>
              <h3>
                <span role="img" aria-label={key}>
                  {getCheckEmoji(key)} 
                </span>
                {formatCheckTitle(key)}
              </h3>
              
              <ul className="issue-list">
                {issues.map((issue, index) => {
                  
                  const safeKeywords = ['없음', '유효함', '발견되지 않았습니다', '모든 파일이 유효함'];
                  const isSafeIssue = safeKeywords.some(keyword => 
                      issue.includes(keyword)
                  );

                  let itemStyleClass = '';
                  
                  if (isSafeIssue) {
                    itemStyleClass = 'issue-item-validity';
                  } else if (key === 'scamCheck') {
                    itemStyleClass = 'issue-item-scam';
                  } else if (key === 'validityCheck') {
                    itemStyleClass = 'issue-item-scam';
                  } else if (key === 'sensationalCheck') { 
                    itemStyleClass = 'issue-item-quality';
                  } else if (key === 'dataCollectionCheck') {
                    itemStyleClass = 'issue-item-quality';
                  } else {
                    itemStyleClass = 'issue-item-scam';
                  }

                  return (
                    <li key={index} className={`issue-item ${itemStyleClass}`}>
                      <p>{issue}</p>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
        
      </div>
    </div>
  );
} 

export default ReportDisplay;