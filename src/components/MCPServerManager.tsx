
import React, { useState } from 'react';
import { Server, Plus, Trash2, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

interface ServerConfig {
  id: string;
  name: string;
  host: string;
  port: number;
  isOnline: boolean;
}

const MCPServerManager: React.FC = () => {
  const { toast } = useToast();
  const [servers, setServers] = useState<ServerConfig[]>([
    { id: '1', name: 'Local Server', host: 'localhost', port: 11434, isOnline: true },
    { id: '2', name: 'Development Server', host: '192.168.1.100', port: 11434, isOnline: false },
  ]);
  const [isAddingServer, setIsAddingServer] = useState(false);
  const [newServer, setNewServer] = useState({ name: '', host: '', port: 11434 });
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  
  const handleAddServer = () => {
    if (!newServer.name || !newServer.host) {
      toast({
        title: "Validation Error",
        description: "Server name and host are required",
        variant: "destructive",
      });
      return;
    }
    
    const id = Date.now().toString();
    setServers([...servers, { 
      id, 
      name: newServer.name, 
      host: newServer.host, 
      port: newServer.port, 
      isOnline: false 
    }]);
    
    setNewServer({ name: '', host: '', port: 11434 });
    setIsAddingServer(false);
    
    toast({
      title: "Server Added",
      description: `${newServer.name} has been added to your servers list`,
    });
  };
  
  const handleDeleteServer = (id: string) => {
    setServers(servers.filter(server => server.id !== id));
    
    toast({
      title: "Server Removed",
      description: "The server has been removed from your list",
    });
  };
  
  const handleCheckStatus = async () => {
    setIsCheckingStatus(true);
    
    // Simulate checking server status
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update server status randomly for demo
      setServers(servers.map(server => ({
        ...server,
        isOnline: Math.random() > 0.3 // 70% chance to be online for demo
      })));
      
      toast({
        title: "Status Check Complete",
        description: "All server statuses have been updated",
      });
    } catch (error) {
      toast({
        title: "Status Check Failed",
        description: "Failed to check server status",
        variant: "destructive",
      });
    } finally {
      setIsCheckingStatus(false);
    }
  };
  
  return (
    <div className="glass-card p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-foreground flex items-center">
          <Server className="mr-2 h-5 w-5 text-primary" />
          MCP Servers
        </h2>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="modern-button"
            onClick={handleCheckStatus}
            disabled={isCheckingStatus}
          >
            {isCheckingStatus ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            <span className="ml-1 hidden sm:inline">Refresh</span>
          </Button>
          
          <Dialog open={isAddingServer} onOpenChange={setIsAddingServer}>
            <DialogTrigger asChild>
              <Button variant="default" size="sm" className="modern-button">
                <Plus className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Add Server</span>
              </Button>
            </DialogTrigger>
            
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add MCP Server</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Server Name</label>
                  <Input 
                    value={newServer.name}
                    onChange={(e) => setNewServer({...newServer, name: e.target.value})}
                    placeholder="My MCP Server"
                    className="modern-input"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Host</label>
                  <Input 
                    value={newServer.host}
                    onChange={(e) => setNewServer({...newServer, host: e.target.value})}
                    placeholder="localhost or IP address"
                    className="modern-input"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Port</label>
                  <Input 
                    type="number"
                    value={newServer.port.toString()}
                    onChange={(e) => setNewServer({...newServer, port: parseInt(e.target.value) || 11434})}
                    placeholder="11434"
                    className="modern-input"
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleAddServer} className="modern-button">
                    Add Server
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="space-y-2">
        {servers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No servers added yet</p>
            <p className="text-sm">Click "Add Server" to add your first MCP server</p>
          </div>
        ) : (
          servers.map(server => (
            <div 
              key={server.id}
              className="flex items-center justify-between bg-secondary/50 p-3 rounded-md"
            >
              <div className="flex flex-col">
                <div className="font-medium text-foreground flex items-center">
                  {server.name}
                  <Badge 
                    variant={server.isOnline ? "default" : "destructive"} 
                    className="ml-2 text-xs"
                  >
                    {server.isOnline ? 'Online' : 'Offline'}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  {server.host}:{server.port}
                </div>
              </div>
              
              <div className="flex items-center">
                {server.isOnline ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                ) : (
                  <XCircle className="h-4 w-4 text-destructive mr-2" />
                )}
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteServer(server.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MCPServerManager;
