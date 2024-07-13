import React, { useEffect, useRef } from 'react';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import WelcomeMessage from './WelcomeMessage';
import LoadingSpinner from './LoadingSpinner';
import ChatTimestamp from './ChatTimestamp';
import CodeSnippet from './CodeSnippet';
import ErrorMessage from './ErrorMessage';
import { handleComponentError } from '@/utils/componentErrorHandler';

const VirtualizedChatWindow = React.memo(({ messages, onShare, isLoading }) => {
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollToItem(messages.length - 1, 'end');
    }
  }, [messages]);

  const renderMessage = (message) => {
    try {
      const codeRegex = /```(\w+)?\n([\s\S]*?)```/g;
      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = codeRegex.exec(message.content)) !== null) {
        if (match.index > lastIndex) {
          parts.push({ type: 'text', content: message.content.slice(lastIndex, match.index) });
        }
        parts.push({ type: 'code', language: match[1] || 'plaintext', content: match[2] });
        lastIndex = match.index + match[0].length;
      }

      if (lastIndex < message.content.length) {
        parts.push({ type: 'text', content: message.content.slice(lastIndex) });
      }

      return parts.map((part, index) => {
        if (part.type === 'code') {
          return (
            <CodeSnippet
              key={index}
              language={part.language}
              content={part.content}
              onShare={onShare}
            />
          );
        }
        return <p key={index} className="my-2">{part.content}</p>;
      });
    } catch (error) {
      handleComponentError(error, 'Rendering message');
      return <ErrorMessage title="Error" description="Failed to render message" />;
    }
  };

  const MessageItem = ({ index, style }) => {
    const message = messages[index];
    return (
      <div style={style}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div className={`flex items-start max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} group`}>
            <Avatar className="w-8 h-8 mt-1">
              <AvatarImage src={message.sender === 'user' ? '/api/placeholder/32/32' : '/api/placeholder/32/32'} alt={message.sender === 'user' ? 'User Avatar' : 'AI Avatar'} />
              <AvatarFallback>{message.sender === 'user' ? 'U' : 'AI'}</AvatarFallback>
            </Avatar>
            <div className={`mx-2 px-3 py-2 rounded-lg ${message.sender === 'user' ? 'bg-primary text-primary-foreground dark:text-white user-message' : 'bg-muted'}`}>
              {renderMessage(message)}
              <ChatTimestamp timestamp={message.timestamp} />
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  if (isLoading) {
    return <LoadingSpinner size="large" className="h-full" />;
  }

  return (
    <div className="flex-1 overflow-hidden">
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