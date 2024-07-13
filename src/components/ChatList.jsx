import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { handleComponentError } from '@/utils/componentErrorHandler';

const ChatList = ({ chats, currentChatIndex, onSelectChat, onDeleteChat, onRenameChat }) => {
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.focus();
    }
  }, []);

  const handleKeyDown = (e, index) => {
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        if (index > 0) onSelectChat(index - 1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (index < chats.length - 1) onSelectChat(index + 1);
        break;
      case 'Enter':
        e.preventDefault();
        onSelectChat(index);
        break;
      default:
        break;
    }
  };

  const handleSelect = (index) => {
    try {
      onSelectChat(index);
    } catch (error) {
      handleComponentError(error, 'ChatList - Select Chat');
    }
  };

  const handleDelete = (index, e) => {
    e.stopPropagation();
    try {
      onDeleteChat(index);
    } catch (error) {
      handleComponentError(error, 'ChatList - Delete Chat');
    }
  };

  const handleRename = (index, e) => {
    e.stopPropagation();
    const newName = prompt('Enter new chat name:');
    if (newName) {
      try {
        onRenameChat(index, newName);
      } catch (error) {
        handleComponentError(error, 'ChatList - Rename Chat');
      }
    }
  };

  return (
    <ScrollArea className="h-full">
      <div 
        className="p-4 space-y-2" 
        role="listbox" 
        aria-label="Chat list" 
        ref={listRef}
        tabIndex="0"
      >
        {chats.map((chat, index) => (
          <div
            key={chat.id}
            className={`flex items-center justify-between p-2 rounded-lg ${
              currentChatIndex === index ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
            }`}
            role="option"
            aria-selected={currentChatIndex === index}
            tabIndex="0"
            onKeyDown={(e) => handleKeyDown(e, index)}
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
                aria-label={`Rename chat ${chat.name}`}
              >
                ✏️
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => handleDelete(index, e)}
                aria-label={`Delete chat ${chat.name}`}
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