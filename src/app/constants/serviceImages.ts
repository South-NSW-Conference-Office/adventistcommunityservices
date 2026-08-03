// Local image overrides for services that don't yet have photos uploaded
// through the admin panel. Keyed by service _id. Images uploaded via the
// admin panel (primaryImage) always take precedence over these.
//
// `position` is an optional CSS object-position value controlling how the
// image is cropped inside cards (e.g. 'top' to keep the top of the photo
// visible). Defaults to center.
//
// `gallery` is an optional list of extra image URLs shown as a carousel on the
// service details page (after the primary `url`). The grid card only ever uses
// the primary `url`. A DB-uploaded gallery, if present, takes precedence.

interface ServiceGalleryImage {
  url: string;
  position?: string;
}

interface ServiceImageOverride {
  url: string;
  position?: string;
  // Gallery entries may be a bare URL, or an object with its own crop position
  // for photos (e.g. portraits) whose subject the default centre crop cuts off.
  gallery?: Array<string | ServiceGalleryImage>;
}

export const SERVICE_IMAGE_OVERRIDES: Record<string, ServiceImageOverride> = {
  // Clean-up Crew — Canberra National ACS Team
  '6a506d1821e0d200e99e3308': { url: '/images/services/canberra-cleanup-crew.jpg' },
  // Wodonga OP Shop — Wodonga Adventist Community Church
  '6a503cbb21e0d200e99e2c60': { url: '/images/services/wodonga-op-shop.jpg', position: '50% 40%' },
  // Community Yard Cleans — Narromine ACS Team
  '6a50af5821e0d200e99e524c': { url: '/images/services/narromine-community-yard-cleans.jpg' },
  // Yard Work — Bowral ACS Team
  '6a50a2d021e0d200e99e4218': {
    url: '/images/services/bowral-yard-work-1-clean.jpg',
    gallery: [
      { url: '/images/services/bowral-yard-work-2-mow.jpg', position: '50% 40%' },
      '/images/services/bowral-yard-work-3-truck.jpg',
      '/images/services/bowral-yard-work-4-team.jpg',
      '/images/services/bowral-yard-work-5-group.jpg',
    ],
  },
  // Food Pantry — Queanbeyan ACS Team
  // (note: a second "Food Pantry" exists under Bathurst — different service id)
  '6a50b1b821e0d200e99e567a': {
    // Volunteers with the produce crates - used as the card thumbnail.
    url: '/images/services/queanbeyan-food-pantry-6.jpg',
    position: 'top',
    gallery: [
      { url: '/images/services/queanbeyan-food-pantry-1.jpg', position: '50% 40%' },
      { url: '/images/services/queanbeyan-food-pantry-2.jpg', position: '50% 40%' },
      { url: '/images/services/queanbeyan-food-pantry-3.jpg', position: '50% 40%' },
      { url: '/images/services/queanbeyan-food-pantry-4.jpg', position: '50% 40%' },
      { url: '/images/services/queanbeyan-food-pantry-5.jpg', position: '50% 40%' },
      { url: '/images/services/queanbeyan-food-pantry-7.jpg', position: '50% 40%' },
      { url: '/images/services/queanbeyan-food-pantry-8.jpg', position: '50% 40%' },
      { url: '/images/services/queanbeyan-food-pantry-9.jpg', position: '50% 40%' },
      { url: '/images/services/queanbeyan-food-pantry-10.jpg', position: '50% 40%' },
      { url: '/images/services/queanbeyan-food-pantry-11.jpg', position: '50% 40%' },
    ],
  },
};

export function getServiceImage(serviceId: string): string | undefined {
  return SERVICE_IMAGE_OVERRIDES[serviceId]?.url;
}

export function getServiceImagePosition(serviceId: string): string | undefined {
  return SERVICE_IMAGE_OVERRIDES[serviceId]?.position;
}

export function getServiceGallery(serviceId: string): ServiceGalleryImage[] {
  const gallery = SERVICE_IMAGE_OVERRIDES[serviceId]?.gallery ?? [];
  return gallery.map((item) => (typeof item === 'string' ? { url: item } : item));
}
