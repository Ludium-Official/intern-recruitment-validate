import React, { useState } from 'react';

// App.jsx에서 분리된 파일 업로더 컴포넌트
// 'FileUploader'라는 이름의 React 컴포넌트(UI 조각)를 선언
// { onFilesSelect, disabled }는 부모 컴포넌트(App.jsx)로부터 전달받는 2개의 '속성(props)' 존재.
// - onFilesSelect: 파일이 선택되었을 때, 부모에게 파일 목록을 알려주는 '함수'
// - disabled: 파일 업로더를 비활성화할지 여부를 결정하는 '변수' (true/false)
function FileUploader({ onFilesSelect, disabled }) {
  // React의 '상태(state)'를 만듦
  // 'dragOver'는 파일이 현재 드래그 영역 위에 있는지 여부(true/false)를 저장하는 변수
  // 'setDragOver'는 'dragOver' 변수의 값을 변경할 때 사용하는 함수
  // useState(false)는 'dragOver'의 초기값을 'false' (드래그 중 아님)로 설정
  const [dragOver, setDragOver] = useState(false);
  // 'const'를 사용해 'handleDrop'이라는 이름의 새로운 '함수'를 선언
  // 이 함수는 파일이 영역에 '드롭'되었을 때 실행됨
  // (e) => { ... }는 '이벤트 핸들러 함수'를 의미하며, 'e'는 드롭 이벤트에 대한 모든 정보를 담고 있음
  const handleDrop = (e) => {
    // e.preventDefault();는 브라우저가 파일을 열어버리는 기본 동작을 막음 (필수 코드)
    e.preventDefault();
    // 파일을 드롭했으니, 'dragOver' 상태를 'false' (드래그 중 아님)로 다시 변경함
    setDragOver(false);
    // 만약(if) 드롭된 이벤트(e)의 'dataTransfer' 안에 'files' (파일 목록)이 존재한다면,
    if (e.dataTransfer.files) {
      // 부모(App.jsx)로부터 받은 'onFilesSelect' 함수를 실행함
      // e.dataTransfer.files는 'FileList'라는 특수한 목록이므로,
      // Array.from()을 사용해 진짜 자바스크립트 '배열(Array)'로 변환해서 부모에게 전달
      onFilesSelect(Array.from(e.dataTransfer.files));
    }
  }; // handleDrop 함수 선언 끝

  // (숨겨진) '파일 선택' 버튼을 클릭하여 파일이 '변경(change)'되었을 때 실행될 'handleChange' 함수를 선언
  const handleChange = (e) => {
    // 만약(if) 이벤트(e)를 발생시킨 대상(target)에 'files' (파일 목록)이 존재한다면,
    if (e.target.files) {
      // 부모(App.jsx)로부터 받은 'onFilesSelect' 함수에 선택된 파일 목록을 '배열(Array)'로 변환하여 전달
      onFilesSelect(Array.from(e.target.files));
    }
  }; // handleChange 함수 선언 끝

  // 'return' 키워드는 이 컴포넌트가 화면에 실제로 그려야 할 HTML(JSX) 내용을 반환한다는 의미
  return (
    // 파일 업로더 영역 전체를 감싸는 <div> 태그 시작
    <div 
      // CSS 스타일을 적용할 클래스 이름을 동적으로(변수에 따라 바뀌게) 설정함
      // 'file-uploader'는 기본 클래스
      // ${dragOver ? 'drag-over' : ''}는 'dragOver' 상태가 true이면 'drag-over' 클래스를 추가하고, 아니면('') 아무것도 추가하지 않습니다.
      // ${disabled ? 'disabled' : ''}는 'disabled' 변수가 true이면 'disabled' 클래스를 추가함
      className={`file-uploader ${dragOver ? 'drag-over' : ''} ${disabled ? 'disabled' : ''}`}
      // 파일이 영역 '위로' 드래그되어 '올라왔을 때'(onDragOver) 실행할 내용을 정의함
      // (e) => { ... } : 이벤트 핸들러 함수
      // e.preventDefault(); : 브라우저의 기본 동작(파일 열기 시도 등)을 막음 (필수 코드)
      // setDragOver(true); : 'dragOver' 상태를 'true' (드래그 중)로 변경 (CSS 스타일 변경용)
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      // 드래그하던 파일이 영역 '밖으로' '나갔을 때'(onDragLeave) 'dragOver' 상태를 'false'로 변경
      onDragLeave={() => setDragOver(false)}
      // 파일이 영역 안에 '드롭'되었을 때'(onDrop), 위에서 만든 'handleDrop' 함수를 실행함
      onDrop={handleDrop}
    >
      {/* 브라우저의 기본 '파일 선택' <input> 태그를 시작함 (이 태그는 CSS로 숨겨짐) */}
      <input 
        // 이 <input> 태그가 '파일'을 선택하는 용도임을 명시함
        type="file" 
        // 'multiple' 속성은 파일을 '여러 개' 선택할 수 있도록 허용함
        multiple
        // 파일 선택이 완료되어 '변경(change)'되면, 위에서 만든 'handleChange' 함수 실행
        onChange={handleChange}
        // 부모(App.jsx)가 'disabled'를 true로 전달하면, 이 <input> 버튼도 비활성화됨
        disabled={disabled}
        // 아래 <label> 태그와 연결하기 위한 고유 ID를 'file-input'으로 지정함
        id="file-input"
        // CSS에서 이 태그를 숨기기 위한 클래스 이름
        className="file-input"
      />
      {/* 사용자 눈에 실제로 보이는 '클릭 가능한 영역' (<label>) 시작 */}
      {/* htmlFor="file-input"은 이 <label>을 클릭하면 'id'가 'file-input'인 <input> 태그를 실행시키라는 의미 */}
      <label htmlFor="file-input" className="file-label">
        {/* (장식용) 업로드 이모티콘(📤)을 표시 */}
        <span role="img" aria-label="upload">📤</span>
        {/* 사용자에게 "클릭하거나 드래그 앤 드롭하세요"라는 안내 문구(<p> 태그)를 보여줌 */}
        <p>클릭하여 파일을 선택하거나, 이곳으로 드래그 앤 드롭하세요.</p>
        {/* 어떤 파일을 올려야 하는지 작은 글씨(<small> 태그)로 힌트를 줌 */}
        <small>(.js, .sol, .json 등 코드 파일)</small>
      </label>
    </div>
  ); // return 구문이 끝
} // FileUploader 컴포넌트 함수 끝

export default FileUploader;