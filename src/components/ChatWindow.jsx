import React, { useEffect, useRef, useMemo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import { Copy, Check, Share } from 'lucide-react';
import WelcomeMessage from './WelcomeMessage';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

const ChatWindow = React.memo(({ messages, onShare }) => {
  const scrollAreaRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollToItem(messages.length - 1, 'end');
    }
    hljs.highlightAll();
  }, [messages]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const renderMessage = (message) => {
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
          <div key={index} className="relative my-4 code-block">
            <pre className="p-6 bg-black rounded-md overflow-x-auto">
              <code className={`language-${part.language} text-sm`}>{part.content}</code>
            </pre>
            <div className="absolute top-2 right-2 space-x-2 code-block-icons">
              <CopyButton content={part.content} />
              <ShareButton content={part.content} onShare={onShare} />
            </div>
          </div>
        );
      }
      return <p key={index} className="my-2">{part.content}</p>;
    });
  };

  const CopyButton = React.memo(({ content }) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
      copyToClipboard(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <Button
        size="sm"
        variant="ghost"
        onClick={handleCopy}
        className="hover:bg-gray-700/50 p-1 text-gray-300"
        aria-label={copied ? "Copied" : "Copy code"}
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
    );
  });

  const ShareButton = React.memo(({ content, onShare }) => {
    return (
      <Button
        size="sm"
        variant="ghost"
        onClick={() => onShare(content)}
        className="hover:bg-gray-700/50 p-1 text-gray-300"
        aria-label="Share code snippet"
      >
        <Share className="h-4 w-4" />
      </Button>
    );
  });

  const MessageItem = React.memo(({ index, style }) => {
    const message = messages[index];
    return (
      <div style={style}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div className={`flex items-start max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} group`}>
            <Avatar className="w-8 h-8 mt-1">
              <AvatarImage src={message.sender === 'user' ? '/api/placeholder/32/32' : '/api/placeholder/32/32'} alt={message.sender === 'user' ? 'User Avatar' : 'AI Avatar'} />
              <AvatarFallback>{message.sender === 'user' ? 'U' : 'AI'}</AvatarFallback>
            </Avatar>
            <div className={`mx-2 px-3 py-2 rounded-lg ${message.sender === 'user' ? 'bg-primary text-primary-foreground user-message' : 'bg-muted'}`}>
              {renderMessage(message)}
            </div>
          </div>
        </motion.div>
      </div>
    );
  });

  const memoizedMessageList = useMemo(() => (
    <AutoSizer>
      {({ height, width }) => (
        <List
          ref={listRef}
          height={height}
          itemCount={messages.length}
          itemSize={100}
          width={width}
        >
          {MessageItem}
        </List>
      )}
    </AutoSizer>
  ), [messages]);

  return (
    <ScrollArea className="flex-1 p-4 chat-background" ref={scrollAreaRef}>
      {messages.length === 0 ? (
        <WelcomeMessage />
      ) : (
        memoizedMessageList
      )}
    </ScrollArea>
  );
});

ChatWindow.displayName = 'ChatWindow';

export default ChatWindow;