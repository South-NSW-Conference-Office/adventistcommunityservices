// Map pins defined in the front end rather than the database.
//
// TEMPORARY, alongside hiddenRecords.ts. (staticServices.ts, the third file of this
// kind, was retired on 2026-08-20 when the admin panel became able to create
// records; its Wodonga card is now a real database record.) These exist because
// records cannot be edited through the admin panel yet — see hiddenRecords.ts for
// the background.
//
// Why coordinates rather than street addresses: no record in the database has any
// coordinates at all (0 of 21 services, 0 of 136 churches), and 20 of 21 services have
// an empty `street`, so a map can only ever resolve the suburb. There is no Google Maps
// API key in the project either, so an address cannot be geocoded client-side. A pair
// of coordinates skips geocoding entirely and pins the exact spot.
//
// Once the admin panel is reachable, enter these against the real records and delete
// them from here — keeping both leaves two sources of truth for the same pin, and the
// database copy is the one every other consumer reads.
//
// To add one: right-click the exact spot in Google Maps, click the lat/long at the top
// of the menu to copy it, and paste it below keyed by the record's _id. Latitude first,
// then longitude — the same order Google shows them. Australian latitudes are negative.
//
//   'the-service-id': { lat: -36.1156, lng: 146.8703 },
//
// Do not guess a pin from a suburb name. A wrong pin sends someone to the wrong place,
// which is worse than the suburb-level view they get with no entry here.

export interface LocalCoordinates {
  lat: number;
  lng: number;
}

/** Keyed by service `_id`. */
export const SERVICE_COORDINATES: Record<string, LocalCoordinates> = {
  // Wodonga OP Shop — 11 Melrose Dr, West Wodonga VIC 3690. A place people travel to,
  // so a pin is worth having. Google lists it as "located in: Wodonga Seventh-Day
  // Adventist Community Church", which is why the church below shares this pin.
  '6a503cbb21e0d200e99e2c60': { lat: -36.1160716, lng: 146.8679408 },
  // Food Pantry — Bathurst Team, at the church below: 155 Lambert St, Bathurst NSW
  // 2795. Searching Google for an Adventist food pantry in Bathurst returns only the
  // church, so the two are one site, as in Wodonga. Correct this if the pantry runs
  // from a separate hall.
  '6a507fed21e0d200e99e3b1b': { lat: -33.4214075, lng: 149.5729675 },

  // Deliberately not pinned, pending confirmation:
  // - 6a50818421e0d200e99e3f9f  Moving Houses (Bathurst)
  // - 6a86aa0691c8b178af300b54  Community Yard Cleans (Wodonga)
  // Both are mobile — the crew travels to the person needing help — so a fixed marker
  // implies somewhere to turn up to that does not exist. The suburb-level view is the
  // more honest default for those.
};

/** Keyed by church `_id`. */
export const CHURCH_COORDINATES: Record<string, LocalCoordinates> = {
  // Wodonga Adventist Community Church — 11 Melrose Dr, West Wodonga VIC 3690. Shares
  // the OP Shop's pin above: Google lists the shop as located inside this church, so
  // they are one site rather than two.
  '696733967394e82212d36649': { lat: -36.1160716, lng: 146.8679408 },
  // Bathurst Seventh-day Adventist Church — 155 Lambert St, Bathurst NSW 2795. Shares
  // the food pantry's pin above; they are the same site.
  '696733987394e82212d36690': { lat: -33.4214075, lng: 149.5729675 },

  // Not pinned: 6967339d7394e82212d36733 Wodonga Slavic — a separate congregation, so
  // the Wodonga pin above should not be assumed to apply to it.
};

export function getServiceCoordinates(serviceId: string | undefined): LocalCoordinates | undefined {
  return serviceId ? SERVICE_COORDINATES[serviceId] : undefined;
}

export function getChurchCoordinates(churchId: string | undefined): LocalCoordinates | undefined {
  return churchId ? CHURCH_COORDINATES[churchId] : undefined;
}
