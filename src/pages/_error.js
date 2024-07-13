import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

function Error({ statusCode }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <AlertTriangle className="w-16 h-16 text-yellow-500 mb-4" />
      <h1 className="text-4xl font-bold mb-2">
        {statusCode
          ? `An error ${statusCode} occurred on server`
          : 'An error occurred on client'}
      </h1>
      <p className="text-xl text-muted-foreground mb-8">
        We're sorry, but something went wrong. Please try again later.
      </p>
      <Link href="/" passHref>
        <Button>
          Go back home
        </Button>
      </Link>
    </div>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;