
import React, { useRef } from 'react';
import Editor, { Monaco } from "@monaco-editor/react";
import { FileNode } from './FileExplorer';
import { editor } from 'monaco-editor';

interface MonacoEditorProps {
  file: FileNode | null;
  onContentChange?: (fileId: string, content: string) => void;
  readOnly?: boolean;
}

const MonacoEditor: React.FC<MonacoEditorProps> = ({
  file,
  onContentChange,
  readOnly = false
}) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
    editorRef.current = editor;
    editor.focus();
  };

  const handleEditorChange = (value: string | undefined) => {
    if (onContentChange && file && value !== undefined) {
      onContentChange(file.id, value);
    }
  };

  const getLanguage = (fileName: string) => {
    if (!fileName) return 'plaintext';
    
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch(extension) {
      case 'js': return 'javascript';
      case 'jsx': return 'javascript';
      case 'ts': return 'typescript';
      case 'tsx': return 'typescript';
      case 'py': return 'python';
      case 'html': return 'html';
      case 'css': return 'css';
      case 'json': return 'json';
      case 'md': return 'markdown';
      default: return 'plaintext';
    }
  };
  
  if (!file) {
    return (
      <div className="h-full w-full flex items-center justify-center text-muted-foreground">
        Select a file to view its contents
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-hidden flex flex-col bg-code">
      <div className="bg-muted/30 py-2 px-4 text-sm font-medium border-b border-border flex items-center">
        <span>{file.name}</span>
        {file.language && (
          <span className="ml-2 text-xs bg-muted px-2 py-0.5 rounded-full">{file.language}</span>
        )}
      </div>
      
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          language={getLanguage(file.name)}
          value={file.content || ''}
          theme="vs-dark"
          options={{
            readOnly,
            minimap: { enabled: true },
            fontSize: 14,
            fontFamily: "'JetBrains Mono', monospace",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            lineNumbers: 'on',
          }}
          onMount={handleEditorDidMount}
          onChange={handleEditorChange}
          className="monaco-editor-container"
        />
      </div>
    </div>
  );
};

export default MonacoEditor;
