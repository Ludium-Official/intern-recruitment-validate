import React from 'react';
import './App.css';
import FileUploader from './components/FileUploader';
import ReportDisplay from './components/ReportDisplay';

// BE 배포 주소로 설정 (예시: https://ludium.onrender.com/analyze)
const API_URL = 'http://localhost:3000/analyze';
const ALLOWED_EXTENSIONS = ['.js', '.sol', '.json', '.jsx', '.ts', '.txt', '.md'];

function App() {
  const {
    isDarkMode,
    selectedFiles,
    isLoading,
    reportData,
    error,
    selectedFileName,
    toggleTheme,
    handleFilesSelect,
    handleAnalyze,
    handleReset,
    setSelectedFileName
  } = useLudiumApp();

  return (
    <div className="App">
      <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      
      <Header />

      <main>
        {isLoading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>AI가 코드를 검증하고 있습니다. 잠시만 기다려주세요...</p>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        {!isLoading && !error && reportData && (
          <>  
            <ReportDisplay report={reportData} />
            <button 
              className="reset-button"
              onClick={handleReset}
            >
              새로 분석하기
            </button>
          </>
        )}
        
        {!isLoading && !error && !reportData && (
          <>
            <FileUploader 
              onFilesSelect={handleFilesSelect}
              disabled={isLoading}
            />
            
            {selectedFiles.length > 0 && (
              <div className="file-list">
                <strong>선택된 파일:</strong>
                <ul>
                  {selectedFiles.map(file => (
                    <li key={file.name}>{file.name} ({Math.round(file.size / 1024)} KB)</li>
                  ))}
                </ul>
              </div>
            )}

            <button 
              className="analyze-button"
              onClick={handleAnalyzeClick}
              disabled={isLoading || selectedFiles.length === 0}
            >
              {isLoading ? "AI가 분석 중입니다..." : "분석하기"}
            </button>
          </>
        )}

      </main>
      
      <Footer />
    </div>
  );
}

export default App;