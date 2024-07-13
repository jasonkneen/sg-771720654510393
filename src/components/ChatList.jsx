import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { handleError } from '@/utils/errorHandler';

const ChatList = ({ chats, currentChatIndex, onSelectChat, onDeleteChat, onRenameChat }) => {
  const handleSelect = (index) => {
    try {
      onSelectChat(index);
    } catch (error) {
      handleError(error, 'Error selecting chat');
    }
  };

  const handleDelete = (index, e) => {
    e.stopPropagation();
    try {
      onDeleteChat(index);
    } catch (error) {
      handleError(error, 'Error deleting chat');
    }
  };

  const handleRename = (index, e) => {
    e.stopPropagation();
    const newName = prompt('Enter new chat name:');
    if (newName) {
      try {
        onRenameChat(index, newName);
      } catch (error) {
        handleError(error, 'Error renaming chat');
      }
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-2">
        {chats.map((chat, index) => (
          <div
            key={chat.id}
            className={`flex items-center justify-between p-2 rounded-lg ${
              currentChatIndex === index ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
            }`}
          >
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => handleSelect(index)}
            >
              {chat.name}
            </Button>
            <div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => handleRename(index, e)}
                aria-label="Rename chat"
              >
                ✏️
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => handleDelete(index, e)}
                aria-label="Delete chat"
              >
                🗑️
              </Button>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default ChatList;