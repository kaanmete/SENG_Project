import { useState } from 'react';
import { apiRequest } from '../config/api';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = async (url, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiRequest(url, options);
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  return { request, loading, error };
};

export default useApi;
