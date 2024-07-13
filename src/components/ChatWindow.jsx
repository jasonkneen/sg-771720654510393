import React, { useEffect, useRef, useMemo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import ChatMessage from './ChatMessage';
import WelcomeMessage from './WelcomeMessage';
import useChatScroll from '@/hooks/useChatScroll';
import performanceMonitor from '@/utils/performanceMonitor';
import { logError } from '@/utils/errorLogger';

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

  useEffect(() => {
    performanceMonitor.start('ChatWindow-useEffect');
    try {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTo(0, chatContainerRef.current.scrollHeight);
      }
    } catch (error) {
      logError(error, { context: 'ChatWindow - useEffect' });
    }
    performanceMonitor.end('ChatWindow-useEffect');
  }, [messages]);

  const memoizedMessages = useMemo(() => {
    performanceMonitor.start('ChatWindow-memoizedMessages');
    const result = messages.map((message, index) => (
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
    ));
    performanceMonitor.end('ChatWindow-memoizedMessages');
    return result;
  }, [messages, onShare, onEdit, onDelete, editingMessageId, setEditingMessageId, onAddReaction, onRemoveReaction, onReply]);

  return (
    <ScrollArea className="flex-1 p-4 chat-background" ref={chatContainerRef}>
      {messages.length === 0 ? (
        <WelcomeMessage />
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {memoizedMessages}
          </AnimatePresence>
        </div>
      )}
    </ScrollArea>
  );
});

ChatWindow.displayName = 'ChatWindow';

export default ChatWindow;