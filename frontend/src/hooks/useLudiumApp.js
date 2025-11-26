import { useState, useEffect } from 'react';
import { analyzeCode } from '../services/apiService';
import { filterValidFiles, readAllFiles } from '../utils/fileUtils';

export const useLudiumApp = () => {
  // --- 상태 초기화 ---
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('ludium-theme');
    return savedTheme === 'dark'; // 기본값: false (Light Mode)
  });

  const [reportData, setReportData] = useState(() => {
    const savedReport = sessionStorage.getItem('ludium-report-data');
    return savedReport ? JSON.parse(savedReport) : null;
  });

  const [selectedFileName, setSelectedFileName] = useState(() => {
    return sessionStorage.getItem('ludium-selected-file') || null;
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Effects ---
  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
    localStorage.setItem('ludium-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    if (reportData) {
      sessionStorage.setItem('ludium-report-data', JSON.stringify(reportData));
    } else {
      sessionStorage.removeItem('ludium-report-data');
    }
  }, [reportData]);

  useEffect(() => {
    if (selectedFileName) {
      sessionStorage.setItem('ludium-selected-file', selectedFileName);
    } else {
      sessionStorage.removeItem('ludium-selected-file');
    }
  }, [selectedFileName]);

  // --- Actions  ---
  const toggleTheme = () => setIsDarkMode(prev => !prev);

  const handleFilesSelect = (files) => {
    setError(null);
    setReportData(null);
    setSelectedFileName(null);
    
    const validFiles = filterValidFiles(files);

    if (validFiles.length !== files.length) {
      setError("잘못된 형식의 파일을 업로드 하였습니다. 파일 형식을 확인해주세요. (.js, .sol, .json 등)");
      setSelectedFiles([]);
    } else {
      setSelectedFiles(validFiles);
    }
  };

  const handleAnalyze = async () => {
    if (selectedFiles.length === 0) { 
        setError("최소 1개 이상의 파일을 업로드해야 합니다.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setReportData(null);
    setSelectedFileName(null); 

    try {
      const codeFiles = await readAllFiles(selectedFiles);
      let analysisMap = await analyzeCode(codeFiles);
      
      if (!analysisMap || Object.keys(analysisMap).length === 0) {
        throw new Error("AI가 유효한 분석 결과를 반환하지 못했습니다.");
      }

      if (analysisMap.finalDecision || analysisMap.runId) {
        const firstFileName = codeFiles[0]?.fileName || "unknown_file.js";
        analysisMap = {
          [firstFileName]: analysisMap
        };
      }

      const fileNames = Object.keys(analysisMap);
      setReportData(analysisMap);

      if (fileNames.length === 1) {
        setSelectedFileName(fileNames[0]);
      }

    } catch (err) {
      setError(`분석 중 오류가 발생했습니다: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFiles([]);
    setReportData(null);
    setSelectedFileName(null);
    setError(null);
    sessionStorage.removeItem('ludium-report-data');
    sessionStorage.removeItem('ludium-selected-file');
  };

  return {
    // State
    isDarkMode,
    selectedFiles,
    isLoading,
    reportData,
    error,
    selectedFileName,
    // Actions
    toggleTheme,
    handleFilesSelect,
    handleAnalyze,
    handleReset,
    setSelectedFileName
  };
};