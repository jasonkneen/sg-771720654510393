import "@/styles/globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AppProvider } from '@/context/AppContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ErrorBoundary from '@/components/ErrorBoundary';

function clearLocalStorage() {
  if (typeof window !== 'undefined') {
    localStorage.clear();
    console.log('Local storage cleared');
  }
}

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [isServerHealthy, setIsServerHealthy] = useState(true);

  useEffect(() => {
    clearLocalStorage();

    const checkServerHealth = async () => {
      try {
        const res = await fetch('/api/health');
        if (!res.ok) {
          setIsServerHealthy(false);
        }
      } catch (error) {
        console.error('Server health check failed:', error);
        setIsServerHealthy(false);
      }
    };

    checkServerHealth();
    const healthCheckInterval = setInterval(checkServerHealth, 60000); // Check every minute

    return () => clearInterval(healthCheckInterval);
  }, []);

  useEffect(() => {
    const handleRouteChange = (url) => {
      console.log(`App is changing to ${url}`);
    };

    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router.events]);

  if (!isServerHealthy) {
    return <div>Server is currently unavailable. Please try again later.</div>;
  }

  return (
    <ErrorBoundary>
      <AppProvider>
        <Component {...pageProps} />
        <Toaster />
      </AppProvider>
    </ErrorBoundary>
  );
}