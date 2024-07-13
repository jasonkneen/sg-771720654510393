import { useEffect } from 'react';
import { useRouter } from 'next/router';

const useKeyboardNavigation = () => {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case '/':
            e.preventDefault();
            // Open help modal
            break;
          case 'h':
            e.preventDefault();
            router.push('/');
            break;
          case 's':
            e.preventDefault();
            router.push('/settings');
            break;
          // Add more shortcuts as needed
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [router]);
};

export default useKeyboardNavigation;