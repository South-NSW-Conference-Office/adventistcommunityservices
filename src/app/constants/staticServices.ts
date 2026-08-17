import type { Service } from '../types/service.types';

// Services defined in the front end rather than the database.
//
// TEMPORARY. Admin photo upload and content editing are broken by authorization
// defects in the backend (acs-backend PR #6), so new services cannot be created
// through the admin panel. Entries here are merged into the services list and the
// service detail lookup so they behave like real records on the public site.
//
// They are invisible to the admin panel and to every other API consumer. Once the
// backend fix ships, recreate these through the admin and delete them from here —
// keeping both would leave two sources of truth for the same service.
//
// IDs are deliberately not 24-character hex, so they can never collide with a real
// MongoDB ObjectId, and `isStaticServiceId` can tell them apart without a lookup.

export const STATIC_SERVICES: Service[] = [
  {
    _id: 'local-wodonga-community-yard-cleans',
    name: 'Community Yard Cleans',
    type: 'yard_work',
    status: 'active',
    // Mirrors the Wodonga OP Shop record, which belongs to the same team and church.
    teamId: {
      _id: '6a502fff21e0d200e99e28f2',
      name: 'Wodonga Adventist Community Church Team',
    },
    churchId: {
      _id: '696733967394e82212d36649',
      name: 'Wodonga Adventist Community Church',
    },
    descriptionShort:
      'Team-based yard cleans that restore overgrown and neglected community spaces.',
    locations: [
      {
        label: 'Main Location',
        address: { street: '', suburb: 'West Wodonga', state: 'VIC', postcode: '3690' },
        isMobile: false,
      },
    ],
    tags: [],
  },
];

export function isStaticServiceId(id: string): boolean {
  return STATIC_SERVICES.some((service) => service._id === id);
}

export function getStaticService(id: string): Service | undefined {
  return STATIC_SERVICES.find((service) => service._id === id);
}
