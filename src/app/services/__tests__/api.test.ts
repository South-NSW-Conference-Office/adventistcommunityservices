import { describe, it, expect, beforeEach } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '../../../test/mocks/server'
import { api } from '../api'

const API = '*' // wildcard host — matches whatever VITE_API_URL is in the env

describe('ApiClient', () => {
  beforeEach(() => {
    localStorage.removeItem('acs_token')
  })

  describe('.get', () => {
    it('fetches and parses JSON on 200', async () => {
      server.use(
        http.get(`${API}/api/test-path`, () =>
          HttpResponse.json({ success: true, data: { hello: 'world' } })
        )
      )

      const res = await api.get<{ hello: string }>('/test-path', false)
      expect(res.success).toBe(true)
      expect(res.data?.hello).toBe('world')
    })

    it('sends Authorization header when token present', async () => {
      localStorage.setItem('acs_token', 'my-token')

      let capturedAuth: string | null = null
      server.use(
        http.get(`${API}/api/authed`, ({ request }) => {
          capturedAuth = request.headers.get('Authorization')
          return HttpResponse.json({ success: true })
        })
      )

      await api.get('/authed')
      expect(capturedAuth).toBe('Bearer my-token')
    })

    it('omits Authorization when includeAuth=false', async () => {
      localStorage.setItem('acs_token', 'my-token')

      let capturedAuth: string | null = null
      server.use(
        http.get(`${API}/api/public`, ({ request }) => {
          capturedAuth = request.headers.get('Authorization')
          return HttpResponse.json({ success: true })
        })
      )

      await api.get('/public', false)
      expect(capturedAuth).toBeNull()
    })

    it('throws on non-ok response with message from body', async () => {
      server.use(
        http.get(`${API}/api/fail`, () =>
          HttpResponse.json(
            { success: false, message: 'Something broke' },
            { status: 500 }
          )
        )
      )

      await expect(api.get('/fail', false)).rejects.toThrow('Something broke')
    })
  })

  describe('.post', () => {
    it('sends JSON body with Content-Type', async () => {
      let capturedBody: string | null = null
      let capturedType: string | null = null

      server.use(
        http.post(`${API}/api/create`, async ({ request }) => {
          capturedBody = await request.text()
          capturedType = request.headers.get('Content-Type')
          return HttpResponse.json({ success: true, data: { id: '1' } }, { status: 201 })
        })
      )

      await api.post('/create', { name: 'Test' }, false)

      expect(capturedBody).toBe(JSON.stringify({ name: 'Test' }))
      expect(capturedType).toContain('application/json')
    })

    it('sends FormData without explicit Content-Type header', async () => {
      let capturedType: string | null = null
      let bodyText = ''

      server.use(
        http.post(`${API}/api/upload`, async ({ request }) => {
          capturedType = request.headers.get('Content-Type')
          bodyText = await request.text()
          return HttpResponse.json({ success: true })
        })
      )

      const form = new FormData()
      form.append('myfield', 'hello')

      await api.post('/upload', form, false)

      // Browser/fetch sets multipart/form-data with its own boundary
      expect(capturedType).toMatch(/^multipart\/form-data/)
      expect(bodyText).toContain('hello')
      expect(bodyText).toContain('name="myfield"')
    })
  })

  describe('.put', () => {
    it('sends PUT request with body', async () => {
      let method: string | null = null
      server.use(
        http.put(`${API}/api/update/1`, ({ request }) => {
          method = request.method
          return HttpResponse.json({ success: true })
        })
      )

      await api.put('/update/1', { name: 'Updated' }, false)
      expect(method).toBe('PUT')
    })
  })

  describe('.delete', () => {
    it('sends DELETE request', async () => {
      let method: string | null = null
      server.use(
        http.delete(`${API}/api/remove/1`, ({ request }) => {
          method = request.method
          return HttpResponse.json({ success: true })
        })
      )

      await api.delete('/remove/1', false)
      expect(method).toBe('DELETE')
    })
  })
})
