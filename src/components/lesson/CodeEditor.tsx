'use client';

import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  language: string;
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

export function CodeEditor({ language, value, onChange, readOnly = false }: CodeEditorProps) {
  return (
    <Editor
      height="100%"
      language={language}
      value={value}
      onChange={(value) => onChange(value || '')}
      theme="vs-dark"
      options={{
        readOnly,
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'on',
        roundedSelection: true,
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        wordWrap: 'on',
        padding: { top: 16, bottom: 16 },
        suggestOnTriggerCharacters: true,
        quickSuggestions: true,
        formatOnPaste: true,
        formatOnType: true,
      }}
      loading={
        <div className="flex items-center justify-center h-full bg-[#1e1e1e]">
          <div className="text-white/50">Loading editor...</div>
        </div>
      }
    />
  );
}

