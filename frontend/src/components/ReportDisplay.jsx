import React from 'react';

function formatCheckTitle(key) {
  const result = key.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
}

function getCheckEmoji(key) {
  const emojiMap = {
    securityThreatCheck: '🚨',
    vulnerabilityCheck: '🛡️',
    privacyCheck: '🕵️',
    syntaxCheck: '⚙️',
    codeQualityCheck: '🤔',
    contentCheck: '🧐'
  };

  return emojiMap[key] || '📊'; 
}

const getRiskProps = (decision) => {
  switch (decision) {
    case 'CRITICAL_RISK':
      return { level: '심각 (CRITICAL)', barColor: '#FFFFFF', width: '100%' };
    case 'SECURITY_WARNING':
      return { level: '높음 (HIGH)', barColor: '#FFC107', width: '80%' };
    case 'INVALID_FORMAT':
      return { level: '중간 (MEDIUM)', barColor: '#FFC107', width: '50%' };
    case 'CONTENT_WARNING':
      return { level: '낮음 (LOW)', barColor: '#FFC107', width: '25%' };
    case 'CLEAN':
      return { level: '안전 (CLEAN)', barColor: '#FFFFFF', width: '0%' };
    default:
      return { level: '알 수 없음', barColor: '#FFFFFF', width: '50%' };
  }
}

const getStatusClass = (decision) => {
  switch (decision) {
    case 'CLEAN':
      return 'status-pass';  
    case 'CRITICAL_RISK':
    case 'INVALID_FORMAT':
      return 'status-fail';    
    case 'SECURITY_WARNING':
    case 'CONTENT_WARNING':
      return 'status-warning';     
    default:
      return 'status-fail';
  }
}

function ReportDisplay({ report }) {
  const statusClass = getStatusClass(report.finalDecision); 
  const reportDetails = report.reportDetails;
  const checkKeys = Object.keys(reportDetails);
  const risk = getRiskProps(report.finalDecision);

  return (
    <div className={`report-container ${statusClass}`}>
      <div className="report-header">
        <h2>
          {report.finalDecision === 'CLEAN' ? 
            '✅ 검증 통과 (Pass)' : 
            (report.finalDecision === 'CONTENT_WARNING' || report.finalDecision === 'SECURITY_WARNING' ? 
              '⚠️ 검증 경고 (Warning)' : 
              '❌ 검증 실패 (Fail)')
          }
        </h2>
        
        <p className="report-summary">{report.summary}</p>

        <div className="risk-meter">
          <strong>Risk Level: <span>{risk.level}</span></strong>
          <div className="risk-bar-container">
            <div 
              className="risk-bar" 
              style={{ 
                width: risk.width, 
                backgroundColor: risk.barColor 
              }}
            ></div>
          </div>
        </div>
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
                  
                  const safeKeywords = ['없음', '유효함', '발견되지 않았습니다', '모든 파일이 유효함', '구문적으로 유효합니다'];
                  const isSafeIssue = safeKeywords.some(keyword => 
                      issue.includes(keyword)
                  );

                  let itemStyleClass = '';
                  
                  if (isSafeIssue) {
                    itemStyleClass = 'issue-item-validity';
                  
                  } else if (key === 'securityThreatCheck' || key === 'vulnerabilityCheck' || key === 'syntaxCheck') {
                    itemStyleClass = 'issue-item-scam';
                  
                  } else if (key === 'privacyCheck' || key === 'codeQualityCheck' || key === 'contentCheck') {
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