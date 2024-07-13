import { useEffect } from 'react';
import { useRouter } from 'next/router';

const useKeyboardNavigation = (handlers) => {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'Enter':
            e.preventDefault();
            handlers.sendMessage();
            break;
          case 'n':
            e.preventDefault();
            handlers.newChat();
            break;
          case 'e':
            e.preventDefault();
            handlers.exportChat();
            break;
          case 'f':
            e.preventDefault();
            handlers.focusSearch();
            break;
          case '/':
            e.preventDefault();
            handlers.toggleShortcuts();
            break;
          // Add more shortcuts as needed
        }
      } else if (e.key === 'Escape') {
        handlers.escapeAction();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handlers, router]);
};

export default useKeyboardNavigation;