// Enhanced error logger utility

const logError = (error, context = {}) => {
  console.error('Error occurred:', error);
  console.error('Error context:', context);
  console.error('Error stack:', error.stack);

  // Log additional information
  console.error('Timestamp:', new Date().toISOString());
  console.error('User Agent:', navigator.userAgent);
  console.error('URL:', window.location.href);

  // In a real-world application, you might want to send this error to a logging service
  // For example, using a service like Sentry or LogRocket
  // sendErrorToLoggingService(error, context);
};

// Helper function to wrap async functions and catch errors
const asyncErrorWrapper = (fn) => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      logError(error, { functionName: fn.name, arguments: args });
      throw error;
    }
  };
};

export { logError, asyncErrorWrapper };