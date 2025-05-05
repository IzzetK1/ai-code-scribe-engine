
import { FileNode } from "@/components/FileExplorer";

interface OllamaResponse {
  response: string;
  actions: Array<{
    title: string;
    description: string;
    status: 'pending' | 'complete' | 'error';
    output?: string;
  }>;
}

interface ProjectStats {
  totalFiles: number;
  totalLines: number;
  fileTypes: { name: string; count: number }[];
  issuesCount: number;
}

// TODO: Replace with actual API call to Ollama when available
export async function processPrompt(prompt: string, files: FileNode[]): Promise<OllamaResponse> {
  console.log('Processing prompt:', prompt);
  console.log('With files:', files);
  
  // This is a mock implementation - in a real implementation, this would call the Ollama API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        response: `I've analyzed your project based on the prompt: "${prompt}"\n\nHere's what I found:\n- The project contains ${files.length} main files\n- I detected some patterns in your code that could be improved\n- Based on your request, I'd recommend creating a new module for handling the functionality you described.\n\nWould you like me to implement these changes?`,
        actions: [
          {
            title: 'Project Analysis',
            description: 'Scanned project structure and files',
            status: 'complete',
            output: `Found ${files.length} files in the project.`
          },
          {
            title: 'Code Review',
            description: 'Analyzed code quality and patterns',
            status: 'complete',
            output: 'Identified 3 areas for potential improvement.'
          },
          {
            title: 'Task Planning',
            description: 'Planned implementation tasks',
            status: 'complete',
            output: 'Created plan with 5 steps to implement requested changes.'
          }
        ]
      });
    }, 2000); // Simulate API delay
  });
}

export async function getProjectStats(files: FileNode[]): Promise<ProjectStats> {
  // Count total files
  const totalFiles = countFiles(files);
  
  // Count total lines
  const totalLines = countLines(files);
  
  // Get file types
  const fileTypes = getFileTypes(files);
  
  // Mock issues count - in a real implementation this would analyze the code
  const issuesCount = Math.floor(Math.random() * 5);
  
  return {
    totalFiles,
    totalLines,
    fileTypes,
    issuesCount
  };
}

function countFiles(files: FileNode[]): number {
  let count = 0;
  
  function traverse(nodes: FileNode[]) {
    for (const node of nodes) {
      if (node.type === 'file') {
        count++;
      }
      if (node.type === 'folder' && node.children) {
        traverse(node.children);
      }
    }
  }
  
  traverse(files);
  return count;
}

function countLines(files: FileNode[]): number {
  let count = 0;
  
  function traverse(nodes: FileNode[]) {
    for (const node of nodes) {
      if (node.type === 'file' && node.content) {
        count += node.content.split('\n').length;
      }
      if (node.type === 'folder' && node.children) {
        traverse(node.children);
      }
    }
  }
  
  traverse(files);
  return count;
}

function getFileTypes(files: FileNode[]): { name: string; count: number }[] {
  const types: Record<string, number> = {};
  
  function traverse(nodes: FileNode[]) {
    for (const node of nodes) {
      if (node.type === 'file') {
        const extension = node.name.split('.').pop() || 'unknown';
        types[extension] = (types[extension] || 0) + 1;
      }
      if (node.type === 'folder' && node.children) {
        traverse(node.children);
      }
    }
  }
  
  traverse(files);
  
  return Object.entries(types).map(([name, count]) => ({ name, count }));
}
