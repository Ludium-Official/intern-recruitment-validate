import React, { useEffect } from 'react';
import ReportDisplay from '../ReportDisplay'; 
import CodeViewer from './CodeViewer';
import { exportToPDF } from '../../utils/pdfUtils';

// 파일 상태에 따른 점 색상 반환 (탭에 표시할 점)
const getStatusDotClass = (report) => {
  if (!report) return 'fail';
  switch (report.finalDecision) {
    case 'CLEAN': return 'pass';
    case 'CRITICAL_RISK':
    case 'INVALID_FORMAT': return 'fail';
    case 'SECURITY_WARNING':
    case 'CONTENT_WARNING': return 'warn';
    default: return 'fail';
  }
};

const ResultView = ({ 
  reportData, 
  fileContents, 
  selectedFileName, 
  setSelectedFileName, 
  onReset 
}) => {
  
  // 모든 파일 이름 목록 추출
  const fileNames = Object.keys(reportData);

  // [자동 선택 로직]
  // 만약 선택된 파일이 없다면(null), 자동으로 첫 번째 파일을 선택하도록 설정
  useEffect(() => {
    if (!selectedFileName && fileNames.length > 0) {
      setSelectedFileName(fileNames[0]);
    }
  }, [selectedFileName, fileNames, setSelectedFileName]);

  // 방어 코드: 아직 선택된 파일이 설정 안 됐을 때 깜빡임 방지
  if (!selectedFileName) return null;

  // 현재 보고 있는 리포트 데이터 등 추출
  const currentCode = fileContents ? fileContents[selectedFileName] : "";
  const currentReport = reportData[selectedFileName];

  // PDF 다운로드 버튼 핸들러
  const handleDownloadPdf = () => {
    // 캡처할 영역의 ID('capture-area')와 저장할 파일명 전달
    exportToPDF('capture-area', `Ludium_Report_${selectedFileName}.pdf`);
  };

  return (
    <div className="result-view-container">
      
      {/* 상단 탭 (Tab) 영역 */}
      <div className="file-tabs-container">
        {fileNames.map((fileName) => {
          const report = reportData[fileName];
          const statusClass = getStatusDotClass(report);
          const isActive = fileName === selectedFileName;

          return (
            <button
              key={fileName}
              className={`tab-button ${isActive ? 'active' : ''}`}
              onClick={() => setSelectedFileName(fileName)}
            >
              {/* 파일 상태를 나타내는 작은 점 (초록/빨강/노랑) */}
              <span className={`tab-status-dot ${statusClass}`}></span>
              {fileName}
            </button>
          );
        })}
      </div>

      <div id="capture-area" className="result-detail-view" style={{ padding: '20px', backgroundColor: 'var(--bg-color)' }}>
        <div className="split-container">
          {/* 왼쪽: 코드 뷰어 */}
          <div className="split-pane code-pane">
            <CodeViewer 
              code={currentCode} 
              fileName={selectedFileName} 
            />
          </div>

          {/* 오른쪽: 리포트 디스플레이 */}
          <div className="split-pane report-pane">
            <ReportDisplay 
              report={currentReport} 
              fileName={selectedFileName}
            />
          </div>
        </div>
      </div>

      {/* 하단 액션 버튼 영역 */}
      <div className="detail-actions">
        {/* [추가] PDF 다운로드 버튼 */}
        <button className="export-button" onClick={handleDownloadPdf}>
          📄 PDF로 리포트 저장
        </button>

        <button className="reset-button" onClick={onReset}>
          새로운 파일 분석하기
        </button>
      </div>
    </div>
  );
};

export default ResultView;