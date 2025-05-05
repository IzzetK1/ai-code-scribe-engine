
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Home, FolderTree, Code2, 
  BarChart2, Settings, Plus, Trash2, 
  Save, Play, History, Terminal
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface SidebarProps {
  activeTab: string;
  onChangeTab: (tab: string) => void;
  onNewFile: () => void;
  onDeleteFile: () => void;
  onSaveChanges: () => void;
  onRunCode: () => void;
  selectedFileId: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onChangeTab,
  onNewFile,
  onDeleteFile,
  onSaveChanges,
  onRunCode,
  selectedFileId
}) => {
  const { toast } = useToast();
  
  const navItems = [
    { id: 'home', icon: <Home size={20} />, label: 'Home' },
    { id: 'explorer', icon: <FolderTree size={20} />, label: 'Explorer' },
    { id: 'editor', icon: <Code2 size={20} />, label: 'Editor' },
    { id: 'analytics', icon: <BarChart2 size={20} />, label: 'Analytics' },
    { id: 'terminal', icon: <Terminal size={20} />, label: 'Terminal' },
    { id: 'settings', icon: <Settings size={20} />, label: 'Settings' }
  ];
  
  const handleRunCode = () => {
    if (!selectedFileId) {
      toast({
        title: "No file selected",
        description: "Please select a file to run.",
        variant: "destructive",
      });
      return;
    }
    
    onRunCode();
  };
  
  const handleSaveChanges = () => {
    onSaveChanges();
    toast({
      title: "Changes saved",
      description: "Your changes have been saved successfully.",
    });
  };

  return (
    <div className="h-full flex flex-col w-16 bg-sidebar border-r border-sidebar-border">
      <div className="flex-1 py-4">
        <nav className="flex flex-col items-center gap-2">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              size="icon"
              className={cn(
                "h-10 w-10 rounded-md",
                activeTab === item.id && "bg-sidebar-accent text-sidebar-accent-foreground"
              )}
              onClick={() => onChangeTab(item.id)}
              title={item.label}
            >
              {item.icon}
            </Button>
          ))}
        </nav>
      </div>

      <div className="py-4 border-t border-sidebar-border flex flex-col items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-md"
          onClick={onNewFile}
          title="New File"
        >
          <Plus size={20} />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-10 w-10 rounded-md",
            !selectedFileId && "opacity-50 cursor-not-allowed"
          )}
          onClick={onDeleteFile}
          disabled={!selectedFileId}
          title="Delete Selected File"
        >
          <Trash2 size={20} />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-md"
          onClick={handleSaveChanges}
          title="Save Changes"
        >
          <Save size={20} />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-10 w-10 rounded-md",
            !selectedFileId && "opacity-50 cursor-not-allowed"
          )}
          onClick={handleRunCode}
          disabled={!selectedFileId}
          title="Run Code"
        >
          <Play size={20} />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-md"
          title="History"
        >
          <History size={20} />
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
