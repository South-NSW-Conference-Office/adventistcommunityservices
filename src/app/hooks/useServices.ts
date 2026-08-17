import { useState, useEffect, useCallback } from 'react';
import { servicesApi } from '../services/servicesApi';
import { STATIC_SERVICES, getStaticService } from '../constants/staticServices';
import type { Service, ServiceFilters } from '../types/service.types';

interface UseServicesResult {
  services: Service[];
  loading: boolean;
  error: string | null;
  refetch: (filters?: ServiceFilters) => Promise<void>;
}

/**
 * Hook for fetching services list
 */
export function useServices(initialFilters?: ServiceFilters): UseServicesResult {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = useCallback(async (filters?: ServiceFilters) => {
    setLoading(true);
    setError(null);
    try {
      const response = await servicesApi.getPublicServices(filters);
      if (response.success && response.data) {
        // Front-end-defined services are appended so they appear alongside the real
        // records. See constants/staticServices.ts — this is temporary.
        setServices([...response.data, ...STATIC_SERVICES]);
      } else {
        setError('Failed to fetch services');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch services');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices(initialFilters);
  }, [fetchServices, initialFilters]);

  return { services, loading, error, refetch: fetchServices };
}

interface UseServiceDetailResult {
  service: Service | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching a single service by ID
 */
export function useServiceDetail(id: string | undefined): UseServiceDetailResult {
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchService = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    // Resolve front-end-defined services locally; the API has no record of them and
    // would answer 404, leaving the card on the list pointing at a dead page.
    const staticService = getStaticService(id);
    if (staticService) {
      setService(staticService);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await servicesApi.getServiceById(id);
      if (response.success && response.data) {
        setService(response.data);
      } else {
        setError('Service not found');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch service');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchService();
  }, [fetchService]);

  return { service, loading, error, refetch: fetchService };
}
