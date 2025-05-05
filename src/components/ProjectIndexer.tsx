
import React, { useState } from 'react';
import { Folder, FolderSearch, RefreshCw, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { FileNode } from '@/components/FileExplorer';

interface ProjectIndexerProps {
  onIndexComplete: (files: FileNode[]) => void;
}

const ProjectIndexer: React.FC<ProjectIndexerProps> = ({ onIndexComplete }) => {
  const { toast } = useToast();
  const [isIndexing, setIsIndexing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [indexPath, setIndexPath] = useState('');
  const [lastIndexed, setLastIndexed] = useState<string | null>(null);
  
  const handleSelectFolder = () => {
    // In a real implementation, this would use a file dialog API
    // For now, we'll simulate selecting a folder
    setIndexPath('/home/user/projects/sample-project');
    
    toast({
      title: "Folder Selected",
      description: "Ready to index /home/user/projects/sample-project",
    });
  };
  
  const handleStartIndexing = async () => {
    if (!indexPath) {
      toast({
        title: "No folder selected",
        description: "Please select a folder to index first",
        variant: "destructive",
      });
      return;
    }
    
    setIsIndexing(true);
    setProgress(0);
    
    // Simulate indexing process
    try {
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i);
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      // Simulate indexed files (in a real implementation, these would be actual files)
      const mockIndexedFiles: FileNode[] = [
        {
          id: 'root-mock-1',
          name: 'src',
          type: 'folder',
          children: [
            {
              id: 'file-mock-1',
              name: 'index.js',
              type: 'file',
              content: '// Main entry point',
              language: 'javascript'
            },
            {
              id: 'file-mock-2',
              name: 'app.js',
              type: 'file',
              content: '// App configuration',
              language: 'javascript'
            }
          ]
        },
        {
          id: 'root-mock-2',
          name: 'public',
          type: 'folder',
          children: [
            {
              id: 'file-mock-3',
              name: 'index.html',
              type: 'file',
              content: '<!DOCTYPE html><html></html>',
              language: 'html'
            }
          ]
        }
      ];
      
      // Update state and notify parent
      const currentDate = new Date().toLocaleString();
      setLastIndexed(currentDate);
      onIndexComplete(mockIndexedFiles);
      
      toast({
        title: "Project Indexed",
        description: `Successfully indexed project at ${indexPath}`,
      });
    } catch (error) {
      console.error('Indexing error:', error);
      toast({
        title: "Indexing Failed",
        description: "An error occurred while indexing the project",
        variant: "destructive",
      });
    } finally {
      setIsIndexing(false);
    }
  };

  return (
    <div className="glass-card p-4 space-y-4">
      <h2 className="text-lg font-medium text-foreground">Project Indexer</h2>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          className="flex-1 justify-start modern-button"
          onClick={handleSelectFolder}
          disabled={isIndexing}
        >
          <Folder className="mr-2 h-4 w-4" />
          {indexPath ? indexPath : "Select Project Folder"}
        </Button>
        
        <Button
          variant="default"
          className="modern-button"
          onClick={handleStartIndexing}
          disabled={isIndexing || !indexPath}
        >
          {isIndexing ? (
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <FolderSearch className="mr-2 h-4 w-4" />
          )}
          {isIndexing ? "Indexing..." : "Index Project"}
        </Button>
      </div>
      
      {isIndexing && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Indexing files...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-1" />
        </div>
      )}
      
      {lastIndexed && !isIndexing && (
        <div className="flex items-center text-xs text-muted-foreground">
          <Check className="mr-1 h-3 w-3 text-green-500" />
          <span>Last indexed: {lastIndexed}</span>
        </div>
      )}
    </div>
  );
};

export default ProjectIndexer;
