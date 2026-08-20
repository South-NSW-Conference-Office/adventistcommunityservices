import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '../../../test/mocks/server'
import { useServices, useServiceDetail } from '../useServices'
import { HIDDEN_SERVICE_IDS } from '../../constants/hiddenRecords'

// The front-end-defined Wodonga card (staticServices.ts) was retired on
// 2026-08-20: it exists as a real database record now, so the list is exactly
// what the API returns minus the hidden ids.

const API = '*' // wildcard host — matches whatever VITE_API_URL is in the env

const dbService = {
  _id: '6a50af5821e0d200e99e524c',
  name: 'Community Yard Cleans',
  type: 'yard_work',
  status: 'active',
}

function mockServicesList(data: unknown[]) {
  server.use(
    http.get(`${API}/api/services/public`, () =>
      HttpResponse.json({ success: true, data, count: data.length })
    )
  )
}

describe('useServices', () => {
  it('returns the API records as-is', async () => {
    mockServicesList([dbService])

    const { result } = renderHook(() => useServices())
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toBeNull()
    expect(result.current.services).toHaveLength(1)
    expect(result.current.services[0]._id).toBe(dbService._id)
  })

  it('no longer appends any front-end-defined services', async () => {
    mockServicesList([])

    const { result } = renderHook(() => useServices())
    await waitFor(() => expect(result.current.loading).toBe(false))

    // Before 2026-08-20 an empty API response still yielded the static Wodonga
    // card. An empty response is now an empty list.
    expect(result.current.services).toHaveLength(0)
  })
})

describe('useServices — hidden records', () => {
  const hiddenId = [...HIDDEN_SERVICE_IDS][0]

  it('drops hidden records the API still returns', async () => {
    mockServicesList([dbService, { ...dbService, _id: hiddenId, name: 'Adams town test' }])

    const { result } = renderHook(() => useServices())
    await waitFor(() => expect(result.current.loading).toBe(false))

    const ids = result.current.services.map((s) => s._id)
    expect(ids).toContain(dbService._id)
    expect(ids).not.toContain(hiddenId)
    expect(result.current.services.some((s) => /test/i.test(s.name))).toBe(false)
  })

  it('treats a hidden id as not found rather than rendering it', async () => {
    const { result } = renderHook(() => useServiceDetail(hiddenId))
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.service).toBeNull()
    expect(result.current.error).toBe('Service not found')
  })
})

describe('useServiceDetail', () => {
  it('fetches services from the API', async () => {
    server.use(
      http.get(`${API}/api/services/public/:id`, ({ params }) =>
        HttpResponse.json({ success: true, data: { ...dbService, _id: params.id } })
      )
    )

    const { result } = renderHook(() => useServiceDetail(dbService._id))
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toBeNull()
    expect(result.current.service?._id).toBe(dbService._id)
  })

  it('reports not-found for an id the API does not know', async () => {
    // The retired static card's id ('local-wodonga-community-yard-cleans') now
    // takes this path like any other unknown id: a plain 404, no local fallback.
    server.use(
      http.get(`${API}/api/services/public/:id`, () =>
        HttpResponse.json({ success: false, message: 'Service not found' }, { status: 404 })
      )
    )

    const { result } = renderHook(() => useServiceDetail('local-wodonga-community-yard-cleans'))
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.service).toBeNull()
    expect(result.current.error).toBeTruthy()
  })
})
