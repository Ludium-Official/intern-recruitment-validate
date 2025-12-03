import React, { Suspense, lazy } from 'react';
import './App.css';
import { useLudiumApp } from './hooks/useLudiumApp';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ThemeToggle from './components/ui/ThemeToggle';
import SkeletonLoader from './components/ui/SkeletonLoader';
import UploadView from './components/views/UploadView';
import ErrorView from './components/views/ErrorView';

const ResultView = lazy(() => import('./components/views/ResultView'));

function App() {
  const {
    isDarkMode,
    selectedFiles,
    isLoading,
    reportData,
    fileContents,
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

        {isLoading && <SkeletonLoader />}

        {error && (
          <ErrorView 
            error={error} 
            onRetry={handleReset} 
          />
        )}

        {!isLoading && !error && reportData && (
          <Suspense fallback={<SkeletonLoader />}>
            <ResultView 
              reportData={reportData}
              fileContents={fileContents}
              selectedFileName={selectedFileName}
              setSelectedFileName={setSelectedFileName}
              onReset={handleReset}
            />
          </Suspense>
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