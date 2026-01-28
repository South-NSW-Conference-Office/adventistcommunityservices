import { useState, useEffect, useCallback } from 'react';
import { testimoniesApi, Testimony } from '../services/testimoniesApi';

interface UseTestimoniesResult {
  testimonies: Testimony[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching featured testimonies for homepage display
 */
export function useFeaturedTestimonies(limit: number = 8): UseTestimoniesResult {
  const [testimonies, setTestimonies] = useState<Testimony[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTestimonies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await testimoniesApi.getFeatured(limit);
      // Backend returns testimonies directly in response, not wrapped in data
      const data = response as unknown as { success: boolean; testimonies?: Testimony[] };
      if (data.success && data.testimonies) {
        setTestimonies(data.testimonies);
      } else {
        // No testimonies found is not an error, just empty
        setTestimonies([]);
      }
    } catch (err) {
      console.error('Failed to fetch featured testimonies:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch testimonies');
      setTestimonies([]);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchTestimonies();
  }, [fetchTestimonies]);

  return { testimonies, loading, error, refetch: fetchTestimonies };
}

/**
 * Hook for fetching all approved testimonies
 */
export function useTestimonies(): UseTestimoniesResult {
  const [testimonies, setTestimonies] = useState<Testimony[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTestimonies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await testimoniesApi.getAllApproved();
      // Backend returns testimonies directly in response, not wrapped in data
      const data = response as unknown as { success: boolean; testimonies?: Testimony[] };
      if (data.success && data.testimonies) {
        setTestimonies(data.testimonies);
      } else {
        setTestimonies([]);
      }
    } catch (err) {
      console.error('Failed to fetch testimonies:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch testimonies');
      setTestimonies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTestimonies();
  }, [fetchTestimonies]);

  return { testimonies, loading, error, refetch: fetchTestimonies };
}
