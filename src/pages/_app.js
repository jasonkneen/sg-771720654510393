import "@/styles/globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AppProvider } from '@/context/AppContext';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

function clearLocalStorage() {
  if (typeof window !== 'undefined') {
    localStorage.clear();
    console.log('Local storage cleared');
  }
}

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    clearLocalStorage();
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

  return (
    <AppProvider>
      <Component {...pageProps} />
      <Toaster />
    </AppProvider>
  );
}