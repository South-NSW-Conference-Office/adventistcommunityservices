import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '../../../test/mocks/server'
import { AuthService } from '../auth'

const API = '*' // wildcard host — matches whatever VITE_API_URL is in the env

describe('AuthService - token storage', () => {
  beforeEach(() => {
    localStorage.removeItem('acs_token')
    localStorage.removeItem('acs_remember')
  })

  it('setToken stores token in localStorage', () => {
    AuthService.setToken('my-jwt-token')
    expect(localStorage.getItem('acs_token')).toBe('my-jwt-token')
  })

  it('getToken returns stored token', () => {
    localStorage.setItem('acs_token', 'stored-token')
    expect(AuthService.getToken()).toBe('stored-token')
  })

  it('getToken returns null when nothing stored', () => {
    expect(AuthService.getToken()).toBeNull()
  })

  it('removeToken clears token and remember-me', () => {
    localStorage.setItem('acs_token', 'x')
    localStorage.setItem('acs_remember', 'y')
    AuthService.removeToken()
    expect(localStorage.getItem('acs_token')).toBeNull()
    expect(localStorage.getItem('acs_remember')).toBeNull()
  })

  it('isAuthenticated reflects token presence', () => {
    expect(AuthService.isAuthenticated()).toBe(false)
    AuthService.setToken('token')
    expect(AuthService.isAuthenticated()).toBe(true)
  })
})

describe('AuthService.login', () => {
  beforeEach(() => {
    localStorage.removeItem('acs_token')
    localStorage.removeItem('acs_remember')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns successful auth response on valid credentials', async () => {
    server.use(
      http.post(`${API}/api/auth/signin`, () =>
        HttpResponse.json({
          success: true,
          message: 'Login successful',
          data: {
            user: {
              id: 'user1',
              name: 'Test',
              email: 'test@test.com',
              verified: true,
            },
            token: 'fake-jwt',
            permissions: ['*'],
          },
        })
      )
    )

    const result = await AuthService.login({
      email: 'test@test.com',
      password: 'pass1234',
    })

    expect(result.success).toBe(true)
    expect(result.data?.token).toBe('fake-jwt')
    expect(result.data?.user.email).toBe('test@test.com')
  })

  it('returns error response on bad credentials', async () => {
    server.use(
      http.post(`${API}/api/auth/signin`, () =>
        HttpResponse.json(
          {
            success: false,
            message: 'Invalid credentials',
            err: 'Incorrect password',
          },
          { status: 401 }
        )
      )
    )

    const result = await AuthService.login({
      email: 'wrong@test.com',
      password: 'bad',
    })

    expect(result.success).toBe(false)
    // AuthService puts the err field into message on error responses
    expect(result.message).toMatch(/Incorrect password|Invalid credentials/i)
  })
})

describe('AuthService.logout', () => {
  beforeEach(() => {
    localStorage.removeItem('acs_token')
    localStorage.removeItem('acs_remember')
    vi.spyOn(window, 'dispatchEvent').mockImplementation(() => true)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('removes token and dispatches logout event', () => {
    AuthService.setToken('x')
    AuthService.logout()

    expect(localStorage.getItem('acs_token')).toBeNull()
    expect(window.dispatchEvent).toHaveBeenCalled()
  })
})
