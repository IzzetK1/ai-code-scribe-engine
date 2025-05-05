
import React from 'react';
import { FileNode } from './FileExplorer';
import { cn } from '@/lib/utils';

interface CodeEditorProps {
  file: FileNode | null;
  onContentChange?: (fileId: string, content: string) => void;
  readOnly?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  file,
  onContentChange,
  readOnly = false
}) => {
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onContentChange && file) {
      onContentChange(file.id, e.target.value);
    }
  };

  const renderLineNumbers = (content: string) => {
    const lines = content.split('\n');
    return (
      <div className="select-none py-2 pr-4 text-sm text-muted-foreground text-right">
        {lines.map((_, i) => (
          <div key={i} className="code-line-number">
            {i + 1}
          </div>
        ))}
      </div>
    );
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
      
      <div className="flex-1 overflow-auto">
        <div className="code-editor flex">
          {file.content !== undefined && renderLineNumbers(file.content)}
          
          <div className="flex-1 overflow-hidden">
            <textarea
              value={file.content || ''}
              onChange={handleContentChange}
              className={cn(
                "w-full h-full bg-transparent resize-none py-2 outline-none font-mono text-sm",
                "text-code-foreground caret-primary"
              )}
              spellCheck="false"
              readOnly={readOnly}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
