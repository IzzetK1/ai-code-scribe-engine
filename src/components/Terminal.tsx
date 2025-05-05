
import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import 'xterm/css/xterm.css';
import { Button } from '@/components/ui/button';
import { Maximize, Minimize, Terminal as TerminalIcon } from 'lucide-react';

export interface TerminalRef {
  executeCommand: (command: string) => void;
  clear: () => void;
  focus: () => void;
}

interface TerminalProps {
  onResize?: () => void;
}

const Terminal = forwardRef<TerminalRef, TerminalProps>(({ onResize }, ref) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon>(new FitAddon());
  const [isMaximized, setIsMaximized] = React.useState(false);
  
  // Expose methods to parent components
  useImperativeHandle(ref, () => ({
    executeCommand: (command: string) => {
      if (xtermRef.current) {
        xtermRef.current.writeln(`\r\n$ ${command}`);
        processCommand(command);
      }
    },
    clear: () => {
      if (xtermRef.current) {
        xtermRef.current.clear();
      }
    },
    focus: () => {
      if (xtermRef.current) {
        xtermRef.current.focus();
      }
    }
  }));
  
  const processCommand = (command: string) => {
    if (!xtermRef.current) return;
    
    const trimmedCommand = command.trim();
    
    if (trimmedCommand === 'help') {
      xtermRef.current.writeln('\r\nAvailable commands:');
      xtermRef.current.writeln('  help     - Show this help message');
      xtermRef.current.writeln('  clear    - Clear the terminal');
      xtermRef.current.writeln('  version  - Show Ollama agent version');
      xtermRef.current.writeln('  ls       - List files in current directory');
      xtermRef.current.writeln('  echo     - Echo a message');
      xtermRef.current.writeln('  run      - Run the current file');
      xtermRef.current.writeln('  build    - Build the project');
    } else if (trimmedCommand === 'clear') {
      xtermRef.current.clear();
    } else if (trimmedCommand === 'version') {
      xtermRef.current.writeln('\r\nOllama Agent v1.0.0');
    } else if (trimmedCommand === 'ls') {
      xtermRef.current.writeln('\r\nsrc/');
      xtermRef.current.writeln('config/');
      xtermRef.current.writeln('README.md');
    } else if (trimmedCommand === 'run') {
      xtermRef.current.writeln('\r\nRunning current file...');
      xtermRef.current.writeln('\r\n[INFO] Starting development server');
      setTimeout(() => {
        xtermRef.current?.writeln('\r\n[SUCCESS] Application running at http://localhost:3000');
      }, 1500);
    } else if (trimmedCommand === 'build') {
      xtermRef.current.writeln('\r\nBuilding project...');
      simulateBuild();
    } else if (trimmedCommand.startsWith('echo ')) {
      const message = trimmedCommand.slice(5);
      xtermRef.current.writeln(`\r\n${message}`);
    } else if (trimmedCommand !== '') {
      xtermRef.current.writeln(`\r\nCommand not found: ${trimmedCommand}`);
    }
    
    // Add a new prompt after command execution
    setTimeout(() => {
      if (xtermRef.current) {
        xtermRef.current.write('\r\n$ ');
      }
    }, 100);
  };
  
  const simulateBuild = () => {
    if (!xtermRef.current) return;
    
    const steps = [
      { message: '[1/4] Resolving dependencies...', delay: 800 },
      { message: '[2/4] Compiling modules...', delay: 1500 },
      { message: '[3/4] Optimizing and bundling...', delay: 2000 },
      { message: '[4/4] Generating output files...', delay: 1200 },
      { message: '[SUCCESS] Project built successfully! Output directory: ./dist', delay: 0 }
    ];
    
    let totalDelay = 0;
    
    steps.forEach((step) => {
      totalDelay += step.delay;
      setTimeout(() => {
        xtermRef.current?.writeln(`\r\n${step.message}`);
      }, totalDelay);
    });
  };
  
  useEffect(() => {
    if (!terminalRef.current) return;
    
    // Initialize xterm.js
    const xterm = new XTerm({
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 14,
      theme: {
        background: '#1a1d21',
        foreground: '#f8f8f2',
        cursor: '#f8f8f2',
        cursorAccent: '#1a1d21',
        // Removed 'selection' property as it's not in ITheme type
        black: '#21222C',
        red: '#FF5555',
        green: '#50FA7B',
        yellow: '#F1FA8C',
        blue: '#BD93F9',
        magenta: '#FF79C6',
        cyan: '#8BE9FD',
        white: '#F8F8F2',
        brightBlack: '#6272A4',
        brightRed: '#FF6E6E',
        brightGreen: '#69FF94',
        brightYellow: '#FFFFA5',
        brightBlue: '#D6ACFF',
        brightMagenta: '#FF92DF',
        brightCyan: '#A4FFFF',
        brightWhite: '#FFFFFF',
      }
    });
    
    // Load addons
    xterm.loadAddon(fitAddonRef.current);
    xterm.loadAddon(new WebLinksAddon());
    
    // Open the terminal
    xterm.open(terminalRef.current);
    fitAddonRef.current.fit();
    
    // Store reference to the terminal
    xtermRef.current = xterm;
    
    // Write welcome message
    xterm.writeln('\x1b[1;34mOllama Agent Terminal\x1b[0m');
    xterm.writeln('\x1b[90mType `help` for available commands.\x1b[0m');
    xterm.write('\r\n$ ');
    
    // Handle input
    let currentLine = '';
    xterm.onKey(({ key, domEvent }) => {
      const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;
      
      if (domEvent.keyCode === 13) { // Enter key
        processCommand(currentLine);
        currentLine = '';
      } else if (domEvent.keyCode === 8) { // Backspace
        if (currentLine.length > 0) {
          currentLine = currentLine.slice(0, -1);
          xterm.write('\b \b');
        }
      } else if (printable) {
        currentLine += key;
        xterm.write(key);
      }
    });
    
    // Handle window resize
    const handleResize = () => {
      if (fitAddonRef.current) {
        fitAddonRef.current.fit();
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      xterm.dispose();
    };
  }, []);
  
  useEffect(() => {
    if (fitAddonRef.current && xtermRef.current) {
      fitAddonRef.current.fit();
    }
    
    if (onResize) {
      onResize();
    }
  }, [isMaximized, onResize]);
  
  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };
  
  return (
    <div className={`terminal-container flex flex-col border border-border ${isMaximized ? 'fixed inset-0 z-50 bg-background p-4' : 'rounded-md h-full'}`}>
      <div className="terminal-header flex items-center justify-between bg-muted/30 py-1 px-2 border-b border-border">
        <div className="flex items-center space-x-1">
          <TerminalIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Terminal</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 w-6 p-0" 
          onClick={toggleMaximize}
        >
          {isMaximized ? (
            <Minimize className="h-4 w-4" />
          ) : (
            <Maximize className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div ref={terminalRef} className="flex-1 overflow-hidden" />
    </div>
  );
});

Terminal.displayName = "Terminal";

export default Terminal;
