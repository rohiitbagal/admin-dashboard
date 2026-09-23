import { useState, useEffect } from 'react';
import api from '../services/api';

export function useProducts({ page, limit, search, category, sortBy, order }) {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // We use an AbortController to cancel previous requests if a new one is fired quickly (e.g., fast typing)
    const controller = new AbortController();
    
    const fetchProducts = async () => {
      setIsLoading(true);
      setError('');
      try {
        let endpoint = '/products';
        const skip = (page - 1) * limit;
        
        let params = {
          limit,
          skip,
        };

        // DummyJSON API logic:
        // /products/search?q=phone
        // /products/category/smartphones
        if (search) {
          endpoint = '/products/search';
          params.q = search;
        } else if (category && category !== 'all') {
          endpoint = `/products/category/${category}`;
        }

        // Add sorting params if provided
        if (sortBy) {
          params.sortBy = sortBy;
          params.order = order || 'asc';
        }

        // To simulate slow network to test debouncing/race conditions, 
        // the requirements mention we can add &delay=2000. We can add this optionally.
        // params.delay = 1000;

        const response = await api.get(endpoint, {
          params,
          signal: controller.signal
        });

        setProducts(response.data.products || []);
        setTotal(response.data.total || 0);
      } catch (err) {
        if (err.name !== 'CanceledError') {
          setError(err.message || 'Failed to fetch products');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();

    return () => {
      controller.abort(); // Cancel the request if the component unmounts or dependencies change
    };
  }, [page, limit, search, category, sortBy, order]);

  return { products, total, isLoading, error };
}
