
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ResponseDisplayProps {
  response: string;
  actions: {
    title: string;
    description: string;
    status: 'pending' | 'complete' | 'error';
    output?: string;
  }[];
}

const ResponseDisplay: React.FC<ResponseDisplayProps> = ({ response, actions }) => {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <Tabs defaultValue="response" className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b border-border">
          <TabsList className="bg-transparent">
            <TabsTrigger value="response">Response</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="response" className="flex-1 overflow-auto p-4">
          <div className="prose prose-invert max-w-none">
            {response ? (
              <div dangerouslySetInnerHTML={{ __html: response.replace(/\n/g, '<br/>') }} />
            ) : (
              <div className="text-muted-foreground italic">
                AI response will appear here...
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="actions" className="flex-1 overflow-auto p-4">
          {actions.length > 0 ? (
            <div className="space-y-4">
              {actions.map((action, index) => (
                <div key={index} className="border border-border rounded-md p-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      action.status === 'complete' ? 'bg-green-500' : 
                      action.status === 'error' ? 'bg-red-500' : 
                      'bg-yellow-500'
                    }`} />
                    <h3 className="text-sm font-medium">{action.title}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{action.description}</p>
                  
                  {action.output && (
                    <div className="mt-2 bg-muted/30 rounded p-2 text-xs font-mono whitespace-pre overflow-x-auto">
                      {action.output}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground italic">
              No actions performed yet...
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResponseDisplay;
