import React from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Download } from 'lucide-react';

const Header = ({ onExport, children }) => {
  const { theme, setTheme } = useTheme();

  return (
    <header className="flex items-center justify-between p-4 border-b bg-background">
      <h1 className="text-2xl font-bold">AI Coding Assistant</h1>
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
        {children}
      </div>
    </header>
  );
};

export default Header;