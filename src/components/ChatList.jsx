import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { handleComponentError } from '@/utils/componentErrorHandler';
import performanceMonitor from '@/utils/performanceMonitor';
import { logError } from '@/utils/errorLogger';

const ChatList = ({ chats, currentChatIndex, onSelectChat, onDeleteChat, onRenameChat }) => {
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.focus();
    }
  }, []);

  const handleKeyDown = (e, index) => {
    performanceMonitor.start('ChatList-handleKeyDown');
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
    performanceMonitor.end('ChatList-handleKeyDown');
  };

  const handleSelect = (index) => {
    performanceMonitor.start('ChatList-handleSelect');
    try {
      onSelectChat(index);
    } catch (error) {
      handleComponentError(error, 'ChatList - Select Chat');
      logError(error, { context: 'ChatList - handleSelect' });
    }
    performanceMonitor.end('ChatList-handleSelect');
  };

  const handleDelete = (index, e) => {
    performanceMonitor.start('ChatList-handleDelete');
    e.stopPropagation();
    try {
      onDeleteChat(index);
    } catch (error) {
      handleComponentError(error, 'ChatList - Delete Chat');
      logError(error, { context: 'ChatList - handleDelete' });
    }
    performanceMonitor.end('ChatList-handleDelete');
  };

  const handleRename = (index, e) => {
    performanceMonitor.start('ChatList-handleRename');
    e.stopPropagation();
    const newName = prompt('Enter new chat name:');
    if (newName) {
      try {
        onRenameChat(index, newName);
      } catch (error) {
        handleComponentError(error, 'ChatList - Rename Chat');
        logError(error, { context: 'ChatList - handleRename' });
      }
    }
    performanceMonitor.end('ChatList-handleRename');
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
              {chat.name} ({chat.messages.length})
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