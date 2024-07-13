import { useEffect, useRef } from 'react';
import performanceMonitor from '@/utils/performanceMonitor';

const useChatScroll = (messages) => {
  const chatContainerRef = useRef(null);

  useEffect(() => {
    performanceMonitor.start('useChatScroll-effect');
    if (chatContainerRef.current) {
      const { scrollHeight, clientHeight } = chatContainerRef.current;
      chatContainerRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: 'smooth',
      });
    }
    performanceMonitor.end('useChatScroll-effect');
  }, [messages]);

  return chatContainerRef;
};

export default useChatScroll;