import { AuthService } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface RequestOptions<B = Record<string, unknown>> extends Omit<RequestInit, 'body'> {
  body?: B | FormData;
}

interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  err?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getHeaders(includeAuth: boolean = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = AuthService.getToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async request<T, B = Record<string, unknown>>(
    endpoint: string,
    options: RequestOptions<B> = {},
    includeAuth: boolean = true
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = this.getHeaders(includeAuth);

    const { body, ...restOptions } = options;

    const config: RequestInit = {
      ...restOptions,
      headers: {
        ...headers,
        ...options.headers,
      },
      credentials: 'include',
    };

    if (body && !(body instanceof FormData)) {
      config.body = JSON.stringify(body);
    } else if (body instanceof FormData) {
      delete (config.headers as Record<string, string>)['Content-Type'];
      config.body = body;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.err || data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  async get<T>(endpoint: string, includeAuth: boolean = true): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' }, includeAuth);
  }

  async post<T, B = Record<string, unknown>>(
    endpoint: string,
    body?: B,
    includeAuth: boolean = true
  ): Promise<ApiResponse<T>> {
    return this.request<T, B>(endpoint, { method: 'POST', body }, includeAuth);
  }

  async put<T, B = Record<string, unknown>>(
    endpoint: string,
    body?: B,
    includeAuth: boolean = true
  ): Promise<ApiResponse<T>> {
    return this.request<T, B>(endpoint, { method: 'PUT', body }, includeAuth);
  }

  async patch<T, B = Record<string, unknown>>(
    endpoint: string,
    body?: B,
    includeAuth: boolean = true
  ): Promise<ApiResponse<T>> {
    return this.request<T, B>(endpoint, { method: 'PATCH', body }, includeAuth);
  }

  async delete<T>(endpoint: string, includeAuth: boolean = true): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' }, includeAuth);
  }
}

export const api = new ApiClient(`${API_BASE_URL}/api`);
