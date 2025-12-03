# 🛡️ Ludium AI Verification System

> **스마트 컨트랙트 및 코드 보안 위협을 실시간으로 탐지하는 AI 기반 검증 솔루션**

[![Project Status](https://img.shields.io/badge/Status-Completed-success)](https://github.com/Ludium-Official/intern-recruitment-validate)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Node](https://img.shields.io/badge/Node.js-v18.0.0%2B-green)

## 📖 프로젝트 소개 (Introduction)
**Ludium AI Verification System**은 블록체인 및 소프트웨어 소스 코드에 잠재된 **보안 취약점(Scam, Backdoor)**과 **비효율적인 로직**을 AI(Google Gemini)를 통해 정밀 분석하는 웹 애플리케이션입니다.

기존의 단순 텍스트 리포트 방식에서 벗어나, **코드 뷰어(Code Viewer)**와 **분석 리포트**를 한 화면에서 대조하며 볼 수 있는 직관적인 UI를 제공합니다. 또한, 모바일 환경 지원 및 PDF 문서화 기능을 통해 실무 활용성을 극대화했습니다.

---

## ✨ 핵심 기능 (Key Features)

### 1. 🔍 듀얼 분석 모드 (Dual Analysis Mode)
* **파일 업로드:** `.js`, `.sol`, `.py` 등 다중 파일을 한 번에 업로드하여 일괄 분석.
* **직접 입력(Direct Input):** 별도 파일 생성 없이 코드를 복사/붙여넣기하여 즉시 검증 가능 (UX 최적화).

### 2. 📊 직관적인 시각화 (Visualization)
* **Split View Layout:** 좌측에는 **Syntax Highlighting**이 적용된 코드 뷰어, 우측에는 분석 리포트를 배치하여 문제점을 한눈에 대조.
* **Tab Navigation:** 여러 파일을 탭으로 전환하며 빠르게 검토 가능 (파일별 위험도 Status Dot 표시).

### 3. 📑 보고서 자동화 (Reporting)
* **PDF Export:** 분석된 결과를 클릭 한 번으로 **고화질 A4 PDF 리포트**로 변환 및 다운로드.
* **Persistent Session:** 새로고침 시에도 분석 데이터와 테마 설정(Dark/Light Mode)이 유지되어 업무 연속성 보장.

### 4. 📱 반응형 웹 (Responsive)
* PC, 태블릿, 모바일 등 모든 디바이스 해상도에 최적화된 레이아웃 제공.

---

## 기술 스택 (Tech Stack)

| Category | Technology |
| :--- | :--- |
| **Frontend** | React (Vite), CSS3 (Variables, Flexbox, Grid) |
| **Backend** | Node.js, Express.js |
| **AI Model** | **Google Gemini 2.5 Flash** (High Performance & Cost Effective) |
| **Libraries** | `react-syntax-highlighter`, `html2canvas`, `jspdf`, `google-genai` |
| **Deployment** | Vercel (Frontend), Render (Backend) |

---

## 🚀 시작하기 (Getting Started)

이 프로젝트를 로컬 환경에서 실행하려면 다음 단계가 필요합니다.

### 사전 요구사항 (Prerequisites)
* Node.js v18.0.0 이상
* npm 또는 yarn
* Google AI Studio API Key

### 설치 및 실행 (Installation)

1. **저장소 클론**
   ```bash
   git clone [https://github.com/Ludium-Official/intern-recruitment-validate.git](https://github.com/Ludium-Official/intern-recruitment-validate.git)
   cd intern-recruitment-validate
  ```

2. 환경 변수 설정 (.env) 프로젝트 루트에 .env 파일을 생성하고 아래 내용을 입력하세요.

코드 스니펫

```bash
# Backend (.env)
API_AI_KEY=your_google_gemini_api_key
PORT=3000
```

프로젝트 실행 두 개의 터미널을 열어 각각 실행합니다.

Backend:

```bash
cd backend
npm install
node server.js
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

---

💡 사용 방법 (Usage)
1. 코드 입력: '파일 업로드' 탭에서 파일을 선택하거나, '직접 입력' 탭에 코드를 붙여넣습니다.

2. 분석 시작: '분석하기' 버튼을 클릭합니다. (AI 분석에는 약 3~5초가 소요됩니다.)

3. 결과 확인: * 좌측 뷰어에서 원본 코드를 확인합니다.

    * 우측 리포트에서 보안 위협, 취약점, 코드 품질 등 6가지 항목의 진단 결과를 확인합니다.

4. 결과 활용: * 상단 탭을 눌러 다른 파일의 결과로 전환합니다.

   * 하단 'PDF로 리포트 저장' 버튼을 눌러 결과를 문서로 저장합니다.

---

❓ 트러블슈팅 (Troubleshooting)
배포 및 운영 과정에서 발생할 수 있는 주요 이슈와 해결 방법입니다.

Q1. 분석 시 500 에러(Internal Server Error)가 발생합니다.
* 원인: Render 등 배포 환경에 API_AI_KEY 환경 변수가 등록되지 않았거나, GitHub에 키가 노출되어 구글이 해당 키를 차단했을 수 있습니다.

* 해결: Google AI Studio에서 새 키를 발급받은 후, 배포 플랫폼의 Environment Variables 설정에 API_AI_KEY를 등록해주세요.

Q2. 배포 후 CORS 오류가 발생합니다.
* 원인: 백엔드 서버가 프론트엔드 도메인의 요청을 허용하지 않아서 발생합니다.

* 해결: server.js의 corsOptions 설정에 프론트엔드 배포 주소(예: https://your-app.vercel.app)를 추가하세요.

Q3. 모바일에서 PDF 저장 시 코드가 잘립니다.
* 원인: 모바일 화면의 너비가 좁아 가로 스크롤이 생기면, 캡처 라이브러리가 스크롤 영역을 인식하지 못합니다.

* 해결: 본 프로젝트에는 캡처 직전에 강제로 스타일을 변경(pre-wrap 적용, 폰트 축소)하는 로직이 포함되어 있어 정상적으로 저장됩니다.

---

🤝 기여하기 (Contributing)
이슈 제보 및 기능 제안은 언제나 환영합니다!

1. 이 저장소를 Fork 합니다.

2. 새로운 Feature 브랜치를 생성합니다 (git checkout -b feature/NewFeature).

3. 변경 사항을 Commit 합니다 (git commit -m 'Add some NewFeature').

4. Branch에 Push 합니다 (git push origin feature/NewFeature).

5. Pull Request를 요청합니다.

---

📄 라이선스 (License)
이 프로젝트는 MIT 라이선스를 따릅니다. 자세한 내용은 LICENSE 파일을 참고하세요.