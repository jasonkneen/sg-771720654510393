import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function Custom500() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <AlertTriangle className="w-16 h-16 text-yellow-500 mb-4" />
      <h1 className="text-4xl font-bold mb-2">500 - Server Error</h1>
      <p className="text-xl text-muted-foreground mb-8">Oops! Something went wrong on our end.</p>
      <Link href="/" passHref>
        <Button>
          Go back home
        </Button>
      </Link>
    </div>
  );
}