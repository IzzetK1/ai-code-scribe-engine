
import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
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
    <div className="border-t border-border p-4">
      <div className="flex items-start gap-3">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe what you want the AI to do with your codebase..."
          className={cn(
            "flex-1 min-h-[80px] max-h-[200px] resize-none bg-muted/50",
            "focus:ring-1 focus:ring-offset-0 focus:ring-ring"
          )}
          disabled={isProcessing}
        />
        <Button 
          onClick={handleSubmit}
          className="h-10 px-4"
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
      <div className="text-xs text-muted-foreground mt-2">
        Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Ctrl</kbd>+<kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Enter</kbd> to send message
      </div>
    </div>
  );
};

export default PromptInput;
