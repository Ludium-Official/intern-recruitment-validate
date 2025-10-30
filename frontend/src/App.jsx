import React, { useState } from 'react';
import './App.css';
import FileUploader from './components/FileUploader';
import ReportDisplay from './components/ReportDisplay';

const API_URL = 'http://localhost:3000/analyze';

const ALLOWED_EXTENSIONS = ['.js', '.sol', '.json', '.jsx', '.ts', '.txt', '.md'];

function App() {
  // React의 '상태(state)'를 4개 만듦
  // 1. 'selectedFiles': 사용자가 선택한 파일의 목록을 '기억'하는 변수
  const [selectedFiles, setSelectedFiles] = useState([]);
  
  // 2. 'isLoading': 현재 '분석하기' 버튼을 누르고 서버의 응답을 '기다리는 중'인지(true/false) '기억'하는 변수
  const [isLoading, setIsLoading] = useState(false);

  // 3. 'reportData': 백엔드(BE)로부터 받은 '최종 리포트 JSON' 데이터를 '기억'하는 변수
  const [reportData, setReportData] = useState(null);

  // 4. 'error': "파일을 선택하세요" 같은 오류 메시지를 '기억'하는 변수
  const [error, setError] = useState(null);

  // 'FileUploader' 컴포넌트가 파일 선택을 완료했을 때 실행될 '함수'
  const handleFilesSelect = (files) => {
    setError(null);  // 이전 오류 지우기
    setReportData(null); // 이전 리포트 지우기
    
    let invalidFileFound = false; // 잘못된 형식의 파일이 있는지 체크
    const validFiles = [];
    
    // 모든 파일 순회하며 확장자 검사
    for (const file of files) {
      // file.name에서 마지막 '.' 이후의 문자열(확장자)을 소문자로 가져옴
      const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
      if (ALLOWED_EXTENSIONS.includes(extension)) {
        validFiles.push(file); // 허용된 파일이면 배열에 추가
      } else {
        invalidFileFound = true; // 허용되지 않은 파일 발견
      }
    }

    // 잘못된 파일이 하나라도 있으면, 사용자가 요청한 오류 메시지 표시
    if (invalidFileFound) {
      setError("잘못된 형식의 파일을 업로드 하였습니다. 파일 형식을 확인해주세요. (.js, .sol, .json 등)");
      setSelectedFiles([]); // 파일 선택 초기화
    } else {
      // 모든 파일이 유효하면 상태에 저장
      setSelectedFiles(validFiles);
    }
  };

  // '분석하기' 버튼을 클릭했을 때 실행될 '메인 함수'
  const handleAnalyzeClick = async () => {
    // 파일 선택 유효성 검사
    if (selectedFiles.length === 0) {
      // handleFilesSelect에서 이미 오류를 처리했을 수 있으므로, 
      // error 상태가 비어있을 때만 이 메시지를 띄웁니다.
      if (!error) { 
        setError("최소 1개 이상의 파일을 업로드해야 합니다.");
      }
      return;
    }
    
    // 2. 상태 초기화
    setIsLoading(true);
    setError(null);
    setReportData(null);

    // 3. 선택된 파일들을 읽어 Promise 배열로 만듦
    const fileReadPromises = selectedFiles.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => resolve({
          fileName: file.name, // 파일 이름
          content: reader.result // 파일 텍스트 내용
        });
        reader.onerror = (error) => reject(error);
      });
    });

    // 4. API 요청 및 오류 처리
    try {
      // 모든 파일 읽기가 완료될 때까지 대기
      const codeFiles = await Promise.all(fileReadPromises);

      // 백엔드로 전송할 JSON 본문 조립
      const requestBody = {
        programMeta: {
          id: `program-${Date.now()}`,
          title: "User Uploaded Program"
        },
        codeFiles: codeFiles // 파일 이름 및 내용 배열
      };
      
      console.log("--- [FE] API Request (FE > BE) ---");
      console.log(JSON.stringify(requestBody, null, 2));
      console.log("---------------------------------");

      // 실제 백엔드 API 호출
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody) // 조립된 JSON 본문 전송
      });

      const responseJson = await response.json();

      if (!response.ok || responseJson.status !== 'success') {
        const errorSummary = responseJson.analysis ? responseJson.analysis.summary : `API 호출 실패: ${response.statusText}`;
        throw new Error(errorSummary);
      }
      
      console.log("--- [FE] API Response (BE > FE) ---");
      console.log(responseJson);
      console.log("---------------------------------");
  
      // 성공 시, 결과 데이터를 상태에 저장
      setReportData(responseJson.analysis);

    } catch (err) {
      // 파일 읽기 또는 API 호출 중 오류 발생 시
      console.error("파일 읽기 또는 분석 중 오류:", err);
      setError(`분석 중 오류가 발생했습니다: ${err.message}`);
    } finally {
      // 성공하든 실패하든 로딩 상태 해제
      setIsLoading(false);
    }
  };

  // 화면에 그릴 HTML(JSX)
  return (
    <div className="App">
      <header className="app-header">
        <h1> Ludium Verification System </h1>
        <p>코드를 업로드하여 '스캠' 및 '기본 유효성'을 검사합니다.</p>
      </header>

      <main>
        <FileUploader 
          onFilesSelect={handleFilesSelect}
          disabled={isLoading}
        />

        {/* 선택된 파일 목록 표시 */}
        {selectedFiles.length > 0 && !isLoading && (
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

        {/* 오류 메시지 표시 */}
        {error && <div className="error-message">{error}</div>}

        {/* 로딩 스피너 표시 */}
        {isLoading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>AI가 코드를 검증하고 있습니다. 잠시만 기다려주세요...</p>
          </div>
        )}
        
        {/* 분석 결과 리포트 표시 */}
        {reportData && !isLoading && (
          <ReportDisplay report={reportData} />
        )}
      </main>
      
      <footer className="app-footer">
        © 2025 Ludium. All rights reserved.
      </footer>
    </div>
  );
}

export default App;