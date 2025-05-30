
import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { X, Sparkles } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import Sidebar from '@/components/Sidebar';
import FileExplorer, { FileNode } from '@/components/FileExplorer';
import MonacoEditor from '@/components/MonacoEditor';
import PromptInput from '@/components/PromptInput';
import ResponseDisplay from '@/components/ResponseDisplay';
import ProjectAnalytics from '@/components/ProjectAnalytics';
import ProjectIndexer from '@/components/ProjectIndexer';
import MCPServerManager from '@/components/MCPServerManager';
import Terminal, { TerminalRef } from '@/components/Terminal';
import { processPrompt, getProjectStats } from '@/services/ollamaService';

const Index = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('home');
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(true);
  const [response, setResponse] = useState('');
  const [actions, setActions] = useState<Array<{
    title: string;
    description: string;
    status: 'pending' | 'complete' | 'error';
    output?: string;
  }>>([]);
  const [outputTab, setOutputTab] = useState<'response' | 'terminal'>('response');
  const terminalRef = useRef<TerminalRef>(null);
  
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalLines: 0,
    fileTypes: [] as { name: string; count: number }[],
    issuesCount: 0
  });

  // Sample project structure - in a real implementation this would be loaded from a backend
  const [files, setFiles] = useState<FileNode[]>([
    {
      id: 'root-1',
      name: 'src',
      type: 'folder',
      children: [
        {
          id: 'file-1',
          name: 'main.js',
          type: 'file',
          language: 'javascript',
          content: `// Main application entry point
import { initApp } from './app';
import { setupDatabase } from './database';

// Initialize application components
async function main() {
  try {
    await setupDatabase();
    await initApp();
    console.log('Application started successfully');
  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
}

main();`
        },
        {
          id: 'file-2',
          name: 'app.js',
          type: 'file',
          language: 'javascript',
          content: `// Application initialization
import { createServer } from 'http';
import { loadModules } from './modules';

export async function initApp() {
  const modules = await loadModules();
  
  const server = createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Ollama Agent Server');
  });
  
  server.listen(3000, () => {
    console.log('Server listening on port 3000');
  });
  
  return { server, modules };
}`
        },
        {
          id: 'folder-1',
          name: 'modules',
          type: 'folder',
          children: [
            {
              id: 'file-3',
              name: 'index.js',
              type: 'file',
              language: 'javascript',
              content: `// Module loader
import fs from 'fs';
import path from 'path';

export async function loadModules() {
  const moduleDir = path.join(__dirname);
  const modules = {};
  
  const files = fs.readdirSync(moduleDir);
  
  for (const file of files) {
    if (file === 'index.js') continue;
    if (file.endsWith('.js')) {
      const moduleName = file.replace('.js', '');
      modules[moduleName] = require(path.join(moduleDir, file));
    }
  }
  
  return modules;
}`
            },
            {
              id: 'file-4',
              name: 'fileScanner.js',
              type: 'file',
              language: 'javascript',
              content: `// File scanner module
import fs from 'fs';
import path from 'path';

export function scanDirectory(dirPath) {
  const results = [];
  
  function traverse(currentPath, relativePath = '') {
    const entries = fs.readdirSync(currentPath);
    
    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry);
      const stats = fs.statSync(fullPath);
      
      if (stats.isDirectory()) {
        const newRelativePath = path.join(relativePath, entry);
        results.push({
          type: 'directory',
          name: entry,
          path: newRelativePath
        });
        traverse(fullPath, newRelativePath);
      } else {
        results.push({
          type: 'file',
          name: entry,
          path: path.join(relativePath, entry),
          size: stats.size
        });
      }
    }
  }
  
  traverse(dirPath);
  return results;
}`
            }
          ]
        },
        {
          id: 'file-5',
          name: 'database.js',
          type: 'file',
          language: 'javascript',
          content: `// Database setup and connection
import { createClient } from 'some-db-library';

let dbClient = null;

export async function setupDatabase() {
  try {
    dbClient = createClient({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || 'admin',
      password: process.env.DB_PASSWORD || 'password'
    });
    
    await dbClient.connect();
    console.log('Database connected successfully');
    return dbClient;
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
}

export function getDbClient() {
  if (!dbClient) {
    throw new Error('Database not initialized');
  }
  return dbClient;
}`
        }
      ]
    },
    {
      id: 'root-2',
      name: 'config',
      type: 'folder',
      children: [
        {
          id: 'file-6',
          name: 'default.json',
          type: 'file',
          language: 'json',
          content: `{
  "server": {
    "port": 3000,
    "host": "localhost"
  },
  "database": {
    "host": "localhost",
    "port": 5432,
    "user": "admin",
    "password": "password"
  },
  "logging": {
    "level": "info",
    "format": "json"
  }
}`
        }
      ]
    },
    {
      id: 'root-3',
      name: 'README.md',
      type: 'file',
      language: 'markdown',
      content: `# Ollama Agent

An intelligent AI agent that scans your codebase, understands the system architecture, and helps you develop new features, fix bugs, and improve your code.

## Features

- Project file scanning
- Code analysis
- Intelligent development assistance
- Module generation
- Bug detection and fixing

## Getting Started

1. Clone this repository
2. Install dependencies: \`npm install\`
3. Start the agent: \`npm start\`

## Usage

Provide a prompt describing what you want to do with your codebase, and the agent will:
- Analyze your project structure
- Understand the system architecture
- Make appropriate modifications
- Generate new code as needed
- Fix bugs and improve existing code`
    }
  ]);

  useEffect(() => {
    // Initialize project stats
    const updateStats = async () => {
      const projectStats = await getProjectStats(files);
      setStats(projectStats);
    };
    
    updateStats();
  }, [files]);

  const selectedFile = selectedFileId 
    ? findFile(files, selectedFileId)
    : null;

  function findFile(nodes: FileNode[], id: string): FileNode | null {
    for (const node of nodes) {
      if (node.id === id) {
        return node;
      }
      if (node.type === 'folder' && node.children) {
        const found = findFile(node.children, id);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }

  const handleFileSelect = (file: FileNode) => {
    setSelectedFileId(file.id);
    if (activeTab === 'home' || activeTab === 'explorer') {
      setActiveTab('editor');
    }
  };

  const handlePromptSubmit = async (prompt: string) => {
    setIsProcessing(true);
    setOutputTab('response');
    
    try {
      const result = await processPrompt(prompt, files);
      setResponse(result.response);
      setActions(result.actions);
      
      toast({
        title: "Analysis Complete",
        description: "The AI has finished analyzing your prompt.",
      });
    } catch (error) {
      console.error('Error processing prompt:', error);
      toast({
        title: "Processing Error",
        description: "An error occurred while processing your prompt.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContentChange = (fileId: string, content: string) => {
    setFiles(prevFiles => updateFileContent(prevFiles, fileId, content));
  };

  function updateFileContent(nodes: FileNode[], id: string, content: string): FileNode[] {
    return nodes.map(node => {
      if (node.id === id) {
        return { ...node, content };
      }
      if (node.type === 'folder' && node.children) {
        return {
          ...node,
          children: updateFileContent(node.children, id, content)
        };
      }
      return node;
    });
  }

  const handleNewFile = () => {
    const createNewFile = (parentFolderId: string | null = null) => {
      const newFileId = `file-${Date.now()}`;
      const newFileName = `newfile.js`;
      const newFile: FileNode = {
        id: newFileId,
        name: newFileName,
        type: 'file',
        language: 'javascript',
        content: '// Add your code here\n'
      };
      
      if (parentFolderId) {
        // Add to specific folder
        setFiles(prevFiles => addFileToFolder(prevFiles, parentFolderId, newFile));
      } else {
        // Add to root level
        setFiles(prevFiles => [...prevFiles, newFile]);
      }
      
      setSelectedFileId(newFileId);
      setActiveTab('editor');
      
      toast({
        title: "New File Created",
        description: `${newFileName} has been created successfully.`,
      });
    };
    
    // For simplicity, we're creating at root level
    createNewFile();
  };
  
  function addFileToFolder(nodes: FileNode[], folderId: string, newFile: FileNode): FileNode[] {
    return nodes.map(node => {
      if (node.id === folderId && node.type === 'folder') {
        return {
          ...node,
          children: [...(node.children || []), newFile]
        };
      }
      if (node.type === 'folder' && node.children) {
        return {
          ...node,
          children: addFileToFolder(node.children, folderId, newFile)
        };
      }
      return node;
    });
  }

  const handleDeleteFile = () => {
    if (!selectedFileId) return;
    
    setFiles(prevFiles => removeFile(prevFiles, selectedFileId));
    setSelectedFileId(null);
    
    toast({
      title: "File Deleted",
      description: "The selected file has been deleted.",
    });
  };
  
  function removeFile(nodes: FileNode[], id: string): FileNode[] {
    return nodes.filter(node => {
      if (node.id === id) {
        return false;
      }
      if (node.type === 'folder' && node.children) {
        node.children = removeFile(node.children, id);
      }
      return true;
    });
  }

  const handleSaveChanges = () => {
    // In a real app, this would save to a backend
    console.log('Saving changes to files:', files);
    
    toast({
      title: "Changes Saved",
      description: "All changes have been saved successfully.",
    });
  };

  const handleRunCode = () => {
    if (!selectedFileId || !selectedFile) return;
    
    // Switch to terminal tab to show output
    setActiveTab('terminal');
    setOutputTab('terminal');
    
    // Execute appropriate command based on file type
    const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
    
    setTimeout(() => {
      if (terminalRef.current) {
        if (fileExtension === 'js' || fileExtension === 'jsx') {
          terminalRef.current.executeCommand(`node ${selectedFile.name}`);
        } else if (fileExtension === 'ts' || fileExtension === 'tsx') {
          terminalRef.current.executeCommand(`ts-node ${selectedFile.name}`);
        } else if (fileExtension === 'py') {
          terminalRef.current.executeCommand(`python ${selectedFile.name}`);
        } else if (fileExtension === 'html') {
          terminalRef.current.executeCommand(`open ${selectedFile.name}`);
        } else {
          terminalRef.current.executeCommand(`run ${selectedFile.name}`);
        }
      }
    }, 300);
    
    toast({
      title: "Running Code",
      description: `Executing ${selectedFile.name}...`,
    });
  };
  
  const handleIndexComplete = (indexedFiles: FileNode[]) => {
    // In a real implementation, we would merge with existing files or replace them
    // For demo purposes, we'll just add them to the existing files
    setFiles(prevFiles => [...prevFiles, ...indexedFiles]);
    
    toast({
      title: "Project Indexed",
      description: `${indexedFiles.length} new files have been indexed.`,
    });
  };
  
  const handleChangeTab = (tab: string) => {
    setActiveTab(tab);
    
    if (tab === 'terminal' && terminalRef.current) {
      // Focus the terminal when switching to its tab
      setTimeout(() => {
        terminalRef.current?.focus();
      }, 100);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col">
      <header className="bg-sidebar-border h-12 border-b border-sidebar-border flex items-center px-4">
        <h1 className="text-lg font-semibold flex items-center">
          <span className="text-primary mr-1">Ollama</span> Agent
          <Sparkles className="h-4 w-4 text-accent ml-2" />
        </h1>
      </header>
      
      <main className="flex-1 flex overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          onChangeTab={handleChangeTab}
          onNewFile={handleNewFile}
          onDeleteFile={handleDeleteFile}
          onSaveChanges={handleSaveChanges}
          onRunCode={handleRunCode}
          selectedFileId={selectedFileId}
        />
        
        <div className="flex-1 flex">
          {/* Left panel - Always visible */}
          <div className="w-64 border-r border-border">
            <FileExplorer 
              files={files}
              onFileSelect={handleFileSelect}
              selectedFileId={selectedFileId}
            />
          </div>
          
          {/* Middle panel - Changes based on active tab */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {activeTab === 'home' && (
              <div className="flex-1 p-6 overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6 font-playfair">Welcome to Ollama Agent</h2>
                <p className="mb-4">
                  This intelligent agent helps you develop your codebase by analyzing your project structure,
                  understanding the system architecture, and implementing improvements based on your prompts.
                </p>
                
                {/* Project Indexer section */}
                <div className="mb-6">
                  <ProjectIndexer onIndexComplete={handleIndexComplete} />
                </div>
                
                {/* MCP Server Manager section */}
                <div className="mb-6">
                  <MCPServerManager />
                </div>
                
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mb-6">
                  <div className="glass-card p-4">
                    <h3 className="text-lg font-medium mb-2 font-playfair">Getting Started</h3>
                    <ol className="list-decimal list-inside space-y-2 text-sm">
                      <li>Explore your project files in the left sidebar</li>
                      <li>Use the prompt input at the bottom to describe what you want to do</li>
                      <li>The AI will analyze your codebase and suggest improvements</li>
                      <li>Review the suggested changes before applying them</li>
                    </ol>
                  </div>
                  
                  <div className="glass-card p-4">
                    <h3 className="text-lg font-medium mb-2 font-playfair">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" className="justify-start modern-button" onClick={() => setActiveTab('explorer')}>
                        Explore Project
                      </Button>
                      <Button variant="outline" size="sm" className="justify-start modern-button" onClick={() => setActiveTab('editor')}>
                        Edit Code
                      </Button>
                      <Button variant="outline" size="sm" className="justify-start modern-button" onClick={() => setActiveTab('analytics')}>
                        View Analytics
                      </Button>
                      <Button variant="outline" size="sm" className="justify-start modern-button" onClick={() => setActiveTab('settings')}>
                        Settings
                      </Button>
                    </div>
                  </div>
                </div>
                
                <ProjectAnalytics stats={stats} />
              </div>
            )}
            
            {activeTab === 'editor' && (
              <div className="flex-1 overflow-hidden">
                <MonacoEditor 
                  file={selectedFile}
                  onContentChange={handleContentChange}
                />
              </div>
            )}
            
            {activeTab === 'analytics' && (
              <div className="flex-1 p-6 overflow-y-auto">
                <h2 className="text-xl font-bold mb-4 font-playfair">Project Analytics</h2>
                <ProjectAnalytics stats={stats} />
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div className="flex-1 p-6 overflow-y-auto">
                <h2 className="text-xl font-bold mb-4 font-playfair">Settings</h2>
                
                <div className="glass-card p-4 mb-6">
                  <h3 className="text-lg font-medium mb-4 font-playfair">MCP Server Configuration</h3>
                  <MCPServerManager />
                </div>
                
                <div className="glass-card p-4">
                  <h3 className="text-lg font-medium mb-4 font-playfair">Project Indexing</h3>
                  <ProjectIndexer onIndexComplete={handleIndexComplete} />
                </div>
              </div>
            )}
            
            {activeTab === 'terminal' && (
              <div className="flex-1 overflow-hidden p-2">
                <Terminal ref={terminalRef} />
              </div>
            )}
          </div>
          
          {/* Right panel - Response/Output */}
          <div className="w-96 border-l border-border flex flex-col">
            <Tabs value={outputTab} onValueChange={(val) => setOutputTab(val as 'response' | 'terminal')} className="flex-1 flex flex-col overflow-hidden">
              <div className="border-b border-border">
                <TabsList className="bg-transparent">
                  <TabsTrigger value="response">Response</TabsTrigger>
                  <TabsTrigger value="terminal">Terminal</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="response" className="flex-1 overflow-hidden">
                <ResponseDisplay response={response} actions={actions} />
              </TabsContent>
              
              <TabsContent value="terminal" className="flex-1 overflow-hidden p-2">
                <Terminal ref={terminalRef} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <footer className="border-t border-border">
        <PromptInput onSubmit={handlePromptSubmit} isProcessing={isProcessing} />
      </footer>
      
      <Dialog open={showWelcomeDialog} onOpenChange={setShowWelcomeDialog}>
        <DialogContent className="sm:max-w-md glass-card">
          <DialogHeader>
            <DialogTitle className="text-xl font-playfair">Welcome to Ollama Agent</DialogTitle>
            <DialogDescription>
              An intelligent AI assistant for code development
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <p>
              This agent helps you develop your codebase by analyzing your project structure,
              understanding the system architecture, and implementing improvements based on your prompts.
            </p>
            
            <div className="bg-muted/50 p-3 rounded-md text-sm">
              <p className="font-medium">Try asking the agent to:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Analyze my codebase and suggest improvements</li>
                <li>Create a new module for user authentication</li>
                <li>Fix error handling in the database connection</li>
                <li>Implement a REST API for the existing data models</li>
              </ul>
            </div>
            
            <div className="bg-muted/50 p-3 rounded-md text-sm">
              <p className="font-medium">New Features:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Project Indexing - Scan your entire project structure</li>
                <li>MCP Server Management - Connect to multiple servers</li>
                <li>Monaco Editor - Advanced code editing capabilities</li>
                <li>Terminal - Command-line interface for project interaction</li>
              </ul>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={() => setShowWelcomeDialog(false)} className="modern-button">
              Get Started
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
