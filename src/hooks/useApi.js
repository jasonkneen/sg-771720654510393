import { useState, useCallback } from 'react';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { handleError } from '@/utils/errorHandler';

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const request = useCallback(async (config) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios(config);
      return response.data;
    } catch (err) {
      setError(err);
      handleError(err, 'API request failed');
      toast({
        title: 'Error',
        description: 'An error occurred. Please try again.',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const get = useCallback((url, config = {}) => {
    return request({ ...config, method: 'get', url });
  }, [request]);

  const post = useCallback((url, data, config = {}) => {
    return request({ ...config, method: 'post', url, data });
  }, [request]);

  const put = useCallback((url, data, config = {}) => {
    return request({ ...config, method: 'put', url, data });
  }, [request]);

  const del = useCallback((url, config = {}) => {
    return request({ ...config, method: 'delete', url });
  }, [request]);

  return {
    loading,
    error,
    get,
    post,
    put,
    del,
  };
};

export default useApi;