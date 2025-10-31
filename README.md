# 1. Ludium AI Program Verification System (AI 프로그램 검증 시스템)

[![Status](https://img.shields.io/badge/status-in_progress-yellowgreen)](https://github.com/Ludium-Official/intern-recruitment-validate)

본 프로젝트는 Ludium의 스폰서 프로그램을 위한 AI 기반 자동 검증 도구 시제품(Prototype)입니다. 사용자가 업로드한 코드 파일(.js, .sol, .json 등)을 Google Gemini AI가 분석하여, '스캠/악성 코드' 여부와 '기본적인 코드 유효성'을 검사하고 리포트를 제공합니다.

---

## 2. 주요 기능

* **다중 파일 업로드:** 사용자가 여러 개의 코드 파일을 드래그 앤 드롭으로 업로드할 수 있습니다.
* **파일 형식 검증:** `.js`, `.sol`, `.json` 등 사전에 정의된 텍스트 기반 파일 형식만 업로드하도록 프론트엔드에서 1차 검증합니다.
* **AI 코드 분석:** 백엔드 서버가 업로드된 모든 코드 텍스트를 취합하여 Google Gemini AI에게 전송, '스캠' 및 '유효성' 분석을 요청합니다.
* **리포트 시각화:** AI의 분석 결과를 `PASS` / `FAIL` 상태 및 상세 이슈 목록으로 구분하여 사용자에게 명확한 UI로 보여줍니다.

## 3. 기술 스택 (Tech Stack)

| 구분 | 기술 |
| :--- | :--- |
| **Frontend** | React (Vite), JavaScript, CSS3 |
| **Backend** | Node.js, Express |
| **AI** | Google Gemini API (`gemini-2.5-flash`) |
| **Tools** | Git, GitHub, Discord, Postman |

## 4. 시스템 아키텍처

본 프로젝트는 Client(React)와 Server(Node.js)가 명확히 분리된 API 기반으로 동작합니다.

![AI 검증 프로젝트 다이어그램](AI%20검증%20프로젝트%20다이어그램.png)

*(참고: `AI 검증 프로젝트 다이어그램.png` 파일이 리포지토리 최상단에 함께 있어야 이미지가 표시됩니다.)*

---

## 5. 로컬 환경에서 실행하기

본 프로젝트는 **Backend(서버)**와 **Frontend(클라이언트)**를 별도로 실행해야 합니다.

### A. Backend (Server) 실행

백엔드 서버(`server.js`)는 `localhost:3000`에서 실행되어야 합니다.

```bash
# a. 백엔드(server.js)가 위치한 폴더로 이동합니다.
cd /path/to/backend-folder

# b. 필요한 라이브러리를 설치합니다.
npm install

# c. .env 파일을 생성하고 Google Gemini API 키를 입력합니다.
# (파일 내용 예시: AI_API_KEY=여러분의_Gemini_API_키)
echo "AI_API_KEY=YOUR_GEMINI_API_KEY_HERE" > .env

# d. 서버를 시작합니다.
node server.js
```
ℹ️ 서버가 JSON 분석 서버가 http://localhost:3000 에서 실행 중입니다. 메시지와 함께 실행되는지 확인하세요.

B. Frontend (Client) 실행
프론트엔드(React 앱)는 localhost:5173 (Vite 기본값)에서 실행됩니다.

```Bash

# a. 프론트엔드(React) 프로젝트 폴더로 이동합니다.
cd /path/to/frontend-folder

# b. 필요한 라이브러리를 설치합니다.
npm install

# c. (필수 확인) src/App.jsx 파일의 API_URL이 백엔드 주소와 일치하는지 확인합니다.
# const API_URL = 'http://localhost:3000/analyze';

# d. 프론트엔드 개발 서버를 시작합니다.
npm run dev
```
ℹ️ 브라우저에서 http://localhost:5173 (Vite 기본 포트)으로 접속하여 UI가 정상적으로 표시되는지 확인하세요.

## 6. API Contract (API 명세)
FE와 BE가 주고받는 핵심 JSON 데이터 구조입니다.

A. FE → BE (Request)
POST /analyze

```JSON

{
  "programMeta": {
    "id": "program-1698715800",
    "title": "User Uploaded Program"
  },
  "codeFiles": [
    {
      "fileName": "test-fail.js",
      "content": "function backupUserData(user) { ... fetch('https://malicious... ... }"
    },
    {
      "fileName": "package.json",
      "content": "{ \"name\": \"test\", ... }"
    }
  ]
}
```
B. BE → FE (Response)
a. 성공 시 (status: "success")
```JSON

{
  "status": "success",
  "analysis": {
    "runId": "analysis-240729-170102389",
    "status": "SUCCESS",
    "processedAt": "2024-07-29T10:30:00.000Z",
    "finalDecision": "SCAM_DETECTED", 
    "summary": "제공된 JavaScript 코드는... 민감한 정보를 'malicious-data-collector.com'으로 전송...",
    "reportDetails": {
      "scamCheck": {
        "issues": [
          "민감한 사용자 토큰 및 지갑 개인 키를 'malicious-data-collector.com'으로 전송합니다..."
        ]
      },
      "validityCheck": {
        "issues": [
          "JSON 구조가 형식적으로 유효합니다.",
          "포함된 JavaScript 코드는 구문적으로 유효합니다."
        ]
      }
    }
  }
}
```
b. 실패 시 (status: "error")
(현재 MVP 범위에서 배제되었으나, 추후 확장 예정)

```JSON

{
  "status": "error",
  "analysis": {
    "status": "FAILED",
    "summary": "AI 서버(Gemini)에 연결하는 중 타임아웃이 발생했습니다."
  }
}
```
---

## 7. 팀원 및 역할
PM / Lead: 장훈

Backend / AI: 김성균

Frontend: 박상우

