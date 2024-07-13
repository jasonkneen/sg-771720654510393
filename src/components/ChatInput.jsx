import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

const ChatInput = ({ input, setInput, handleSend }) => {
  return (
    <div className="p-4 border-t bg-background">
      <form onSubmit={handleSend} className="flex space-x-2">
        <Input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1"
        />
        <Button type="submit">
          <Send className="w-4 h-4 mr-2" />
          Send
        </Button>
      </form>
    </div>
  );
};

export default ChatInput;