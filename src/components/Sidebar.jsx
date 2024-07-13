import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { PlusCircle, MessageSquare } from 'lucide-react';

const Sidebar = ({ chatHistory, onNewChat, onSelectChat }) => {
  return (
    <div className="w-64 border-r bg-muted/50 flex flex-col">
      <div className="p-4">
        <Button className="w-full" onClick={onNewChat}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </div>
      <Separator />
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {chatHistory.map((chat, index) => (
            <Button
              key={index}
              variant="ghost"
              className="w-full justify-start"
              onClick={() => onSelectChat(index)}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Chat {index + 1}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Sidebar;