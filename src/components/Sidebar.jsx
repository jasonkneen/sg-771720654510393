import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const Sidebar = ({ chatHistory }) => {
  return (
    <div className="w-64 border-r bg-muted/50">
      <div className="p-4 font-semibold">Chat History</div>
      <Separator />
      <ScrollArea className="h-[calc(100vh-60px)]">
        <div className="p-4 space-y-2">
          {chatHistory.map((chat, index) => (
            <div key={index} className="p-2 rounded hover:bg-muted cursor-pointer">
              Chat {index + 1}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Sidebar;