import React, { useEffect, useRef } from 'react';
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

const VirtualizedChatWindow = React.memo(({ messages, onShare, isLoading, updateChatHistory }) => {
  const listRef = useRef(null);
  const chatContainerRef = useChatScroll(messages);
  const {
    editingMessageId,
    setEditingMessageId,
    handleEditMessage,
    handleDeleteMessage,
  } = useMessageOperations(updateChatHistory);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollToItem(messages.length - 1, 'end');
    }
  }, [messages]);

  const MessageItem = ({ index, style }) => {
    const message = messages[index];
    return (
      <div style={style}>
        <ChatMessage
          message={message}
          onShare={onShare}
          onEdit={handleEditMessage}
          onDelete={handleDeleteMessage}
          isEditing={editingMessageId === message.id}
          setEditingMessageId={setEditingMessageId}
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
              itemCount={messages.length}
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