import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Keyboard } from 'lucide-react';

const KeyboardShortcuts = () => {
  const shortcuts = [
    { key: 'Ctrl/Cmd + Enter', description: 'Send message' },
    { key: 'Ctrl/Cmd + N', description: 'New chat' },
    { key: 'Ctrl/Cmd + E', description: 'Export chat' },
    { key: 'Ctrl/Cmd + F', description: 'Focus search' },
    { key: 'Ctrl/Cmd + /', description: 'Toggle keyboard shortcuts' },
    { key: 'Esc', description: 'Close modal / Clear input' },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Keyboard className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex justify-between">
              <span className="font-semibold">{shortcut.key}</span>
              <span>{shortcut.description}</span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KeyboardShortcuts;