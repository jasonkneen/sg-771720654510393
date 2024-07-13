import "@/styles/globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AppProvider } from '@/context/AppContext';
import { useEffect } from 'react';

function clearLocalStorage() {
  if (typeof window !== 'undefined') {
    localStorage.clear();
    console.log('Local storage cleared');
  }
}

export default function App({ Component, pageProps }) {
  useEffect(() => {
    clearLocalStorage();
  }, []);

  return (
    <AppProvider>
      <Component {...pageProps} />
      <Toaster />
    </AppProvider>
  );
}