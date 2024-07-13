import { useState, useCallback } from 'react';
import retryRequest from '@/utils/retryRequest';
import logError from '@/utils/errorLogger';

const useNetworkRequest = (requestFn, initialData = null) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await retryRequest(() => requestFn(...args));
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      logError(err, { context: 'Network Request' });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [requestFn]);

  return { data, loading, error, execute };
};

export default useNetworkRequest;