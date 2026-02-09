'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface UserData {
  userId: string;
  ci?: string;
}

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/session', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        console.log('[useAuth] Session data:', data);
        setUserInfo({
          userId: data.userId,
          ci: data.ci,
        });
        setIsAuthenticated(true);
      } else {
        console.log('[useAuth] No session found');
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('[useAuth] Error checking auth:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch (error) {
      console.error('[useAuth] Error logging out:', error);
    }
    setIsAuthenticated(false);
    setUserInfo(null);
    router.replace('/');
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return { isAuthenticated, userInfo, isLoading, logout };
};
