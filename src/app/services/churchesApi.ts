import { api } from './api';
import type { Church, ChurchFilters } from '../types/church.types';

export interface ChurchPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ChurchesPageResponse {
  success: boolean;
  message: string;
  data: Church[];
  pagination: ChurchPagination;
}

export interface ChurchesQueryParams extends ChurchFilters {
  page?: number;
  limit?: number;
  search?: string;
}

export const churchesApi = {
  /**
   * Get single church by ID — public, no auth required.
   */
  getPublicChurchById: async (id: string) => {
    return api.get<Church>(`/churches/public/${id}`, false);
  },

  /**
   * Get public churches list — no auth required.
   * Supports optional search, state, and conferenceId filters.
   */
  getPublicChurches: async (params?: { search?: string; state?: string; conferenceId?: string }) => {
    const qs = new URLSearchParams();
    if (params?.search)       qs.append('search',       params.search);
    if (params?.state)        qs.append('state',        params.state);
    if (params?.conferenceId) qs.append('conferenceId', params.conferenceId);
    const endpoint = `/churches/public${qs.toString() ? `?${qs}` : ''}`;
    return api.get<Church[]>(endpoint, false);
  },

  /**
   * Get paginated churches list (admin — requires auth).
   * Server handles filtering, sorting, and pagination.
   */
  getChurches: async (params?: ChurchesQueryParams): Promise<ChurchesPageResponse> => {
    const qs = new URLSearchParams();
    if (params?.conferenceId)   qs.append('conferenceId',   params.conferenceId);
    if (params?.city)           qs.append('city',           params.city);
    if (params?.state)          qs.append('state',          params.state);
    if (params?.search)         qs.append('search',         params.search);
    if (params?.includeInactive) qs.append('includeInactive', 'true');
    if (params?.page)           qs.append('page',           String(params.page));
    if (params?.limit)          qs.append('limit',          String(params.limit));

    const endpoint = `/churches${qs.toString() ? `?${qs}` : ''}`;
    return api.get<ChurchesPageResponse>(endpoint, true) as unknown as ChurchesPageResponse;
  },

  /**
   * Get single church by ID.
   */
  getChurchById: async (id: string) => {
    return api.get<Church>(`/churches/${id}`, true);
  },

  /**
   * Search churches by geographic location.
   */
  searchChurches: async (params: {
    city?: string;
    state?: string;
    lat?: number;
    lng?: number;
    radius?: number;
  }) => {
    const qs = new URLSearchParams();
    if (params.city)   qs.append('city',   params.city);
    if (params.state)  qs.append('state',  params.state);
    if (params.lat !== undefined) qs.append('lat', String(params.lat));
    if (params.lng !== undefined) qs.append('lng', String(params.lng));
    if (params.radius !== undefined) qs.append('radius', String(params.radius));
    return api.get<Church[]>(`/churches/search?${qs}`, true);
  },

  getChurchStatistics: async (id: string) => {
    return api.get<{
      teams: number;
      services: number;
      volunteers: number;
      beneficiaries: number;
    }>(`/churches/${id}/statistics`, true);
  },

  getChurchHierarchy: async (id: string) => {
    return api.get<{
      union: { _id: string; name: string };
      conference: { _id: string; name: string };
      church: Church;
      teams: Array<{ _id: string; name: string; type: string }>;
    }>(`/churches/${id}/hierarchy`, true);
  },
};
