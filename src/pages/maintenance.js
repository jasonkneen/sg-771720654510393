import React from 'react';
import { AlertTriangle } from 'lucide-react';

const MaintenancePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <AlertTriangle className="w-16 h-16 text-yellow-500 mb-4" />
      <h1 className="text-4xl font-bold mb-2">Maintenance in Progress</h1>
      <p className="text-xl text-muted-foreground mb-8">
        We're currently performing some maintenance. Please check back soon.
      </p>
    </div>
  );
};

export default MaintenancePage;