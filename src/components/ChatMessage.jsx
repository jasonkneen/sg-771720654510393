import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Edit2, Trash2, X, Check } from 'lucide-react';
import ChatTimestamp from './ChatTimestamp';
import CodeSnippet from './CodeSnippet';
import { handleComponentError } from '@/utils/componentErrorHandler';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const ChatMessage = ({ message, onShare, onEdit, onDelete, isEditing, setEditingMessageId }) => {
  const [editedContent, setEditedContent] = useState(message.content);

  const renderMessageContent = () => {
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
      handleComponentError(error, 'Rendering message content');
      return <p>Error rendering message content. Please try refreshing the page.</p>;
    }
  };

  const handleEditSubmit = () => {
    onEdit(message.id, editedContent);
    setEditingMessageId(null);
  };

  const handleCancelEdit = () => {
    setEditedContent(message.content);
    setEditingMessageId(null);
  };

  return (
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
          {isEditing ? (
            <div className="flex flex-col space-y-2">
              <Input
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full"
              />
              <div className="flex justify-end space-x-2">
                <Button size="sm" onClick={handleCancelEdit}>
                  <X className="w-4 h-4 mr-1" /> Cancel
                </Button>
                <Button size="sm" onClick={handleEditSubmit}>
                  <Check className="w-4 h-4 mr-1" /> Save
                </Button>
              </div>
            </div>
          ) : (
            <>
              {renderMessageContent()}
              <ChatTimestamp timestamp={message.timestamp} />
            </>
          )}
        </div>
        {!isEditing && message.sender === 'user' && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditingMessageId(message.id)}
              className="p-1"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your message.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(message.id)}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ChatMessage;