import React from 'react';
import ReportDisplay from '../ReportDisplay'; // 경로 주의

// 헬퍼 함수들 (컴포넌트 내부에 둬도 되고 외부에 둬도 됨)
const getFileBoxClass = (report) => {
  if (!report) return 'status-fail'; 
  switch (report.finalDecision) {
    case 'CLEAN': return 'status-pass';
    case 'CRITICAL_RISK':
    case 'INVALID_FORMAT': return 'status-fail';
    case 'SECURITY_WARNING':
    case 'CONTENT_WARNING': return 'status-warning';
    default: return 'status-fail'; 
  }
};

const getFileBoxIcon = (report) => {
  if (!report) return '❓';
  switch (report.finalDecision) {
    case 'CLEAN': return '🟩';
    case 'CRITICAL_RISK':
    case 'INVALID_FORMAT': return '🟥';
    case 'SECURITY_WARNING':
    case 'CONTENT_WARNING': return '🟨';
    default: return '❓';
  }
};

const ResultView = ({ 
  reportData, 
  selectedFileName, 
  setSelectedFileName, 
  onReset 
}) => {
  
  // 1. 상세 보기 화면 (파일이 선택되었을 때)
  if (selectedFileName) {
    return (
      <div className="result-detail-view">
        {/* 파일명 props 전달 추가됨 */}
        <ReportDisplay 
          report={reportData[selectedFileName]} 
          fileName={selectedFileName}
        />

        {Object.keys(reportData).length === 1 ? (
          <button className="reset-button" onClick={onReset}>
            새로 분석하기
          </button>
        ) : (
          <button className="back-button" onClick={() => setSelectedFileName(null)}>
            &larr; 파일 목록으로 돌아가기
          </button>
        )}
      </div>
    );
  }

  // 2. 전체 목록 요약 화면
  return (
    <div className="result-summary-view">
      <div className="file-summary-container">
        <h3>분석 완료: {Object.keys(reportData).length}개 파일</h3>
        {Object.entries(reportData).map(([fileName, report]) => (
          <button 
            key={fileName} 
            className={`file-summary-box ${getFileBoxClass(report)}`}
            onClick={() => setSelectedFileName(fileName)}
          >
            <span className="file-summary-icon">
              {getFileBoxIcon(report)}
            </span>
            {fileName}
          </button>
        ))}
      </div>
      <button className="reset-button" onClick={onReset}>
        새로 분석하기
      </button>
    </div>
  );
};

export default ResultView;