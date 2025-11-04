import React, { useState } from 'react';

function FileUploader({ onFilesSelect, disabled }) {
  const [dragOver, setDragOver] = useState(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);

    if (e.dataTransfer.files) {
      onFilesSelect(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e) => {
    if (e.target.files) {
      onFilesSelect(Array.from(e.target.files));
    }
  };

  return (
    <div 
      className={`file-uploader ${dragOver ? 'drag-over' : ''} ${disabled ? 'disabled' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        multiple
        onChange={handleChange}
        disabled={disabled}
        id="file-input"
        className="file-input"
      />
      <label htmlFor="file-input" className="file-label">
        <span role="img" aria-label="upload">📤</span>
        <p>클릭하여 파일을 선택하거나, 이곳으로 드래그 앤 드롭하세요.</p>
        <small>(.js, .sol, .json 등 코드 파일)</small>
      </label>
    </div>
  );
}

export default FileUploader;