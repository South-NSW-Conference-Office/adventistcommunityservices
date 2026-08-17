import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '../../../test/mocks/server'
import { useServices, useServiceDetail } from '../useServices'
import { STATIC_SERVICES } from '../../constants/staticServices'
import { HIDDEN_SERVICE_IDS } from '../../constants/hiddenRecords'

const API = '*' // wildcard host — matches whatever VITE_API_URL is in the env

const WODONGA_ID = 'local-wodonga-community-yard-cleans'

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

describe('useServices — front-end-defined services', () => {
  it('appends static services after the records returned by the API', async () => {
    mockServicesList([dbService])

    const { result } = renderHook(() => useServices())
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toBeNull()
    expect(result.current.services).toHaveLength(1 + STATIC_SERVICES.length)
    // API records keep their position; static ones come last.
    expect(result.current.services[0]._id).toBe(dbService._id)
    expect(result.current.services.at(-1)?._id).toBe(WODONGA_ID)
  })

  it('exposes the Wodonga card with the team label the services list expects', async () => {
    mockServicesList([])

    const { result } = renderHook(() => useServices())
    await waitFor(() => expect(result.current.loading).toBe(false))

    const wodonga = result.current.services.find((s) => s._id === WODONGA_ID)
    expect(wodonga).toBeDefined()
    expect(wodonga?.name).toBe('Community Yard Cleans')
    // Shortened deliberately to read like "Narromine Team" / "Dubbo Team".
    expect(wodonga?.teamId).toMatchObject({ name: 'Wodonga Team' })
    expect(wodonga?.churchId).toMatchObject({ name: 'Wodonga Adventist Community Church' })
  })

  it('does not collide with real ObjectIds', () => {
    for (const service of STATIC_SERVICES) {
      expect(service._id).not.toMatch(/^[0-9a-f]{24}$/)
    }
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

describe('useServiceDetail — front-end-defined services', () => {
  it('resolves a static service locally without calling the API', async () => {
    // Any request to the detail endpoint fails the test: a static id must never
    // reach the API, which has no record of it and would answer 404.
    server.use(
      http.get(`${API}/api/services/public/:id`, () =>
        HttpResponse.json({ success: false, message: 'Service not found' }, { status: 404 })
      )
    )

    const { result } = renderHook(() => useServiceDetail(WODONGA_ID))
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toBeNull()
    expect(result.current.service?._id).toBe(WODONGA_ID)
    expect(result.current.service?.name).toBe('Community Yard Cleans')
  })

  it('still fetches real services from the API', async () => {
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
})
