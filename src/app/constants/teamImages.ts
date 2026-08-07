// Local image overrides for teams that don't yet have photos uploaded
// through the admin panel. Keyed by team _id. Images uploaded via the
// admin panel (banner/profilePhoto) always take precedence over these.
//
// card:     shown on the /teams directory grid (TeamCard)
// cover:    shown as the hero image on the team details page (TeamDetails)
// position: optional CSS object-position for the card and cover (e.g. 'top',
//           '50% 40%'). Matters for portrait photos, which the default centre
//           crop can cut awkwardly.
// gallery:  optional extra images shown as a carousel on the team details page
//           after the cover. The directory card only ever uses `card`.
//
// Mirrors the shape of serviceImages.ts so the override maps stay consistent.

interface TeamGalleryImage {
  url: string;
  position?: string;
}

interface TeamImageOverride {
  card?: string;
  cover?: string;
  position?: string;
  // Gallery entries may be a bare URL, or an object with its own crop position.
  gallery?: Array<string | TeamGalleryImage>;
}

export const TEAM_IMAGE_OVERRIDES: Record<string, TeamImageOverride> = {
  // Canberra National ACS Team
  '6a50612221e0d200e99e32ad': {
    card: '/images/teams/canberra-national-card.jpg',
    cover: '/images/teams/canberra-national-cover.jpg',
  },
  // Wodonga Adventist Community Church
  '6a502fff21e0d200e99e28f2': {
    card: '/images/teams/wodonga-card.jpg',
    cover: '/images/teams/wodonga-cover.jpg',
  },
  // Bowral ACS Team
  '6a50a1fe21e0d200e99e4115': {
    card: '/images/teams/bowral-card.jpg',
    cover: '/images/teams/bowral-cover.jpg',
  },
  // Narromine ACS Team — house-cleaning working bee, group and community photos.
  // (The team's yard/rubbish/lawn work lives on its services, see serviceImages.)
  '6a50af1e21e0d200e99e51e0': {
    card: '/images/teams/narromine-card.jpg',
    cover: '/images/teams/narromine-cover.jpg',
    gallery: [
      '/images/teams/narromine-2.jpg',
      '/images/teams/narromine-3.jpg',
      '/images/teams/narromine-4.jpg',
      '/images/teams/narromine-5.jpg',
      '/images/teams/narromine-6.jpg',
      '/images/teams/narromine-7.jpg',
      '/images/teams/narromine-8.jpg',
      '/images/teams/narromine-9.jpg',
    ],
  },
};

export function getTeamCardImage(teamId: string): string | undefined {
  return TEAM_IMAGE_OVERRIDES[teamId]?.card;
}

export function getTeamCoverImage(teamId: string): string | undefined {
  return TEAM_IMAGE_OVERRIDES[teamId]?.cover;
}

export function getTeamImagePosition(teamId: string): string | undefined {
  return TEAM_IMAGE_OVERRIDES[teamId]?.position;
}

export function getTeamGallery(teamId: string): TeamGalleryImage[] {
  const gallery = TEAM_IMAGE_OVERRIDES[teamId]?.gallery ?? [];
  return gallery.map((item) => (typeof item === 'string' ? { url: item } : item));
}
