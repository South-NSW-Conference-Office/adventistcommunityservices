// Conference region helpers, shared by the home map and the Teams directory.
//
// There were three divergent sources of truth before this file: data/conferences.ts
// (lowercase codes, "… Conference" suffix), a CONFERENCE_NAMES map inside
// pages/Fellowship.tsx (uppercase keys, short names), and the REGIONS array inside
// components/InteractiveConferenceMap.tsx. The API adds a fourth convention by
// returning uppercase codes. Everything that needs to compare or label a region should
// come through here rather than adding a fifth.

// Short display names, keyed by canonical lowercase code. Deliberately shorter than
// the names in data/conferences.ts — "North NSW" reads better in a filter pill than
// "North NSW Conference".
const REGION_LABELS: Record<string, string> = {
  snsw: 'South NSW',
  nnsw: 'North NSW',
  gsc: 'Greater Sydney',
  vic: 'Victoria',
  sa: 'South Australia',
  wa: 'Western Australia',
  tas: 'Tasmania',
  nq: 'North Queensland',
  sq: 'South Queensland',
};

/**
 * Canonical form of a conference code.
 *
 * The map components and data/conferences.ts use lowercase ('nnsw'); the API returns
 * uppercase ('NNSW'). Comparing the two directly silently never matches, which is why
 * the map's `?conference=` link appeared to do nothing.
 */
export function normaliseRegionCode(code: string | null | undefined): string {
  return (code ?? '').trim().toLowerCase();
}

/**
 * Display label for a conference code, in either casing.
 * Falls back to the code itself (uppercased) so an unknown region is still readable
 * rather than rendering blank.
 */
export function regionLabel(code: string | null | undefined): string {
  const key = normaliseRegionCode(code);
  if (!key) return '';
  return REGION_LABELS[key] ?? key.toUpperCase();
}

/** True when two conference codes refer to the same region, ignoring casing. */
export function isSameRegion(a: string | null | undefined, b: string | null | undefined): boolean {
  const left = normaliseRegionCode(a);
  return left !== '' && left === normaliseRegionCode(b);
}

/**
 * True for a code naming a real conference, in either casing.
 *
 * Lets a caller tell "a real region that happens to have nothing in it" apart from
 * "junk in the URL". The first should filter to an empty result and say so; the second
 * should fall back to showing everything.
 */
export function isKnownRegion(code: string | null | undefined): boolean {
  const key = normaliseRegionCode(code);
  return key !== '' && key in REGION_LABELS;
}
