import React from 'react';
import { ThemeProvider } from 'next-themes';

const Layout = ({ children }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="flex h-screen bg-background text-foreground">
        {children}
      </div>
    </ThemeProvider>
  );
};

export default Layout;