import React, { useCallback, useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Loader2 } from 'lucide-react';
import { debounce } from '@/utils/debounce';
import { handleComponentError } from '@/utils/componentErrorHandler';
import performanceMonitor from '@/utils/performanceMonitor';

const ChatInput = ({ input, setInput, handleSend, isLoading, maxLength = 500 }) => {
  const [localInput, setLocalInput] = useState(input);
  const inputRef = useRef(null);

  useEffect(() => {
    setLocalInput(input);
  }, [input]);

  const debouncedSetInput = useCallback(
    debounce((value) => {
      performanceMonitor.start('debouncedSetInput');
      console.log('Debounced setInput called with:', value);
      setInput(value);
      performanceMonitor.end('debouncedSetInput');
    }, 100),
    [setInput]
  );

  const handleInputChange = (e) => {
    performanceMonitor.start('handleInputChange');
    const value = e.target.value;
    console.log('Input changed:', value);
    setLocalInput(value);
    debouncedSetInput(value);
    performanceMonitor.end('handleInputChange');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    performanceMonitor.start('handleSubmit');
    if (localInput.trim() && !isLoading) {
      try {
        console.log('Submitting message:', localInput);
        handleSend(e);
        setLocalInput('');
        inputRef.current?.focus();
      } catch (error) {
        handleComponentError(error, 'Error sending message');
      }
    }
    performanceMonitor.end('handleSubmit');
  };

  const characterCount = localInput.length;
  const isOverLimit = characterCount > maxLength;
  const isInputValid = localInput.trim().length > 0 && !isOverLimit;

  return (
    <div className="p-4 border-t bg-background">
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Type your message..."
            value={localInput}
            onChange={handleInputChange}
            className="flex-1"
            disabled={isLoading}
            maxLength={maxLength}
            aria-label="Chat input"
            aria-invalid={isOverLimit}
            ref={inputRef}
          />
          <Button 
            type="submit" 
            disabled={!isInputValid || isLoading}
            aria-label={isLoading ? "Sending message" : "Send message"}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span className="ml-2">{isLoading ? 'Sending...' : 'Send'}</span>
          </Button>
        </div>
        <div 
          className={`text-sm ${isOverLimit ? 'text-destructive' : 'text-muted-foreground'}`}
          aria-live="polite"
        >
          {characterCount}/{maxLength} characters
        </div>
      </form>
    </div>
  );
};

export default ChatInput;