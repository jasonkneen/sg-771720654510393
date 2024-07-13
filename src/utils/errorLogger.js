// Simple error logger utility

const logError = (error, context = {}) => {
  console.error('Error occurred:', error);
  console.error('Error context:', context);
  
  // In a real-world application, you might want to send this error to a logging service
  // For example, using a service like Sentry or LogRocket
  // sendErrorToLoggingService(error, context);
};

export default logError;