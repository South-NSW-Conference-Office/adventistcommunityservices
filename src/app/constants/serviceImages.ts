// Local image overrides for services that don't yet have photos uploaded
// through the admin panel. Keyed by service _id. Images uploaded via the
// admin panel (primaryImage) always take precedence over these.
//
// `position` is an optional CSS object-position value controlling how the
// image is cropped inside cards (e.g. 'top' to keep the top of the photo
// visible). Defaults to center.

interface ServiceImageOverride {
  url: string;
  position?: string;
}

export const SERVICE_IMAGE_OVERRIDES: Record<string, ServiceImageOverride> = {
  // Clean-up Crew — Canberra National ACS Team
  '6a506d1821e0d200e99e3308': { url: '/images/services/canberra-cleanup-crew.jpg' },
  // Wodonga OP Shop — Wodonga Adventist Community Church
  '6a503cbb21e0d200e99e2c60': { url: '/images/services/wodonga-op-shop.jpg', position: 'top' },
  // Community Yard Cleans — Narromine ACS Team
  '6a50af5821e0d200e99e524c': { url: '/images/services/narromine-community-yard-cleans.jpg' },
};

export function getServiceImage(serviceId: string): string | undefined {
  return SERVICE_IMAGE_OVERRIDES[serviceId]?.url;
}

export function getServiceImagePosition(serviceId: string): string | undefined {
  return SERVICE_IMAGE_OVERRIDES[serviceId]?.position;
}
