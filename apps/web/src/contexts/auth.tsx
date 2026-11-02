import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import { api, getApiErrorMessage } from '../lib/api';
import {
  clearStoredToken,
  getStoredToken,
  setStoredToken,
} from '../lib/auth-storage';
import type {
  LoginFormValues,
  RegisterFormValues,
} from '../lib/validation/auth';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

type AuthResponse = {
  token: string;
  user: AuthUser;
};

type MeResponse = {
  user: AuthUser;
};

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (values: LoginFormValues) => Promise<void>;
  register: (values: RegisterFormValues) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      const token = getStoredToken();
      if (!token) {
        if (!cancelled) {
          setIsLoading(false);
        }
        return;
      }

      try {
        const res = await api.get<MeResponse>('/auth/me');
        if (!cancelled) {
          setUser(res.data.user);
        }
      } catch {
        clearStoredToken();
        if (!cancelled) {
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  async function login(values: LoginFormValues): Promise<void> {
    try {
      const res = await api.post<AuthResponse>('/auth/login', values);
      setStoredToken(res.data.token);
      setUser(res.data.user);
    } catch (error: unknown) {
      throw new Error(getApiErrorMessage(error, 'Login failed'));
    }
  }

  async function register(values: RegisterFormValues): Promise<void> {
    try {
      const res = await api.post<AuthResponse>('/auth/register', values);
      setStoredToken(res.data.token);
      setUser(res.data.user);
    } catch (error: unknown) {
      throw new Error(getApiErrorMessage(error, 'Registration failed'));
    }
  }

  function logout() {
    clearStoredToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: Boolean(user),
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return value;
}
