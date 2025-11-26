import React from 'react';

function formatCheckTitle(key) {
  const result = key.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
}

// --- 헬퍼 함수 2: [수정] 새 6개 key에 맞는 이모지 ---
// BE의 새 6개 항목 키(key)에 맞는 이모지를 매핑합니다.
function getCheckEmoji(key) {
  const emojiMap = {
    securityThreatCheck: '🚨',
    vulnerabilityCheck: '🛡️',
    privacyCheck: '🕵️',
    syntaxCheck: '⚙️',
    codeQualityCheck: '🤔',
    contentCheck: '🧐'
  };
  // 모르는 key가 오면 '기타'(📊) 아이콘을 반환합니다.
  return emojiMap[key] || '📊';
}

// --- 헬퍼 함수 3: [수정] 새 5개 finalDecision에 맞는 Risk Level ---
// BE가 보낸 5가지 'finalDecision' 값을 사용자가 볼 'Risk Level' 텍스트와 게이지 바로 '번역'합니다.
const getRiskProps = (decision) => {
  switch (decision) {
    // [신규] 'CRITICAL_RISK' (최고 위험)
    case 'CRITICAL_RISK':
      return { level: '심각 (CRITICAL)', barColor: '#FFFFFF', width: '100%' };
    // [신규] 'SECURITY_WARNING'
    case 'SECURITY_WARNING':
      return { level: '높음 (HIGH)', barColor: '#FFC107', width: '80%' };
    // [신규] 'INVALID_FORMAT' (구문 오류)
    case 'INVALID_FORMAT':
      return { level: '중간 (MEDIUM)', barColor: '#FFC107', width: '50%' };
    // [기존] 'CONTENT_WARNING' (논리/품질/선정성)
    case 'CONTENT_WARNING':
      return { level: '낮음 (LOW)', barColor: '#FFC107', width: '25%' };
    // [기존] 'CLEAN'
    case 'CLEAN':
      return { level: '안전 (CLEAN)', barColor: '#FFFFFF', width: '0%' };
    default:
      // 'finalDecision'이 null이거나 예상치 못한 값이 오면 '알 수 없음'으로 실패 처리
      return { level: '알 수 없음', barColor: '#FFFFFF', width: '50%' };
  }
}

// --- 헬퍼 함수 4: [수정] 새 5개 finalDecision에 맞는 헤더 CSS 클래스 ---
// 'finalDecision' 값에 따라 리포트 헤더의 색상(빨강/노랑/초록)을 결정합니다.
const getStatusClass = (decision) => {
  switch (decision) {
    case 'CLEAN':
      return 'status-pass'; // 초록색
    
    // [신규] CRITICAL_RISK와 INVALID_FORMAT은 'status-fail' (빨간색)
    case 'CRITICAL_RISK':
    case 'INVALID_FORMAT':
      return 'status-fail'; 
    
    // [신규] SECURITY_WARNING와 CONTENT_WARNING은 'status-warning' (노란색)
    case 'SECURITY_WARNING':
    case 'CONTENT_WARNING':
      return 'status-warning';
      
    default:
      return 'status-fail'; // "알 수 없음" 등도 실패(빨간색) 처리
  }
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
      <div className="report-filename">
          📄 파일명: {fileName}
        </div>
        
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

      {/* (리포트 본문) */}
      <div className="report-body">
        {checkKeys.map((key) => {
          
          const checkData = reportDetails[key];
          if (!checkData || !checkData.issues) return null; 

          const issues = checkData.issues;

          return (
            <div className="check-section" key={key}>
              <h3>
                <span role="img" aria-label={key}>
                  {/* [수정] 새 key에 맞는 이모지를 가져옵니다. */}
                  {getCheckEmoji(key)} 
                </span>
                {/* [수정] 새 key를 제목으로 변환합니다. */}
                {formatCheckTitle(key)}
              </h3>
              
              <ul className="issue-list">
                {/* 각 항목의 'issues' 배열을 순회하며 <li> 태그를 렌더링합니다. */}
                {issues.map((issue, index) => {
                  
                  const safeKeywords = ['없음', '유효함', '발견되지 않았습니다', '모든 파일이 유효함', '구문적으로 유효합니다'];
                  const isSafeIssue = safeKeywords.some(keyword => 
                      issue.includes(keyword)
                  );

                  // --- [수정] 새 6개 key에 맞는 스타일링 로직 ---
                  let itemStyleClass = '';
                  
                  // 1. (초록색) 'isSafeIssue'가 true인 경우
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