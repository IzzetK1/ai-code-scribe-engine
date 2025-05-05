
import React, { useState } from 'react';
import { FolderTree, File, ChevronRight, ChevronDown, FileText, Folder } from 'lucide-react';
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
  
  return (
    <div className="w-full">
      <div 
        onClick={node.type === 'folder' ? toggleExpand : handleFileClick}
        className={cn(
          "flex items-center py-1 px-2 hover:bg-muted/50 cursor-pointer rounded transition-colors text-sm",
          isSelected && "bg-primary/20 hover:bg-primary/20",
          `pl-${level * 4 + 2}`
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        <div className="mr-1 flex items-center">
          {node.type === 'folder' ? (
            isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />
          ) : null}
        </div>
        <div className="mr-2">
          {node.type === 'folder' ? <Folder size={16} className="text-primary" /> : <FileText size={16} className="text-foreground" />}
        </div>
        <span>{node.name}</span>
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
      <div className="flex items-center mb-3 px-2">
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
