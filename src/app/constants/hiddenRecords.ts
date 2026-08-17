// Records that exist in the database but must not appear on the public site.
//
// TEMPORARY, and the mirror image of staticServices.ts: that file adds records the
// admin panel cannot create, this one hides records it cannot remove. Both exist
// because production runs acs-backend `main`, which is missing the authorization
// fixes sitting on `staging`.
//
// Deleting or deactivating these through the admin is the real fix — a super admin
// can do it today, since super admin short-circuits the broken permission check.
// Once a record is gone from the database, delete its id here too; leaving a stale
// id behind would silently hide a future record that reuses it.
//
// Filtered out of the list hooks and treated as not-found by the detail hooks, so
// a stray direct link cannot surface one either.

// "Adams town test" — a food_pantry record with the description "Test only",
// belonging to the team below. Hidden rather than filled with placeholder copy: a
// food pantry listing is something people act on, so inventing an address and
// hours would send someone to a service that does not exist.
export const HIDDEN_SERVICE_IDS: ReadonlySet<string> = new Set([
  '6a7be91f21e0d200e9a07c4d',
]);

// "Adams Town Test" — the team behind the service above.
export const HIDDEN_TEAM_IDS: ReadonlySet<string> = new Set([
  '6a7be8e121e0d200e9a07be3',
]);

export function isHiddenService(id: string): boolean {
  return HIDDEN_SERVICE_IDS.has(id);
}

export function isHiddenTeam(id: string): boolean {
  return HIDDEN_TEAM_IDS.has(id);
}
