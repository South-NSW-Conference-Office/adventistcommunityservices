import { api } from './api';
import type { Team, TeamFilters } from '../types/team.types';

export const teamsApi = {
  /**
   * Get all teams accessible to the authenticated user
   */
  getTeams: async (filters?: TeamFilters) => {
    const params = new URLSearchParams();

    if (filters?.churchId) params.append('churchId', filters.churchId);
    if (filters?.type) params.append('type', filters.type);
    if (filters?.search) params.append('q', filters.search);
    if (filters?.includeInactive) params.append('includeInactive', 'true');

    const queryString = params.toString();
    const endpoint = `/teams/public${queryString ? `?${queryString}` : ''}`;

    return api.get<Team[]>(endpoint, false);
  },

  /**
   * Get single team by ID (public endpoint)
   */
  getTeamById: async (id: string) => {
    return api.get<Team>(`/teams/public/${id}`, false);
  },

  /**
   * Get teams for a specific church
   */
  getTeamsByChurch: async (churchId: string, filters?: Omit<TeamFilters, 'churchId'>) => {
    const params = new URLSearchParams();

    if (filters?.type) params.append('type', filters.type);
    if (filters?.includeInactive) params.append('includeInactive', 'true');

    const queryString = params.toString();
    const endpoint = `/teams/church/${churchId}${queryString ? `?${queryString}` : ''}`;

    return api.get<Team[]>(endpoint, true);
  },

  /**
   * Search teams
   */
  searchTeams: async (query: string, options?: { churchId?: string; type?: string; limit?: number }) => {
    const params = new URLSearchParams();
    params.append('q', query);

    if (options?.churchId) params.append('churchId', options.churchId);
    if (options?.type) params.append('type', options.type);
    if (options?.limit) params.append('limit', options.limit.toString());

    return api.get<Team[]>(`/teams/search?${params.toString()}`, true);
  },
};
