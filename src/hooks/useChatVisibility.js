import { useState, useCallback, useRef } from 'react';
import { handleChatVisibility, adjustChatPosition } from '@/utils/chatPositioning';

const useChatVisibility = () => {
  const [isChatVisible, setIsChatVisible] = useState(true);
  const chatContainerRef = useRef(null);

  const toggleChatVisibility = useCallback(() => {
    handleChatVisibility(setIsChatVisible);
    adjustChatPosition(chatContainerRef, !isChatVisible);
  }, [isChatVisible]);

  return {
    isChatVisible,
    toggleChatVisibility,
    chatContainerRef,
  };
};

export default useChatVisibility;