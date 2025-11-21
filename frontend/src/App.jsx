import React from 'react';
import './App.css';
import { useLudiumApp } from './hooks/useLudiumApp';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ThemeToggle from './components/ui/ThemeToggle';
import LoadingSpinner from './components/ui/LoadingSpinner';
import UploadView from './components/views/UploadView';
import ResultView from './components/views/ResultView';
import ErrorView from './components/views/ErrorView';

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
        {isLoading && <LoadingSpinner />}

        {error && (
          <ErrorView 
            error={error} 
            onRetry={handleReset} 
          />
        )}

        {!isLoading && !error && reportData && (
          <ResultView 
            reportData={reportData}
            selectedFileName={selectedFileName}
            setSelectedFileName={setSelectedFileName}
            onReset={handleReset}
          />
        )}

        {!isLoading && !error && !reportData && (
          <UploadView 
            selectedFiles={selectedFiles}
            isLoading={isLoading}
            onFilesSelect={handleFilesSelect}
            onAnalyze={handleAnalyze}
          />
        )}
      </main>
      
      <Footer />
    </div>
  );
}

export default App;