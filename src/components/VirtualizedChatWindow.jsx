import React, { useEffect, useRef } from 'react';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { motion } from 'framer-motion';
import WelcomeMessage from './WelcomeMessage';
import LoadingSpinner from './LoadingSpinner';
import ChatMessage from './ChatMessage';
import ErrorMessage from './ErrorMessage';
import { handleComponentError } from '@/utils/componentErrorHandler';
import { scrollToBottom } from '@/utils/chatPositioning';

const VirtualizedChatWindow = React.memo(({ messages, onShare, isLoading }) => {
  const listRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollToItem(messages.length - 1, 'end');
    }
    scrollToBottom(containerRef);
  }, [messages]);

  const MessageItem = ({ index, style }) => {
    const message = messages[index];
    return (
      <div style={style}>
        <ChatMessage
          message={message}
          onShare={onShare}
        />
      </div>
    );
  };

  if (isLoading) {
    return <LoadingSpinner size="large" className="h-full" />;
  }

  return (
    <div className="flex-1 overflow-hidden" ref={containerRef}>
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