import React, { useEffect } from 'react';
import ReportDisplay from '../ReportDisplay'; 
import CodeViewer from './CodeViewer';
import { exportToPDF } from '../../utils/pdfUtils';

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
  
  const fileNames = Object.keys(reportData);

  useEffect(() => {
    if (!selectedFileName && fileNames.length > 0) {
      setSelectedFileName(fileNames[0]);
    }
  }, [selectedFileName, fileNames, setSelectedFileName]);

  if (!selectedFileName) return null;

  const currentCode = fileContents ? fileContents[selectedFileName] : "";
  const currentReport = reportData[selectedFileName];

  const handleDownloadPdf = () => {
    exportToPDF('capture-area', `Ludium_Report_${selectedFileName}.pdf`);
  };

  return (
    <div className="result-view-container">
      
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
              <span className={`tab-status-dot ${statusClass}`}></span>
              {fileName}
            </button>
          );
        })}
      </div>

      <div id="capture-area" className="result-detail-view" style={{ padding: '20px', backgroundColor: 'var(--bg-color)' }}>
        <div className="split-container">
          <div className="split-pane code-pane">
            <CodeViewer 
              code={currentCode} 
              fileName={selectedFileName} 
            />
          </div>

          <div className="split-pane report-pane">
            <ReportDisplay 
              report={currentReport} 
              fileName={selectedFileName}
            />
          </div>
        </div>
      </div>

      <div className="detail-actions">
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