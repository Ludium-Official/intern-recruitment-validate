import React from 'react';

function formatCheckTitle(key) {
  const result = key.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
}

// --- 헬퍼 함수 2: [수정] 새 6개 key에 맞는 이모지 ---
// BE의 새 6개 항목 키(key)에 맞는 이모지를 매핑합니다.
function getCheckEmoji(key) {
  const emojiMap = {
    securityThreatCheck: '🚨', // 보안 위협 (Scam)
    vulnerabilityCheck: '🛡️', // 취약점 (SQLi, Keys)
    privacyCheck: '🕵️', // 프라이버시 (Data Collection)
    syntaxCheck: '⚙️', // 구문 (Validity)
    codeQualityCheck: '🤔', // 코드 품질 (Logic)
    contentCheck: '🧐' // 부적절한 콘텐츠 (Sensational)
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

// 'App.jsx'로부터 'report' 객체 하나만 props로 받습니다.
function ReportDisplay({ report, fileName }) {
  
  // 'report'가 비정상적(null, undefined)일 경우를 대비한 방어 코드
  // 이 코드가 실행되면 App.jsx가 'reportData'를 잘못 전달한 것입니다.
  if (!report || !report.reportDetails) {
    return (
      <div className="report-container status-fail">
        <div className="report-header">
          <h2>❌ 리포트 데이터 오류</h2>
          <p className="report-summary">리포트 객체(report)가 비어있거나 형식이 잘못되었습니다.</p>
        </div>
      </div>
    );
  }

  // 헬퍼 함수를 호출하여 이 리포트의 CSS 클래스 (pass/fail/warning)를 가져옵니다.
  const statusClass = getStatusClass(report.finalDecision);
  
  // 리포트의 세부 항목(6개) 객체를 가져옵니다.
  const reportDetails = report.reportDetails;
  
  // 'Object.keys()'를 사용해 6개 항목의 key 이름 배열을 만듭니다.
  // (예: ['securityThreatCheck', 'vulnerabilityCheck', ...])
  const checkKeys = Object.keys(reportDetails);
  
  // 헬퍼 함수를 호출하여 게이지 바에 필요한 정보(텍스트, 색상, 너비)를 가져옵니다.
  const risk = getRiskProps(report.finalDecision);

  return (
    // 'statusClass' 변수를 className에 적용하여 헤더 색상을 동적으로 변경합니다.
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
              '❌ 검증 실패 (Fail)') // CRITICAL_RISK, INVALID_FORMAT, default
          }
        </h2>
        
        {/* AI가 생성한 'summary' 텍스트를 표시합니다. */}
        <p className="report-summary">{report.summary}</p>

        {/* (위험도 게이지 바) */}
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
        {/* 'checkKeys' 배열(6개)을 순회하며 각 항목을 렌더링합니다. */}
        {checkKeys.map((key) => {
          
          const checkData = reportDetails[key];
          
          // [중요] BE의 새 스키마에서 'privacyCheck' 등 'issues' 배열이 없는 항목이 있을 수 있습니다.
          // 'issues' 배열이 없는 항목은 UI에 렌더링하지 않고 건너뜁니다.
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
                  
                  // '안전' 키워드 목록 (이 목록에 포함된 텍스트는 '초록색' 줄로 표시됨)
                  const safeKeywords = [
                    '없음', 
                    '유효함', 
                    '발견되지 않았습니다', 
                    '모든 파일이 유효함', 
                    '구문적으로 유효합니다',
                    '모든 구문이 유효합니다',
                    '모든 코드가 유효한 문법을 따르고 있습니다'
                  ];
                  
                  // 'issue' 텍스트에 'safeKeywords' 중 하나라도 포함되어 있는지 확인합니다.
                  const isSafeIssue = safeKeywords.some(keyword => 
                      issue.includes(keyword)
                  );

                  // --- [수정] 새 6개 key에 맞는 스타일링 로직 ---
                  let itemStyleClass = '';
                  
                  // 1. (초록색) 'isSafeIssue'가 true인 경우
                  if (isSafeIssue) {
                    itemStyleClass = 'issue-item-validity';
                  
                  // 2. (빨간색) 'isSafeIssue'=false이고, key가 '심각한' 항목들인 경우
                  } else if (key === 'securityThreatCheck' || key === 'vulnerabilityCheck' || key === 'syntaxCheck') {
                    itemStyleClass = 'issue-item-scam';
                  
                  // 3. (노란색) 'isSafeIssue'=false이고, key가 '경고' 항목들인 경우
                  } else if (key === 'privacyCheck' || key === 'codeQualityCheck' || key === 'contentCheck') {
                    itemStyleClass = 'issue-item-quality';
                  
                  // 4. (Fallback) 모르는 key가 오면 '빨간색'
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