import { useState, useEffect, useCallback, useRef } from 'react';
import { churchesApi, type ChurchesQueryParams, type ChurchPagination } from '../services/churchesApi';
import type { Church } from '../types/church.types';

// =============================================================================
// usePublicChurches — public, no auth, client-side filtered (like useTeams)
// =============================================================================

interface UsePublicChurchesResult {
  churches: Church[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function usePublicChurches(): UsePublicChurchesResult {
  const [churches, setChurches] = useState<Church[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  const fetchChurches = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await churchesApi.getPublicChurches();
      if (res.success && res.data) {
        setChurches(res.data as unknown as Church[]);
      } else {
        setError('Failed to fetch churches');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch churches');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchChurches(); }, [fetchChurches]);

  return { churches, loading, error, refetch: fetchChurches };
}

// =============================================================================
// useChurches — server-side paginated, filtered, and cached via HTTP headers.
// All filtering/sorting/pagination happens on the backend.
// =============================================================================

interface UseChurchesResult {
  churches: Church[];
  pagination: ChurchPagination;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const DEFAULT_PAGINATION: ChurchPagination = {
  page: 1,
  limit: 25,
  total: 0,
  totalPages: 1,
};

export function useChurches(params: ChurchesQueryParams): UseChurchesResult {
  const [churches, setChurches]     = useState<Church[]>([]);
  const [pagination, setPagination] = useState<ChurchPagination>(DEFAULT_PAGINATION);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const isMounted = useRef(true);

  // Stable serialised key — triggers re-fetch when any param changes
  const paramsKey = JSON.stringify(params);

  const fetchChurches = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await churchesApi.getChurches(params);
      if (!isMounted.current) return;
      if (res.success) {
        setChurches(res.data ?? []);
        setPagination(res.pagination ?? DEFAULT_PAGINATION);
      } else {
        setError('Failed to fetch churches');
      }
    } catch (err) {
      if (!isMounted.current) return;
      setError(err instanceof Error ? err.message : 'Failed to fetch churches');
    } finally {
      if (isMounted.current) setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsKey]);

  useEffect(() => {
    isMounted.current = true;
    fetchChurches();
    return () => { isMounted.current = false; };
  }, [fetchChurches]);

  return { churches, pagination, loading, error, refetch: fetchChurches };
}

// =============================================================================
// useChurchDetail — single church fetch
// =============================================================================

interface UseChurchDetailResult {
  church: Church | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useChurchDetail(id: string | undefined): UseChurchDetailResult {
  const [church, setChurch] = useState<Church | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChurch = useCallback(async () => {
    if (!id) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await churchesApi.getChurchById(id);
      if (res.success && res.data) {
        setChurch(res.data as unknown as Church);
      } else {
        setError('Church not found');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch church');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchChurch(); }, [fetchChurch]);

  return { church, loading, error, refetch: fetchChurch };
}
