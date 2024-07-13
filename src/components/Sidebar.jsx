import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, MessageSquare, Search, Edit2 } from 'lucide-react';

const Sidebar = ({ chatHistory, onNewChat, onSelectChat, currentChatIndex }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);

  const filteredChats = chatHistory.filter((chat) =>
    chat.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRename = (index, newName) => {
    // Implement chat renaming logic here
    setEditingIndex(null);
  };

  return (
    <div className="w-64 border-r bg-muted/50 flex flex-col">
      <div className="p-4">
        <Button className="w-full" onClick={onNewChat}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </div>
      <div className="px-4 py-2">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder="Search chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <Separator />
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {filteredChats.map((chat, index) => (
            <div key={chat.id} className="flex items-center space-x-2">
              <Button
                variant={currentChatIndex === index ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => onSelectChat(index)}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                {editingIndex === index ? (
                  <Input
                    value={chat.name || `Chat ${index + 1}`}
                    onChange={(e) => handleRename(index, e.target.value)}
                    onBlur={() => setEditingIndex(null)}
                    onKeyPress={(e) => e.key === 'Enter' && setEditingIndex(null)}
                    autoFocus
                  />
                ) : (
                  <span className="truncate">{chat.name || `Chat ${index + 1}`}</span>
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditingIndex(index)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Sidebar;