// Local image overrides for services that don't yet have photos uploaded
// through the admin panel. Keyed by service _id. Images uploaded via the
// admin panel (primaryImage) always take precedence over these.

export const SERVICE_IMAGE_OVERRIDES: Record<string, string> = {
  // Clean-up Crew — Canberra National ACS Team
  '6a506d1821e0d200e99e3308': '/images/services/canberra-cleanup-crew.jpg',
  // Wodonga OP Shop — Wodonga Adventist Community Church
  '6a503cbb21e0d200e99e2c60': '/images/services/wodonga-op-shop.jpg',
  // Community Yard Cleans — Narromine ACS Team
  '6a50af5821e0d200e99e524c': '/images/services/narromine-community-yard-cleans.jpg',
};

export function getServiceImage(serviceId: string): string | undefined {
  return SERVICE_IMAGE_OVERRIDES[serviceId];
}
