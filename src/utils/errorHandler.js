export const handleError = (error, context = '') => {
  console.error(`${context}:`, error);
  
  // You can add more sophisticated error handling here, such as:
  // - Sending errors to a logging service
  // - Displaying user-friendly error messages
  // - Handling specific types of errors differently

  if (process.env.NODE_ENV === 'development') {
    console.log('Error details:', {
      message: error.message,
      stack: error.stack,
    });
  }

  // Return a user-friendly error message
  return 'An unexpected error occurred. Please try again later.';
};