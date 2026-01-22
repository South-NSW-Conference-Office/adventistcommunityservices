import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { AuthService } from '../services/auth';

interface User {
  id: string;
  name: string;
  email: string;
  verified: boolean;
  avatar?: string;
  permissions?: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    if (!AuthService.isAuthenticated()) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const result = await AuthService.verifyAuth();
      if (result.success && result.data?.user) {
        setUser({
          ...result.data.user,
          permissions: result.data.permissions || [],
        });
      } else {
        setUser(null);
        AuthService.removeToken();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      AuthService.removeToken();
    } finally {
      setLoading(false);
    }
  }, []);

  const hasPermission = useCallback((permission: string): boolean => {
    if (!user?.permissions) return false;
    // Check for exact match or wildcard permissions
    return user.permissions.some((p) => {
      if (p === '*') return true;
      if (p === permission) return true;
      // Check for wildcard like "page_content.*"
      const [resource, action] = permission.split('.');
      if (p === `${resource}.*`) return true;
      return false;
    });
  }, [user?.permissions]);

  useEffect(() => {
    checkAuth();

    // Listen for logout events
    const handleLogout = () => {
      setUser(null);
    };

    window.addEventListener('logout', handleLogout);

    // Listen for storage events (other tabs)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'acs_token') {
        if (!e.newValue) {
          setUser(null);
        } else {
          checkAuth();
        }
      }
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('logout', handleLogout);
      window.removeEventListener('storage', handleStorage);
    };
  }, [checkAuth]);

  const login = async (
    email: string,
    password: string,
    rememberMe?: boolean
  ): Promise<{ success: boolean; message: string }> => {
    setLoading(true);
    try {
      const result = await AuthService.login({ email, password, rememberMe });

      if (result.success && result.data?.user) {
        setUser({
          ...result.data.user,
          permissions: result.data.permissions || [],
        });
        return { success: true, message: 'Login successful' };
      }

      return {
        success: false,
        message: result.err || result.message || 'Login failed',
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Login failed',
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
    checkAuth,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
