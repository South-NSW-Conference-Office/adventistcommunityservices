// Local image overrides for churches that don't yet have photos uploaded
// through the admin panel. Keyed by church _id. Images uploaded via the admin
// panel (primaryImage) always take precedence over these.
//
// Mirrors the shape of serviceImages.ts so the three override maps stay
// consistent.
//
// Note the Fellowship directory picks its card image by *list position*
// (a rotating stock default), so a church's photo there changes as filters
// reorder the list. An override here pins a real photo to the church itself.
//
// `position` is an optional CSS object-position controlling how the image is
// cropped (e.g. 'top', '50% 40%'). Defaults to center. It matters here because
// these photo sets mix landscape and portrait shots.
//
// `gallery` is an optional list of extra images shown as a carousel on the
// church details page, after the primary `url`. The directory card only ever
// uses the primary `url`.

interface ChurchGalleryImage {
  url: string;
  position?: string;
}

interface ChurchImageOverride {
  url: string;
  position?: string;
  // Gallery entries may be a bare URL, or an object with its own crop position.
  gallery?: Array<string | ChurchGalleryImage>;
}

export const CHURCH_IMAGE_OVERRIDES: Record<string, ChurchImageOverride> = {
  // --- Churches that own an ACS team, reusing that team's photo -------------
  // These point at files under /images/teams rather than duplicating them.
  // If a church ever gets its own distinct photo, just repoint the url.

  // Bowral — reuses the Bowral ACS Team photo
  '6967339b7394e82212d366f6': { url: '/images/teams/bowral-card.jpg' },
  // Canberra National — reuses the Canberra National ACS Team photo
  '695c8b6faa1380b9d1f2475f': { url: '/images/teams/canberra-national-card.jpg' },
  // Narromine — reuses the Narromine ACS Team group photo
  '696733977394e82212d36684': { url: '/images/teams/narromine-card.jpg' },
  // Wodonga Adventist Community Church — reuses the Wodonga team photo
  '696733967394e82212d36649': { url: '/images/teams/wodonga-card.jpg' },

  // --- Churches with their own photo sets -----------------------------------
  // Parkes (SNSW) — community clean-up day.
  // Parkes has no ACS team or service record yet, so these sit on the church
  // itself; move them to the team once one exists.
  '696733957394e82212d3662b': {
    url: '/images/churches/parkes-3.jpg',
    gallery: [
      '/images/churches/parkes-1.jpg',
      '/images/churches/parkes-2.jpg',
      '/images/churches/parkes-4.jpg',
      '/images/churches/parkes-5.jpg',
      '/images/churches/parkes-6.jpg',
      '/images/churches/parkes-7.jpg',
      '/images/churches/parkes-8.jpg',
      '/images/churches/parkes-9.jpg',
      '/images/churches/parkes-10.jpg',
      '/images/churches/parkes-11.jpg',
      '/images/churches/parkes-12.jpg',
      '/images/churches/parkes-13.jpg',
      '/images/churches/parkes-14.jpg',
      '/images/churches/parkes-15.jpg',
      '/images/churches/parkes-16.jpg',
      '/images/churches/parkes-17.jpg',
      '/images/churches/parkes-18.jpg',
      '/images/churches/parkes-19.jpg',
      '/images/churches/parkes-20.jpg',
      '/images/churches/parkes-21.jpg',
      // STORM Co youth mission — worship, yard work and community service.
      // Source photos are only 640px wide, so these look soft in the full-width
      // hero; swap in higher-resolution originals if they become available.
      '/images/churches/parkes-22.jpg',
      '/images/churches/parkes-23.jpg',
      '/images/churches/parkes-24.jpg',
      '/images/churches/parkes-25.jpg',
      '/images/churches/parkes-26.jpg',
      '/images/churches/parkes-27.jpg',
      '/images/churches/parkes-28.jpg',
      '/images/churches/parkes-29.jpg',
      '/images/churches/parkes-30.jpg',
      '/images/churches/parkes-31.jpg',
      '/images/churches/parkes-32.jpg',
      '/images/churches/parkes-33.jpg',
      '/images/churches/parkes-34.jpg',
      '/images/churches/parkes-35.jpg',
      '/images/churches/parkes-36.jpg',
    ],
  },
  // South Canberra (SNSW, ACT) — removalist / house-move help.
  // No ACS team or "Removalist" service record exists for South Canberra yet,
  // so these sit on the church; move them to the service once one exists.
  // The removalist shots are portrait and taken at night, hence the top anchor
  // so faces are not cropped out of the wide hero.
  '696733967394e82212d36655': {
    url: '/images/churches/south-canberra-1.jpg',
    gallery: [
      { url: '/images/churches/south-canberra-2.jpg', position: 'top' },
      { url: '/images/churches/south-canberra-3.jpg', position: 'top' },
      { url: '/images/churches/south-canberra-4.jpg', position: 'top' },
      { url: '/images/churches/south-canberra-5.jpg', position: 'top' },
    ],
  },
};

export function getChurchImage(churchId: string): string | undefined {
  return CHURCH_IMAGE_OVERRIDES[churchId]?.url;
}

export function getChurchImagePosition(churchId: string): string | undefined {
  return CHURCH_IMAGE_OVERRIDES[churchId]?.position;
}

export function getChurchGallery(churchId: string): ChurchGalleryImage[] {
  const gallery = CHURCH_IMAGE_OVERRIDES[churchId]?.gallery ?? [];
  return gallery.map((item) => (typeof item === 'string' ? { url: item } : item));
}
