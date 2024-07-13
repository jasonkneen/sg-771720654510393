import { toast } from '@/components/ui/use-toast';

export const handleComponentError = (error, context, fallbackUI = null) => {
  console.error(`Error in ${context}:`, error);

  toast({
    title: 'Error',
    description: `An error occurred in ${context}. Please try again.`,
    variant: 'destructive',
  });

  if (process.env.NODE_ENV === 'development') {
    console.log('Error details:', {
      message: error.message,
      stack: error.stack,
    });
  }

  return fallbackUI || (
    <div className="error-message">
      <p>An error occurred. Please try again later.</p>
    </div>
  );
};