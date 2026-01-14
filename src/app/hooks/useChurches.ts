import { useState, useEffect, useCallback } from 'react';
import { churchesApi } from '../services/churchesApi';
import type { Church, ChurchFilters } from '../types/church.types';

interface UseChurchesResult {
  churches: Church[];
  loading: boolean;
  error: string | null;
  refetch: (filters?: ChurchFilters) => Promise<void>;
}

/**
 * Hook for fetching churches list
 */
export function useChurches(initialFilters?: ChurchFilters): UseChurchesResult {
  const [churches, setChurches] = useState<Church[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChurches = useCallback(async (filters?: ChurchFilters) => {
    setLoading(true);
    setError(null);
    try {
      const response = await churchesApi.getChurches(filters);
      if (response.success && response.data) {
        setChurches(response.data);
      } else {
        setError('Failed to fetch churches');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch churches');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChurches(initialFilters);
  }, [fetchChurches, initialFilters]);

  return { churches, loading, error, refetch: fetchChurches };
}

interface UseChurchDetailResult {
  church: Church | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching a single church by ID
 */
export function useChurchDetail(id: string | undefined): UseChurchDetailResult {
  const [church, setChurch] = useState<Church | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChurch = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await churchesApi.getChurchById(id);
      if (response.success && response.data) {
        setChurch(response.data);
      } else {
        setError('Church not found');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch church');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchChurch();
  }, [fetchChurch]);

  return { church, loading, error, refetch: fetchChurch };
}
