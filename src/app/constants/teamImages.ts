// Local image overrides for teams that don't yet have photos uploaded
// through the admin panel. Keyed by team _id. Images uploaded via the
// admin panel (banner/profilePhoto) always take precedence over these.
//
// card:  shown on the /teams directory grid (TeamCard)
// cover: shown as the hero image on the team details page (TeamDetails)

interface TeamImageOverride {
  card?: string;
  cover?: string;
}

export const TEAM_IMAGE_OVERRIDES: Record<string, TeamImageOverride> = {
  // Canberra National ACS Team
  '6a50612221e0d200e99e32ad': {
    card: '/images/teams/canberra-national-card.jpg',
    cover: '/images/teams/canberra-national-cover.jpg',
  },
};

export function getTeamCardImage(teamId: string): string | undefined {
  return TEAM_IMAGE_OVERRIDES[teamId]?.card;
}

export function getTeamCoverImage(teamId: string): string | undefined {
  return TEAM_IMAGE_OVERRIDES[teamId]?.cover;
}
