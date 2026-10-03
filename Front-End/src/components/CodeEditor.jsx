// src/components/CodeEditor.jsx

import React from 'react';
import Editor from '@monaco-editor/react';

function CodeEditor({ language, value, onChange, height = "60vh", fontSize = 14 }) {
  
  function handleEditorChange(newValue) {
    onChange(newValue);
  }

  return (
    <div className="border border-white/10 rounded-xl overflow-hidden shadow-inner">
      <Editor
        height={height}
        theme="vs-dark"
        language={language}
        value={value}
        onChange={handleEditorChange}
        options={{
          fontSize: Number(fontSize) || 14,
          minimap: {
            enabled: false, // Hides the minimap on the side
          },
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          automaticLayout: true,
          tabSize: 4,
          formatOnPaste: true,
        }}
      />
    </div>
  );
}

export default CodeEditor;