import { useState, useCallback } from 'react';
import { handleComponentError } from '@/utils/componentErrorHandler';

const useMessageThreading = (updateChatHistory) => {
  const [replyingToMessageId, setReplyingToMessageId] = useState(null);

  const handleReply = useCallback((messageId) => {
    setReplyingToMessageId(messageId);
  }, []);

  const handleAddReply = useCallback((parentMessageId, replyContent) => {
    try {
      updateChatHistory((prevHistory) => {
        return prevHistory.map((chat) => ({
          ...chat,
          messages: chat.messages.map((msg) =>
            msg.id === parentMessageId
              ? {
                  ...msg,
                  replies: [...(msg.replies || []), { id: Date.now(), content: replyContent, sender: 'user' }],
                }
              : msg
          ),
        }));
      });
      setReplyingToMessageId(null);
    } catch (error) {
      handleComponentError(error, 'Add reply to message');
    }
  }, [updateChatHistory]);

  const handleDeleteReply = useCallback((parentMessageId, replyId) => {
    try {
      updateChatHistory((prevHistory) => {
        return prevHistory.map((chat) => ({
          ...chat,
          messages: chat.messages.map((msg) =>
            msg.id === parentMessageId
              ? {
                  ...msg,
                  replies: msg.replies.filter((reply) => reply.id !== replyId),
                }
              : msg
          ),
        }));
      });
    } catch (error) {
      handleComponentError(error, 'Delete reply from message');
    }
  }, [updateChatHistory]);

  return {
    replyingToMessageId,
    handleReply,
    handleAddReply,
    handleDeleteReply,
  };
};

export default useMessageThreading;