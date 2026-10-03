// src/components/CodeEditor.jsx

import React from 'react';
import Editor from '@monaco-editor/react';

function CodeEditor({ language, value, onChange, height = "60vh" }) {
  
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
          fontSize: 14,
          minimap: {
            enabled: false, // Hides the minimap on the side
          },
        }}
      />
    </div>
  );
}

export default CodeEditor;