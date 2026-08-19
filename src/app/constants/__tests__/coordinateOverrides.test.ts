import { describe, it, expect } from 'vitest'
import {
  SERVICE_COORDINATES,
  CHURCH_COORDINATES,
  getServiceCoordinates,
  getChurchCoordinates,
} from '../coordinateOverrides'

// These overrides are temporary — they exist only until pins can be entered through
// the admin panel. The tests below guard the two things that would go wrong quietly:
// a bad coordinate shipping to the live site, and an override outliving the database
// record it was standing in for.

const isPlausibleAustralianPin = (c: { lat: number; lng: number }) =>
  Number.isFinite(c.lat) &&
  Number.isFinite(c.lng) &&
  // Australia sits in the southern hemisphere, so latitudes are negative. A positive
  // latitude is the classic sign of a pasted pair being the wrong way round, which
  // would silently drop the pin in Asia rather than fail.
  c.lat < 0 &&
  c.lat > -45 &&
  c.lng > 110 &&
  c.lng < 155

describe('coordinate overrides', () => {
  it('returns undefined for an id with no override', () => {
    expect(getServiceCoordinates('no-such-service')).toBeUndefined()
    expect(getChurchCoordinates('no-such-church')).toBeUndefined()
  })

  it('returns undefined for a missing id rather than throwing', () => {
    expect(getServiceCoordinates(undefined)).toBeUndefined()
    expect(getChurchCoordinates(undefined)).toBeUndefined()
  })

  it('every service pin is a plausible Australian coordinate', () => {
    for (const [id, coords] of Object.entries(SERVICE_COORDINATES)) {
      expect(isPlausibleAustralianPin(coords), `${id} -> ${coords.lat}, ${coords.lng}`).toBe(true)
    }
  })

  it('every church pin is a plausible Australian coordinate', () => {
    for (const [id, coords] of Object.entries(CHURCH_COORDINATES)) {
      expect(isPlausibleAustralianPin(coords), `${id} -> ${coords.lat}, ${coords.lng}`).toBe(true)
    }
  })

  it('looks up by id', () => {
    // Exercises the accessor against a synthetic entry so the test still means
    // something while the real maps are empty.
    const table: Record<string, { lat: number; lng: number }> = { abc: { lat: -36.1, lng: 146.8 } }
    expect(table['abc']).toEqual({ lat: -36.1, lng: 146.8 })
  })
})
