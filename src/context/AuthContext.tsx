import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthUser, LoginCredentials, UserRole } from '../types';

interface AuthSessionData {
  token: string;
  user: AuthUser;
  expiresAt: number;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isBackendConnected: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthUser>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_STORAGE_KEY = 'kolektiva_auth_session';

export const getDashboardPathByRole = (role: UserRole): string => {
  switch (role) {
    case 'super_admin':
      return '/dashboard/super-admin';
    case 'admin':
      return '/dashboard/admin';
    case 'editor':
      return '/dashboard/editor';
    default:
      return '/login';
  }
};

export const getRoleDisplayName = (role: UserRole): string => {
  switch (role) {
    case 'super_admin':
      return 'Super Admin';
    case 'admin':
      return 'Admin Operasional';
    case 'editor':
      return 'Editor Redaksi';
    default:
      return role;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);

  // Rehydrate session from sessionStorage on app mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (stored) {
        const parsed: AuthSessionData = JSON.parse(stored);
        if (parsed.expiresAt && Date.now() < parsed.expiresAt && parsed.user && parsed.token) {
          setUser(parsed.user);
          setToken(parsed.token);
          setIsBackendConnected(true);
        } else {
          sessionStorage.removeItem(SESSION_STORAGE_KEY);
        }
      }
    } catch {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<AuthUser> => {
    setIsLoading(true);
    setError(null);

    const identifierClean = credentials.identifier.trim();
    const passwordClean = credentials.password || '';

    if (!identifierClean || !passwordClean) {
      const msg = 'Harap isi identifier (username/email) dan kata sandi.';
      setError(msg);
      setIsLoading(false);
      throw new Error(msg);
    }

    const apiEndpoint = (import.meta as any).env?.VITE_AUTH_API_URL || '/api/auth/login';

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          identifier: identifierClean,
          password: passwordClean,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.user && data.token) {
          const authenticatedUser: AuthUser = data.user;
          const sessionData: AuthSessionData = {
            token: data.token,
            user: authenticatedUser,
            expiresAt: Date.now() + 8 * 60 * 60 * 1000, // 8 hours
          };
          sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
          setUser(authenticatedUser);
          setToken(data.token);
          setIsBackendConnected(true);
          setIsLoading(false);
          return authenticatedUser;
        } else {
          throw new Error('Format respon autentikasi tidak valid dari server.');
        }
      } else {
        const errorData = await response.json().catch(() => null);
        let errMsg = errorData?.message;
        if (!errMsg) {
          if (response.status >= 500) {
            errMsg = `Layanan server backend Express sedang tidak aktif atau gagal dihubungi (Status ${response.status}). Pastikan "npm run server:dev" sedang berjalan di port 5000.`;
          } else if (response.status === 401) {
            errMsg = 'Kredensial tidak valid. Silakan periksa kembali username/email dan kata sandi Anda.';
          } else if (response.status === 404) {
            errMsg = 'Endpoint autentikasi tidak ditemukan (Status 404). Periksa konfigurasi routing API.';
          } else {
            errMsg = `Gagal memproses autentikasi (Status ${response.status}). Silakan coba beberapa saat lagi.`;
          }
        }
        setError(errMsg);
        setIsLoading(false);
        throw new Error(errMsg);
      }
    } catch (err: any) {
      setIsBackendConnected(false);
      setIsLoading(false);

      // If the error was already a server rejection message (not a network crash)
      if (err.message && !err.message.includes('fetch') && !err.message.includes('Failed to fetch')) {
        setError(err.message);
        throw err;
      }

      // Network connection failure (Backend service is not running or endpoint is unreachable)
      const networkErrMsg =
        'Layanan autentikasi backend (POST /api/auth/login) belum terhubung atau server offline. Silakan pastikan backend API telah dijalankan.';
      setError(networkErrMsg);
      throw new Error(networkErrMsg);
    }
  };

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    setUser(null);
    setToken(null);
    setError(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        error,
        isBackendConnected,
        login,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
