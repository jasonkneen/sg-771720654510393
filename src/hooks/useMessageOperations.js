import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { handleComponentError } from '@/utils/componentErrorHandler';

const useMessageOperations = (updateChatHistory) => {
  const [editingMessageId, setEditingMessageId] = useState(null);
  const { toast } = useToast();

  const handleEditMessage = useCallback((messageId, newContent) => {
    try {
      updateChatHistory((prevHistory) => {
        return prevHistory.map((chat) => ({
          ...chat,
          messages: chat.messages.map((msg) =>
            msg.id === messageId ? { ...msg, content: newContent } : msg
          ),
        }));
      });
      setEditingMessageId(null);
      toast({
        title: 'Message Updated',
        description: 'Your message has been successfully updated.',
      });
    } catch (error) {
      handleComponentError(error, 'Edit message');
    }
  }, [updateChatHistory, toast]);

  const handleDeleteMessage = useCallback((messageId) => {
    try {
      updateChatHistory((prevHistory) => {
        return prevHistory.map((chat) => ({
          ...chat,
          messages: chat.messages.filter((msg) => msg.id !== messageId),
        }));
      });
      toast({
        title: 'Message Deleted',
        description: 'Your message has been successfully deleted.',
      });
    } catch (error) {
      handleComponentError(error, 'Delete message');
    }
  }, [updateChatHistory, toast]);

  return {
    editingMessageId,
    setEditingMessageId,
    handleEditMessage,
    handleDeleteMessage,
  };
};

export default useMessageOperations;