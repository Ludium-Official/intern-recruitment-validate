import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeViewer = ({ code, fileName }) => {
  
  const getLanguage = (name) => {
    if (!name) return 'javascript';
    const ext = name.split('.').pop().toLowerCase();
    switch (ext) {
      case 'js':
      case 'jsx': return 'javascript';
      case 'ts':
      case 'tsx': return 'typescript';
      case 'sol': return 'solidity';
      case 'py': return 'python';
      case 'json': return 'json';
      case 'html': return 'html';
      case 'css': return 'css';
      default: return 'javascript';
    }
  };

  return (
    <div className="code-viewer-container">
      <div className="code-header">
        <span className="code-title">💻 Source Code: {fileName}</span>
      </div>
      <div className="code-body">
        <SyntaxHighlighter 
          language={getLanguage(fileName)} 
          style={vscDarkPlus}
          className="code-viewer-content"
          customStyle={{ 
            margin: 0, 
            padding: '20px', 
            borderRadius: '0 0 8px 8px',
            fontSize: '0.9rem',
            lineHeight: '1.5'
          }}
          showLineNumbers={true}
          wrapLines={true}
        >
          {code || "// 코드를 불러올 수 없습니다."}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default CodeViewer;