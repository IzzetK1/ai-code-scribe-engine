
import React, { useState } from 'react';
import { Send, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface PromptInputProps {
  onSubmit: (prompt: string) => Promise<void>;
  isProcessing: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({ onSubmit, isProcessing }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = async () => {
    if (!prompt.trim() || isProcessing) return;
    
    try {
      await onSubmit(prompt);
      setPrompt('');
    } catch (error) {
      console.error('Error processing prompt:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-border p-4 bg-background/80 backdrop-blur-sm">
      <div className="flex items-start gap-3">
        <div className="relative flex-1">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe what you want the AI to do with your codebase..."
            className={cn(
              "flex-1 min-h-[80px] max-h-[200px] resize-none bg-muted/30 pr-10",
              "focus:ring-1 focus:ring-offset-0 focus:ring-primary modern-input"
            )}
            disabled={isProcessing}
          />
          <Sparkles 
            className={cn(
              "absolute right-3 top-3 h-4 w-4 text-muted-foreground transition-opacity",
              prompt.length > 0 ? "opacity-0" : "opacity-100"
            )} 
          />
        </div>
        <Button 
          onClick={handleSubmit}
          className="h-10 px-4 modern-button"
          disabled={!prompt.trim() || isProcessing}
        >
          {isProcessing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          <span className="ml-2">Send</span>
        </Button>
      </div>
      <div className="text-xs text-muted-foreground mt-2 flex items-center justify-between">
        <div>
          Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Ctrl</kbd>+<kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Enter</kbd> to send message
        </div>
        <div className="text-right">
          <span className="text-primary">AI-powered</span> code assistant
        </div>
      </div>
    </div>
  );
};

export default PromptInput;
