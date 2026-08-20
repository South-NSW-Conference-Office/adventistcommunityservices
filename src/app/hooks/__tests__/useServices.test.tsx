import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '../../../test/mocks/server'
import { useServices, useServiceDetail } from '../useServices'

// The front-end-defined Wodonga card (staticServices.ts) and the hidden Adams
// Town records (hiddenRecords.ts) were both retired on 2026-08-20 — the card
// became a real database record and the test records were removed through the
// admin — so the list is exactly what the API returns.

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
