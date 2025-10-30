import React from 'react';
// 'issues'가 문자열 배열을 받도록 수정
// 'ReportDisplay'라는 이름의 React 컴포넌트(UI 조각)를 선언함
// { report }는 부모 컴포넌트(App.jsx)로부터 'reportData'라는 '객체'를 'report'라는 이름으로 전달받는다는 의미
function ReportDisplay({ report }) {
  // 부모로부터 받은 'report' 객체 안의 'finalDecision' 값이 'CLEAN'가 '아닌지(!==)' 확인함
  // "SCAM_DETECTED", "FAIL" 등이면 'isFail' 변수는 'true'가 됩니다. 'CLEAN'일 때만 'false'가 됨
  const isFail = report.finalDecision !== 'CLEAN';

  // 'return' 키워드는 이 컴포넌트가 화면에 실제로 그려야 할 HTML(JSX) 내용을 반환한다는 의미
  return (
    // 'isFail' 변수가 'true'이면 'status-fail' (빨간색) 클래스를, 'false'이면 'status-pass' (초록색) 클래스를 추가
    <div className={`report-container ${isFail ? 'status-fail' : 'status-pass'}`}>
      <div className="report-header">
        <h2>
          {/* 'isFail' 변수의 값에 따라 다른 아이콘과 텍스트를 보여줌 (삼항 연산자) */}
          {/* 'isFail'이 true이면 '❌ 검증 실패 (Fail)'를, false이면 '✅ 검증 통과 (Pass)'를 표시함 */}
          {isFail ? '❌ 검증 실패 (Fail)' : '✅ 검증 통과 (Pass)'}
        </h2>
        {/* AI가 생성한 '요약(summary)' 텍스트를 문단(<p>) 태그로 보여줌 */}
        <p className="report-summary">{report.summary}</p>
      </div>

      <div className="report-body">
        <div className="check-section">
          <h3>
            <span role="img" aria-label="scam">🚨</span> 스캠 / 악성 코드 (Scam Check)
          </h3>
          {/* 'report' 객체 > 'reportDetails' > 'scamCheck' > 'issues' 배열의 '길이(length)'가 0인지 확인 */}
          {/* (삼항 연산자 시작) */}
          {report.reportDetails.scamCheck.issues.length === 0 ? (
            // (조건이 'true'일 때) 이슈가 0개이면 "발견된 이슈가 없습니다."라는 문단(<p>)을 표시
            <p className="no-issues">발견된 이슈가 없습니다.</p>
          ) : (
            // (조건이 'false'일 때) 이슈가 1개 이상이면, 순서 없는 목록(<ul>) 태그를 시작
            <ul className="issue-list">
              {/* (주석) BE가 보낸 'issues' 배열은 이제 객체가 아닌 '문자열' 배열 */}
              {/* 'scamCheck.issues' 배열을 .map() 함수로 순회 */}
              {/* 배열의 각 항목(문자열)은 'issue' 변수에, 각 항목의 순번(0, 1, 2...)은 'index' 변수에 담김 */}
              {report.reportDetails.scamCheck.issues.map((issue, index) => (
                // 'key={index}'는 React가 목록을 효율적으로 관리하기 위해 사용하는 고유 식별값
                // 목록의 각 항목(<li>) 태그를 생성함
                <li key={index}>
                  {/* (주석) 'issue' 변수는 이제 객체({file, line, ...})가 아닌 단순 '문자열'임 */}
                  {/* <p> 태그를 사용해 'issue' 문자열을 화면에 그대로 출력함 */}
                  <p>{issue}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="check-section">
          <h3>
            <span role="img" aria-label="validity">⚙️</span> 기본 유효성 (Validity Check)
          </h3>
          {/* 'validityCheck.issues' 배열의 길이가 0인지 확인 */}
          {report.reportDetails.validityCheck.issues.length === 0 ? (
            // (조건이 'true'일 때) 이슈가 0개이면 "발견된 이슈가 없습니다." 문단을 표시함
            <p className="no-issues">발견된 이슈가 없습니다.</p>
          ) : (
            // (조건이 'false'일 때) 이슈가 1개 이상이면, 순서 없는 목록(<ul>) 태그를 시작함
            <ul className="issue-list">
              {/* (주석) 'issues' 배열이 문자열 배열임을 다시 명시함 */}
              {/* 'validityCheck.issues' 배열을 .map() 함수로 순회함 */}
              {report.reportDetails.validityCheck.issues.map((issue, index) => (
                // 각 목록 항목(<li>) 태그를 생성함
                <li key={index}>
                  {/* <p> 태그를 사용해 'issue' 문자열을 화면에 그대로 출력함 */}
                  <p>{issue}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  ); 
} 

export default ReportDisplay;