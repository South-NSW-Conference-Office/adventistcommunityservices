import { useState, useEffect, useCallback } from 'react';
import { teamsApi } from '../services/teamsApi';
import type { Team, TeamFilters } from '../types/team.types';

interface UseTeamsResult {
  teams: Team[];
  loading: boolean;
  error: string | null;
  refetch: (filters?: TeamFilters) => Promise<void>;
}

/**
 * Hook for fetching teams list
 */
export function useTeams(initialFilters?: TeamFilters): UseTeamsResult {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeams = useCallback(async (filters?: TeamFilters) => {
    setLoading(true);
    setError(null);
    try {
      const response = await teamsApi.getTeams(filters);
      if (response.success && response.data) {
        setTeams(response.data);
      } else {
        setError('Failed to fetch teams');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch teams');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeams(initialFilters);
  }, [fetchTeams, initialFilters]);

  return { teams, loading, error, refetch: fetchTeams };
}

interface UseTeamDetailResult {
  team: Team | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching a single team by ID
 */
export function useTeamDetail(id: string | undefined): UseTeamDetailResult {
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeam = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await teamsApi.getTeamById(id);
      if (response.success && response.data) {
        setTeam(response.data);
      } else {
        setError('Team not found');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch team');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  return { team, loading, error, refetch: fetchTeam };
}
