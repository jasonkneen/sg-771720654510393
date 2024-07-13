import React from 'react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';

const Layout = ({ children }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="w-full min-h-screen bg-background text-foreground">
        {children}
      </div>
      <Toaster />
    </ThemeProvider>
  );
};

export default Layout;