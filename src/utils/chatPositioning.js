export const handleChatVisibility = (setIsChatVisible) => {
  setIsChatVisible((prev) => !prev);
};

export const scrollToBottom = (containerRef) => {
  if (containerRef.current) {
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }
};

export const handleChatSwitching = (containerRef, callback) => {
  if (containerRef.current) {
    containerRef.current.style.opacity = 0;
    setTimeout(() => {
      callback();
      containerRef.current.style.opacity = 1;
      scrollToBottom(containerRef);
    }, 300);
  } else {
    callback();
  }
};

export const adjustChatPosition = (containerRef, isVisible) => {
  if (containerRef.current) {
    containerRef.current.style.transform = isVisible ? 'translateY(0)' : 'translateY(100%)';
  }
};