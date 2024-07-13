import { useState, useCallback } from 'react';
import { handleComponentError } from '@/utils/componentErrorHandler';

const useEmojiReactions = (updateChatHistory) => {
  const [reactionMessageId, setReactionMessageId] = useState(null);

  const handleAddReaction = useCallback((messageId, emoji) => {
    try {
      updateChatHistory((prevHistory) => {
        return prevHistory.map((chat) => ({
          ...chat,
          messages: chat.messages.map((msg) =>
            msg.id === messageId
              ? {
                  ...msg,
                  reactions: [...(msg.reactions || []), { emoji, userId: 'currentUser' }],
                }
              : msg
          ),
        }));
      });
    } catch (error) {
      handleComponentError(error, 'Add emoji reaction');
    }
  }, [updateChatHistory]);

  const handleRemoveReaction = useCallback((messageId, emojiIndex) => {
    try {
      updateChatHistory((prevHistory) => {
        return prevHistory.map((chat) => ({
          ...chat,
          messages: chat.messages.map((msg) =>
            msg.id === messageId
              ? {
                  ...msg,
                  reactions: msg.reactions.filter((_, index) => index !== emojiIndex),
                }
              : msg
          ),
        }));
      });
    } catch (error) {
      handleComponentError(error, 'Remove emoji reaction');
    }
  }, [updateChatHistory]);

  return {
    reactionMessageId,
    setReactionMessageId,
    handleAddReaction,
    handleRemoveReaction,
  };
};

export default useEmojiReactions;