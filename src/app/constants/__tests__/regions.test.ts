import { describe, it, expect } from 'vitest'
import { normaliseRegionCode, regionLabel, isSameRegion, isKnownRegion } from '../regions'

// The casing split is the reason the home map's region link silently did nothing for
// so long: the map and data/conferences.ts use lowercase ('nnsw') while the API returns
// uppercase ('NNSW'), so a direct comparison never matched.

describe('normaliseRegionCode', () => {
  it('lowercases and trims', () => {
    expect(normaliseRegionCode('NNSW')).toBe('nnsw')
    expect(normaliseRegionCode('  SNSW  ')).toBe('snsw')
  })

  it('returns an empty string for missing values', () => {
    expect(normaliseRegionCode(null)).toBe('')
    expect(normaliseRegionCode(undefined)).toBe('')
    expect(normaliseRegionCode('')).toBe('')
  })
})

describe('regionLabel', () => {
  it('gives a short display name regardless of casing', () => {
    expect(regionLabel('nnsw')).toBe('North NSW')
    expect(regionLabel('NNSW')).toBe('North NSW')
    expect(regionLabel('snsw')).toBe('South NSW')
    expect(regionLabel('sq')).toBe('South Queensland')
  })

  it('falls back to the code itself rather than rendering blank', () => {
    expect(regionLabel('zzz')).toBe('ZZZ')
  })

  it('is empty for a missing code', () => {
    expect(regionLabel(null)).toBe('')
  })
})

describe('isSameRegion', () => {
  it('matches across the casing split', () => {
    // The exact comparison that used to fail.
    expect(isSameRegion('NNSW', 'nnsw')).toBe(true)
    expect(isSameRegion('snsw', 'SNSW')).toBe(true)
  })

  it('does not match different regions', () => {
    expect(isSameRegion('nnsw', 'snsw')).toBe(false)
  })

  it('treats missing values as no match, never as a wildcard', () => {
    expect(isSameRegion(null, null)).toBe(false)
    expect(isSameRegion('', '')).toBe(false)
    expect(isSameRegion('nnsw', null)).toBe(false)
  })
})

describe('isKnownRegion', () => {
  it('accepts real conference codes in either casing', () => {
    expect(isKnownRegion('nnsw')).toBe(true)
    expect(isKnownRegion('NNSW')).toBe(true)
    expect(isKnownRegion('sq')).toBe(true)
  })

  it('rejects junk and empties', () => {
    // Drives the difference between "a real region that happens to be empty" — which
    // should filter to nothing and say so — and "junk in the URL", which should fall
    // back to showing everything.
    expect(isKnownRegion('not-a-region')).toBe(false)
    expect(isKnownRegion('')).toBe(false)
    expect(isKnownRegion(null)).toBe(false)
  })
})
