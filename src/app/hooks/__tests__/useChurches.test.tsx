import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '../../../test/mocks/server'
import { usePublicChurches, usePublicChurchDetail, useChurchDetail } from '../useChurches'
import { HIDDEN_CHURCH_IDS } from '../../constants/hiddenRecords'

const API = '*' // wildcard host — matches whatever VITE_API_URL is in the env
const hiddenId = [...HIDDEN_CHURCH_IDS][0]

describe('usePublicChurches', () => {
  it('starts with loading=true and no error', () => {
    const { result } = renderHook(() => usePublicChurches())
    expect(result.current.loading).toBe(true)
    expect(result.current.error).toBeNull()
    expect(result.current.churches).toEqual([])
  })

  it('resolves to churches list on success', async () => {
    const { result } = renderHook(() => usePublicChurches())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toBeNull()
    expect(result.current.churches).toHaveLength(2)
    expect(result.current.churches[0].name).toBe('Mock Church 1')
  })

  it('sets error when request fails', async () => {
    server.use(
      http.get(`${API}/api/churches/public`, () =>
        HttpResponse.json(
          { success: false, message: 'Service unavailable' },
          { status: 503 }
        )
      )
    )

    const { result } = renderHook(() => usePublicChurches())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).not.toBeNull()
    expect(result.current.churches).toEqual([])
  })

  it('refetch re-triggers the request', async () => {
    let callCount = 0
    server.use(
      http.get(`${API}/api/churches/public`, () => {
        callCount++
        return HttpResponse.json({
          success: true,
          data: [{ _id: `c${callCount}`, name: `Church ${callCount}`, isActive: true }],
          count: 1,
        })
      })
    )

    const { result } = renderHook(() => usePublicChurches())

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(callCount).toBe(1)

    await result.current.refetch()
    expect(callCount).toBe(2)
  })

  it('drops hidden records the API still returns', async () => {
    server.use(
      http.get(`${API}/api/churches/public`, () =>
        HttpResponse.json({
          success: true,
          data: [
            { _id: 'church1', name: 'Mock Church 1', isActive: true },
            { _id: hiddenId, name: 'Adamstown House Church', isActive: true },
          ],
          count: 2,
        })
      )
    )

    const { result } = renderHook(() => usePublicChurches())
    await waitFor(() => expect(result.current.loading).toBe(false))

    const ids = result.current.churches.map((c) => c._id)
    expect(ids).toContain('church1')
    expect(ids).not.toContain(hiddenId)
  })
})

describe('usePublicChurchDetail', () => {
  it('fetches a specific church by ID', async () => {
    const { result } = renderHook(() => usePublicChurchDetail('church1'))

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.church).not.toBeNull()
    expect(result.current.church?._id).toBe('church1')
  })

  it('short-circuits when ID is undefined', async () => {
    const { result } = renderHook(() => usePublicChurchDetail(undefined))

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.church).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it('sets error when request fails', async () => {
    server.use(
      http.get(`${API}/api/churches/public/:id`, () =>
        HttpResponse.json(
          { success: false, message: 'Not found' },
          { status: 404 }
        )
      )
    )

    const { result } = renderHook(() => usePublicChurchDetail('bad-id'))

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).not.toBeNull()
    expect(result.current.church).toBeNull()
  })

  it('treats a hidden id as not found rather than rendering it', async () => {
    const { result } = renderHook(() => usePublicChurchDetail(hiddenId))
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.church).toBeNull()
    expect(result.current.error).toBe('Church not found')
  })
})

// useChurchDetail is the hook ChurchDetails.tsx actually renders with (routed at
// /churches/:id) — usePublicChurchDetail above is unused dead code that happens to
// share the same shape.
describe('useChurchDetail', () => {
  it('fetches a specific church by ID', async () => {
    const { result } = renderHook(() => useChurchDetail('church1'))

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.church).not.toBeNull()
    expect(result.current.church?._id).toBe('church1')
  })

  it('treats a hidden id as not found rather than rendering it', async () => {
    const { result } = renderHook(() => useChurchDetail(hiddenId))
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.church).toBeNull()
    expect(result.current.error).toBe('Church not found')
  })
})
