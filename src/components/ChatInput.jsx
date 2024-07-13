import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Loader2 } from 'lucide-react';

const ChatInput = ({ input, setInput, handleSend, isLoading }) => {
  return (
    <div className="p-4 border-t bg-background">
      <form onSubmit={handleSend} className="flex space-x-2">
        <Input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          <span className="ml-2">{isLoading ? 'Sending...' : 'Send'}</span>
        </Button>
      </form>
    </div>
  );
};

export default ChatInput;