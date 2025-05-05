
import React, { useState } from 'react';
import { FolderTree, ChevronRight, ChevronDown, FileText, Folder, File } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  content?: string;
  language?: string;
}

interface FileExplorerProps {
  files: FileNode[];
  onFileSelect: (file: FileNode) => void;
  selectedFileId: string | null;
}

const FileExplorerItem: React.FC<{
  node: FileNode;
  level: number;
  onFileSelect: (file: FileNode) => void;
  selectedFileId: string | null;
}> = ({ node, level, onFileSelect, selectedFileId }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };
  
  const handleFileClick = () => {
    if (node.type === 'file') {
      onFileSelect(node);
    }
  };
  
  const isSelected = selectedFileId === node.id;
  
  const getFileIcon = () => {
    if (node.type === 'file') {
      const extension = node.name.split('.').pop()?.toLowerCase();
      if (extension === 'js' || extension === 'jsx') return <FileText size={16} className="text-yellow-500" />;
      if (extension === 'ts' || extension === 'tsx') return <FileText size={16} className="text-blue-500" />;
      if (extension === 'css' || extension === 'scss') return <FileText size={16} className="text-pink-500" />;
      if (extension === 'html') return <FileText size={16} className="text-orange-500" />;
      if (extension === 'json') return <FileText size={16} className="text-green-500" />;
      if (extension === 'md') return <FileText size={16} className="text-white" />;
      return <File size={16} className="text-foreground" />;
    }
    return <Folder size={16} className="text-primary" />;
  };
  
  return (
    <div className="w-full">
      <div 
        onClick={node.type === 'folder' ? toggleExpand : handleFileClick}
        className={cn(
          "flex items-center py-1.5 px-2 hover:bg-muted/50 cursor-pointer rounded-md transition-colors text-sm",
          isSelected && "bg-primary/20 hover:bg-primary/30",
          `pl-${level * 4 + 2}`
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        <div className="mr-1 flex items-center w-4">
          {node.type === 'folder' ? (
            isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
          ) : null}
        </div>
        <div className="mr-2">
          {getFileIcon()}
        </div>
        <span className="truncate">{node.name}</span>
      </div>
      
      {node.type === 'folder' && isExpanded && node.children && (
        <div className="w-full">
          {node.children.map((child) => (
            <FileExplorerItem
              key={child.id}
              node={child}
              level={level + 1}
              onFileSelect={onFileSelect}
              selectedFileId={selectedFileId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const FileExplorer: React.FC<FileExplorerProps> = ({ files, onFileSelect, selectedFileId }) => {
  return (
    <div className="w-full h-full bg-sidebar p-2 overflow-y-auto">
      <div className="flex items-center mb-3 px-2 py-2">
        <FolderTree size={16} className="mr-2 text-primary" />
        <h2 className="font-semibold text-sm">Project Files</h2>
      </div>
      
      <div className="w-full">
        {files.map((file) => (
          <FileExplorerItem
            key={file.id}
            node={file}
            level={0}
            onFileSelect={onFileSelect}
            selectedFileId={selectedFileId}
          />
        ))}
      </div>
    </div>
  );
};

export default FileExplorer;
