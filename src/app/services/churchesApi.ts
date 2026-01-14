import { api } from './api';
import type { Church, ChurchFilters } from '../types/church.types';

export const churchesApi = {
  /**
   * Get all churches (authenticated endpoint)
   */
  getChurches: async (filters?: ChurchFilters) => {
    const params = new URLSearchParams();

    if (filters?.conferenceId) params.append('conferenceId', filters.conferenceId);
    if (filters?.city) params.append('city', filters.city);
    if (filters?.state) params.append('state', filters.state);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.includeInactive) params.append('includeInactive', 'true');

    const queryString = params.toString();
    const endpoint = `/churches${queryString ? `?${queryString}` : ''}`;

    return api.get<Church[]>(endpoint, true);
  },

  /**
   * Get single church by ID (authenticated endpoint)
   */
  getChurchById: async (id: string) => {
    return api.get<Church>(`/churches/${id}`, true);
  },

  /**
   * Search churches by location
   */
  searchChurches: async (params: { city?: string; state?: string; lat?: number; lng?: number; radius?: number }) => {
    const searchParams = new URLSearchParams();

    if (params.city) searchParams.append('city', params.city);
    if (params.state) searchParams.append('state', params.state);
    if (params.lat !== undefined) searchParams.append('lat', params.lat.toString());
    if (params.lng !== undefined) searchParams.append('lng', params.lng.toString());
    if (params.radius !== undefined) searchParams.append('radius', params.radius.toString());

    const queryString = searchParams.toString();
    return api.get<Church[]>(`/churches/search?${queryString}`, true);
  },

  /**
   * Get church statistics
   */
  getChurchStatistics: async (id: string) => {
    return api.get<{
      teams: number;
      services: number;
      volunteers: number;
      beneficiaries: number;
    }>(`/churches/${id}/statistics`, true);
  },

  /**
   * Get church hierarchy (union -> conference -> church -> teams)
   */
  getChurchHierarchy: async (id: string) => {
    return api.get<{
      union: { _id: string; name: string };
      conference: { _id: string; name: string };
      church: Church;
      teams: Array<{ _id: string; name: string; type: string }>;
    }>(`/churches/${id}/hierarchy`, true);
  },
};
