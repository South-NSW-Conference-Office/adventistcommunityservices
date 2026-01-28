const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  verified: boolean;
  avatar?: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token: string;
    permissions?: string[];
  };
  err?: string;
}

interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  err?: string;
}

export class AuthService {
  private static readonly TOKEN_KEY = 'acs_token';
  private static readonly REMEMBER_KEY = 'acs_remember';

  private static getAuthHeaders(token?: string): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signin`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.err || data.message || 'Login failed');
      }

      // Store token and remember preference
      if (data.data?.token) {
        this.setToken(data.data.token);
        if (credentials.rememberMe) {
          localStorage.setItem(this.REMEMBER_KEY, 'true');
        } else {
          localStorage.removeItem(this.REMEMBER_KEY);
        }
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Login failed',
        err: error instanceof Error ? error.message : 'Login failed',
      };
    }
  }

  static async verifyAuth(): Promise<AuthResponse> {
    const token = this.getToken();
    if (!token) {
      return {
        success: false,
        message: 'No token found',
        err: 'No token found',
      };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/is-auth`, {
        method: 'GET',
        headers: this.getAuthHeaders(token),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        this.removeToken();
        throw new Error(data.err || 'Authentication verification failed');
      }

      return {
        success: true,
        message: 'Authentication verified',
        data: {
          user: data.data.user,
          permissions: data.data.permissions,
          token,
        },
      };
    } catch (error) {
      console.error('Auth verification error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Authentication verification failed',
        err: error instanceof Error ? error.message : 'Authentication verification failed',
      };
    }
  }

  static async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.err || data.message || 'Failed to send reset email');
      }

      return {
        success: true,
        message: data.message || 'Password reset email sent',
      };
    } catch (error) {
      console.error('Forgot password error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to send reset email',
        err: error instanceof Error ? error.message : 'Failed to send reset email',
      };
    }
  }

  static async resetPassword(token: string, password: string): Promise<ForgotPasswordResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.err || data.message || 'Failed to reset password');
      }

      return {
        success: true,
        message: data.message || 'Password has been reset successfully',
      };
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to reset password',
        err: error instanceof Error ? error.message : 'Failed to reset password',
      };
    }
  }

  static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REMEMBER_KEY);
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  static logout(): void {
    this.removeToken();
    window.dispatchEvent(new CustomEvent('logout'));
  }
}
