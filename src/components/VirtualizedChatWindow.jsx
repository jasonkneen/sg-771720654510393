import React, { useEffect, useRef, useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { motion } from 'framer-motion';
import WelcomeMessage from './WelcomeMessage';
import LoadingSpinner from './LoadingSpinner';
import ChatMessage from './ChatMessage';
import ErrorMessage from './ErrorMessage';
import { handleComponentError } from '@/utils/componentErrorHandler';
import useChatScroll from '@/hooks/useChatScroll';
import useMessageOperations from '@/hooks/useMessageOperations';
import useMessageThreading from '@/hooks/useMessageThreading';

const VirtualizedChatWindow = React.memo(({ 
  messages, 
  onShare, 
  isLoading, 
  updateChatHistory,
  editingMessageId,
  setEditingMessageId,
  handleEditMessage,
  handleDeleteMessage,
  reactionMessageId,
  setReactionMessageId,
  handleAddReaction,
  handleRemoveReaction,
}) => {
  const listRef = useRef(null);
  const chatContainerRef = useChatScroll(messages);
  const { handleReply, handleAddReply, handleDeleteReply } = useMessageThreading(updateChatHistory);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollToItem(messages.length - 1, 'end');
    }
  }, [messages]);

  const memoizedMessages = useMemo(() => messages, [messages]);

  const MessageItem = ({ index, style }) => {
    const message = memoizedMessages[index];
    return (
      <div style={style}>
        <ChatMessage
          message={message}
          onShare={onShare}
          onEdit={handleEditMessage}
          onDelete={handleDeleteMessage}
          isEditing={editingMessageId === message.id}
          setEditingMessageId={setEditingMessageId}
          onAddReaction={handleAddReaction}
          onRemoveReaction={handleRemoveReaction}
          onReply={handleReply}
        />
      </div>
    );
  };

  if (isLoading) {
    return <LoadingSpinner size="large" className="h-full" />;
  }

  return (
    <div className="flex-1 overflow-hidden" ref={chatContainerRef}>
      {messages.length === 0 ? (
        <WelcomeMessage />
      ) : (
        <AutoSizer>
          {({ height, width }) => (
            <List
              ref={listRef}
              height={height}
              itemCount={memoizedMessages.length}
              itemSize={100}
              width={width}
              className="chat-messages"
            >
              {MessageItem}
            </List>
          )}
        </AutoSizer>
      )}
    </div>
  );
});

VirtualizedChatWindow.displayName = 'VirtualizedChatWindow';

export default VirtualizedChatWindow;