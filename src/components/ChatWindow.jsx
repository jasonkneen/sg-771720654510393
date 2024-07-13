import React, { useEffect, useRef, useMemo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import ChatMessage from './ChatMessage';
import WelcomeMessage from './WelcomeMessage';
import useChatScroll from '@/hooks/useChatScroll';
import performanceMonitor from '@/utils/performanceMonitor';
import { logError } from '@/utils/errorLogger';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

const ChatWindow = React.memo(({ 
  messages, 
  onShare,
  onEdit,
  onDelete,
  editingMessageId,
  setEditingMessageId,
  onAddReaction,
  onRemoveReaction,
  onReply
}) => {
  const chatContainerRef = useChatScroll(messages);
  const listRef = useRef(null);

  useEffect(() => {
    performanceMonitor.start('ChatWindow-useEffect');
    try {
      if (listRef.current) {
        listRef.current.scrollToItem(messages.length - 1, 'end');
      }
    } catch (error) {
      logError(error, { context: 'ChatWindow - useEffect' });
    }
    performanceMonitor.end('ChatWindow-useEffect');
  }, [messages]);

  const MessageItem = React.memo(({ index, style }) => {
    const message = messages[index];
    return (
      <div style={style}>
        <ChatMessage
          key={message.id}
          message={message}
          onShare={onShare}
          onEdit={onEdit}
          onDelete={onDelete}
          isEditing={editingMessageId === message.id}
          setEditingMessageId={setEditingMessageId}
          onAddReaction={onAddReaction}
          onRemoveReaction={onRemoveReaction}
          onReply={onReply}
        />
      </div>
    );
  });

  const memoizedMessages = useMemo(() => messages, [messages]);

  return (
    <ScrollArea className="flex-1 p-4 chat-background" ref={chatContainerRef}>
      {messages.length === 0 ? (
        <WelcomeMessage />
      ) : (
        <AutoSizer>
          {({ height, width }) => (
            <List
              ref={listRef}
              height={height}
              itemCount={memoizedMessages.length}
              itemSize={100} // Adjust this value based on your average message height
              width={width}
              itemData={memoizedMessages}
            >
              {MessageItem}
            </List>
          )}
        </AutoSizer>
      )}
    </ScrollArea>
  );
});

ChatWindow.displayName = 'ChatWindow';

export default ChatWindow;