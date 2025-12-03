import React, { useState } from 'react';
import FileUploader from '../FileUploader'; 

const UploadView = ({ 
  selectedFiles, 
  isLoading, 
  onFilesSelect, 
  onAnalyze 
}) => {
  const [inputMode, setInputMode] = useState('file');
  const [directCode, setDirectCode] = useState('');

  const handleTabChange = (mode) => {
    setInputMode(mode);
    if (mode === 'text') onFilesSelect([]); 
    if (mode === 'file') setDirectCode('');
  };

  const handleTextChange = (e) => {
    const code = e.target.value;
    setDirectCode(code);
    
    if (code.trim()) {
      const blob = new Blob([code], { type: 'text/plain' });
      const virtualFile = new File([blob], "direct_input_code.js", { type: "text/plain" });
      onFilesSelect([virtualFile]);
    } else {
      onFilesSelect([]);
    }
  };

  return (
    <div className="upload-view">
      
      <div className="input-mode-tabs" style={{ display: 'flex', marginBottom: '20px', borderBottom: '1px solid var(--border-color)' }}>
        <button 
          onClick={() => handleTabChange('file')}
          style={{
            flex: 1,
            padding: '12px',
            background: inputMode === 'file' ? 'var(--card-bg)' : 'transparent',
            border: 'none',
            borderBottom: inputMode === 'file' ? '2px solid var(--ludium-purple)' : 'none',
            fontWeight: inputMode === 'file' ? 'bold' : 'normal',
            cursor: 'pointer',
            color: 'var(--text-color)'
          }}
        >
          📂 파일 업로드
        </button>
        <button 
          onClick={() => handleTabChange('text')}
          style={{
            flex: 1,
            padding: '12px',
            background: inputMode === 'text' ? 'var(--card-bg)' : 'transparent',
            border: 'none',
            borderBottom: inputMode === 'text' ? '2px solid var(--ludium-purple)' : 'none',
            fontWeight: inputMode === 'text' ? 'bold' : 'normal',
            cursor: 'pointer',
            color: 'var(--text-color)'
          }}
        >
          ✍️ 직접 입력
        </button>
      </div>

      {inputMode === 'file' ? (
        <>
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
        </>
      ) : (
        <div className="direct-input-container" style={{ width: '100%' }}>
          <textarea
            value={directCode}
            onChange={handleTextChange}
            placeholder="// 여기에 코드를 직접 붙여넣거나 작성하세요."
            disabled={isLoading}
            style={{
              width: '100%',
              height: '300px',
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--card-bg)',
              color: 'var(--text-color)',
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              resize: 'vertical',
              outline: 'none'
            }}
          />
          <p style={{ fontSize: '0.8rem', color: 'var(--text-color-light)', marginTop: '5px' }}>
            * 직접 입력한 코드는 'direct_input_code.js'라는 가상의 파일명으로 분석됩니다.
          </p>
        </div>
      )}

      <button 
        className="analyze-button"
        onClick={onAnalyze}
        disabled={isLoading || selectedFiles.length === 0}
        style={{ marginTop: '20px' }}
      >
        {isLoading ? "AI가 분석 중입니다..." : "분석하기"}
      </button>
    </div>
  );
};

export default UploadView;