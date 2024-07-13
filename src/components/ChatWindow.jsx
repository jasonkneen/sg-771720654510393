import React, { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import { Copy, Check } from 'lucide-react';
import WelcomeMessage from './WelcomeMessage';

const ChatWindow = ({ messages }) => {
  const scrollAreaRef = useRef(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo(0, scrollAreaRef.current.scrollHeight);
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
          <div key={index} className="relative">
            <pre>
              <code className={`language-${part.language}`}>{part.content}</code>
            </pre>
            <CopyButton content={part.content} />
          </div>
        );
      }
      return <p key={index}>{part.content}</p>;
    });
  };

  const CopyButton = ({ content }) => {
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
        className="absolute top-2 right-2"
        onClick={handleCopy}
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
    );
  };

  return (
    <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
      {messages.length === 0 ? (
        <WelcomeMessage />
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <Avatar className="w-8 h-8 mt-1">
                    <AvatarImage src={message.sender === 'user' ? '/api/placeholder/32/32' : '/api/placeholder/32/32'} />
                    <AvatarFallback>{message.sender === 'user' ? 'U' : 'AI'}</AvatarFallback>
                  </Avatar>
                  <div className={`max-w-md mx-2 p-3 rounded-lg ${message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    {renderMessage(message)}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </ScrollArea>
  );
};

export default ChatWindow;