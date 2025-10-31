import React from 'react';

function ReportDisplay({ report }) {
  
  const isFail = report.finalDecision !== 'CLEAN';

  return (
    <div className={`report-container ${isFail ? 'status-fail' : 'status-pass'}`}>
      <div className="report-header">
        <h2>
          {isFail ? '❌ 검증 실패 (Fail)' : '✅ 검증 통과 (Pass)'}
        </h2>
        <p className="report-summary">{report.summary}</p>
      </div>

      <div className="report-body">
        <div className="check-section">
          <h3>
            <span role="img" aria-label="scam">🚨</span> 스캠 / 악성 코드 (Scam Check)
          </h3>
          {report.reportDetails.scamCheck.issues.length === 0 ? (
            <p className="no-issues">발견된 이슈가 없습니다.</p>
          ) : (
            <ul className="issue-list">
              {report.reportDetails.scamCheck.issues.map((issue, index) => (
                <li key={index}>
                  <p>{issue}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="check-section">
          <h3>
            <span role="img" aria-label="validity">⚙️</span> 기본 유효성 (Validity Check)
          </h3>
          {report.reportDetails.validityCheck.issues.length === 0 ? (
            <p className="no-issues">발견된 이슈가 없습니다.</p>
          ) : (
            <ul className="issue-list">
              {report.reportDetails.validityCheck.issues.map((issue, index) => (
                <li key={index}>
                  <p>{issue}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  ); 
} 

export default ReportDisplay;