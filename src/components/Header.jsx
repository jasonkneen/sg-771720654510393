import React from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Moon, Sun, Download, RefreshCw, Search, ChevronDown, PlusCircle } from 'lucide-react';

const Header = ({ onExport, onNewChat, searchTerm, setSearchTerm, showChatList, setShowChatList, children }) => {
  const { theme, setTheme } = useTheme();

  const clearCache = () => {
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          caches.delete(name);
        });
      });
    }
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  };

  return (
    <header className="flex items-center justify-between p-4 border-b bg-background">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold">AI Coding Assistant</h1>
        <Button variant="ghost" size="icon" onClick={onNewChat} title="New Chat">
          <PlusCircle className="h-5 w-5" />
        </Button>
        <div className="relative">
          <Input
            type="text"
            placeholder="Search chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 pr-4 py-2 w-64"
          />
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        <Button variant="ghost" size="icon" onClick={() => setShowChatList(!showChatList)} title="Toggle Chat List">
          <ChevronDown className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={onExport} title="Export Chat">
          <Download className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        <Button variant="ghost" size="icon" onClick={clearCache} title="Clear Cache">
          <RefreshCw className="h-5 w-5" />
        </Button>
        {children}
      </div>
    </header>
  );
};

export default Header;