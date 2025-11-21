import React from 'react';
import FileUploader from '../FileUploader'; // 경로 주의 (components/FileUploader.jsx)

const UploadView = ({ 
  selectedFiles, 
  isLoading, 
  onFilesSelect, 
  onAnalyze 
}) => {
  return (
    <div className="upload-view">
      <FileUploader 
        onFilesSelect={onFilesSelect}
        disabled={isLoading}
      />
      
      {selectedFiles.length > 0 && (
        <div className="file-list">
          <strong>선택된 파일:</strong>
          <ul>
            {selectedFiles.map((file, index) => (
              <li key={`${file.name}-${index}`}>
                {file.name} ({Math.round(file.size / 1024)} KB)
              </li>
            ))}
          </ul>
        </div>
      )}

      <button 
        className="analyze-button"
        onClick={onAnalyze}
        disabled={isLoading || selectedFiles.length === 0}
      >
        {isLoading ? "AI가 분석 중입니다..." : "분석하기"}
      </button>
    </div>
  );
};

export default UploadView;