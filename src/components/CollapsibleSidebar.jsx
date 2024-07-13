import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronLeft, ChevronRight, PlusCircle, MessageSquare, Search, Edit2, Trash2 } from 'lucide-react';

const CollapsibleSidebar = ({ chatHistory, onNewChat, onSelectChat, onRenameChat, onDeleteChat, currentChatIndex }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const filteredChats = chatHistory.filter((chat) =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRename = (index, newName) => {
    onRenameChat(index, newName);
    setEditingIndex(null);
  };

  return (
    <motion.div
      className="relative bg-muted/50 border-r border-border"
      animate={{ width: isCollapsed ? '60px' : '256px' }}
      transition={{ duration: 0.3 }}
    >
      {isCollapsed ? (
        <div className="h-full flex flex-col items-center py-4">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mb-4">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onNewChat} className="mb-4">
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="h-full flex flex-col">
          <div className="p-4 flex justify-between items-center">
            <Button className="w-full" onClick={onNewChat}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Chat
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <ChevronLeft className="h-4 w-4" />
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
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-2">
              {filteredChats.map((chat, index) => (
                <div key={chat.id} className="flex items-center space-x-2 group">
                  <Button
                    variant={currentChatIndex === index ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => onSelectChat(index)}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    {editingIndex === index ? (
                      <Input
                        value={chat.name}
                        onChange={(e) => handleRename(index, e.target.value)}
                        onBlur={() => setEditingIndex(null)}
                        onKeyPress={(e) => e.key === 'Enter' && setEditingIndex(null)}
                        autoFocus
                        className="w-full"
                      />
                    ) : (
                      <span className="truncate">{chat.name}</span>
                    )}
                  </Button>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingIndex(index)}
                      className="h-8 w-8"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteChat(index)}
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </motion.div>
  );
};

export default CollapsibleSidebar;