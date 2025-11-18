'use client';

import Editor, { type Monaco } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { useEffect, useRef } from 'react';

interface CodeEditorProps {
  language: string;
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

export function CodeEditor({ language, value, onChange, readOnly = false }: CodeEditorProps) {
  const monacoRef = useRef<Monaco | null>(null);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const handleEditorWillMount = (monaco: Monaco) => {
    monacoRef.current = monaco;

    // Disable all built-in validation for all languages
    try {
      monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: true,
        noSyntaxValidation: true,
      });

      monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: true,
        noSyntaxValidation: true,
      });

      // Disable JSON validation using setDiagnosticsOptions
      monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: false,
        allowComments: true,
        schemas: [],
      });
    } catch (error) {
      // Silently fail if validation options can't be set
      console.warn('Could not disable Monaco validation:', error);
    }
  };

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
    editorRef.current = editor;

    // Get the model and disable all markers/validation
    const model = editor.getModel();
    if (model) {
      // Clear any existing markers
      monaco.editor.setModelMarkers(model, 'owner', []);
      
      // Disable model validation
      model.updateOptions({ 
        tabSize: 2,
        insertSpaces: true,
      });
    }

    // Focus editor
    editor.focus();
  };

  // Clear markers whenever language or value changes
  useEffect(() => {
    if (monacoRef.current && editorRef.current) {
      const model = editorRef.current.getModel();
      if (model) {
        monacoRef.current.editor.setModelMarkers(model, 'owner', []);
      }
    }
  }, [language, value]);

  return (
    <Editor
      height="100%"
      language={language}
      value={value}
      onChange={(value) => onChange(value || '')}
      theme="vs-dark"
      beforeMount={handleEditorWillMount}
      onMount={handleEditorDidMount}
      options={{
        readOnly,
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'on',
        roundedSelection: true,
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        insertSpaces: true,
        wordWrap: 'on',
        padding: { top: 16, bottom: 16 },
        // Enable suggestions for built-in snippets
        suggestOnTriggerCharacters: true,
        quickSuggestions: {
          other: true,
          comments: false,
          strings: false,
        },
        acceptSuggestionOnCommitCharacter: true,
        acceptSuggestionOnEnter: 'on',
        // Basic formatting
        formatOnPaste: false,
        formatOnType: false,
        // Disable validation-related features
        'semanticHighlighting.enabled': false,
      }}
      loading={
        <div className="flex items-center justify-center h-full bg-[#1e1e1e]">
          <div className="text-white/50">Loading editor...</div>
        </div>
      }
    />
  );
}

