import "@/styles/globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AppProvider } from '@/context/AppContext';

export default function App({ Component, pageProps }) {
  return (
    <AppProvider>
      <Component {...pageProps} />
      <Toaster />
    </AppProvider>
  );
}