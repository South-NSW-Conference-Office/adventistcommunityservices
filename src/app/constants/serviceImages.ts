// Local image overrides for services that don't yet have photos uploaded
// through the admin panel. Keyed by service _id. Images uploaded via the
// admin panel (primaryImage) always take precedence over these.

export const SERVICE_IMAGE_OVERRIDES: Record<string, string> = {
  // Clean-up Crew — Canberra National ACS Team
  '6a506d1821e0d200e99e3308': '/images/services/canberra-cleanup-crew.jpg',
};

export function getServiceImage(serviceId: string): string | undefined {
  return SERVICE_IMAGE_OVERRIDES[serviceId];
}
