// src/components/CodeEditor.jsx

import React from 'react';
import Editor from '@monaco-editor/react';

function CodeEditor({ language, value, onChange }) {
  
  function handleEditorChange(newValue) {
    onChange(newValue);
  }

  return (
    <div className="border border-gray-700 rounded-md overflow-hidden">
      <Editor
        height="70vh" // You can adjust the height
        theme="vs-dark" // The classic VS Code dark theme
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