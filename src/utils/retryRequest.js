import logError from './errorLogger';

const retryRequest = async (requestFn, maxRetries = 3, delay = 1000) => {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      logError(error, { context: `Retry attempt ${i + 1}` });
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
};

export default retryRequest;