import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Loader2 } from 'lucide-react';

const ChatInput = ({ input, setInput, handleSend, isLoading, maxLength = 500 }) => {
  const characterCount = input.length;
  const isOverLimit = characterCount > maxLength;
  const isInputValid = input.trim().length > 0 && !isOverLimit;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isInputValid && !isLoading) {
      handleSend(e);
    }
  };

  return (
    <div className="p-4 border-t bg-background">
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1"
            disabled={isLoading}
            maxLength={maxLength}
          />
          <Button type="submit" disabled={!isInputValid || isLoading}>
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span className="ml-2">{isLoading ? 'Sending...' : 'Send'}</span>
          </Button>
        </div>
        <div className={`text-sm ${isOverLimit ? 'text-destructive' : 'text-muted-foreground'}`}>
          {characterCount}/{maxLength} characters
        </div>
      </form>
    </div>
  );
};

export default ChatInput;