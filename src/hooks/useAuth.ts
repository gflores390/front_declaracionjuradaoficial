'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface UserData {
  userId: string;
  ci?: string;
  persona?: string;
  phone?: string;
}

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const createSession = (userData: UserData, expirationHours = 2) => {
    const expiryTime = new Date();
    expiryTime.setHours(expiryTime.getHours() + expirationHours);

    localStorage.setItem('declaracionSession', JSON.stringify(userData));
    localStorage.setItem('sessionExpiry', expiryTime.toISOString());

    setUserInfo(userData);
    setIsAuthenticated(true);
  };

  const clearSession = () => {
    localStorage.removeItem('declaracionSession');
    localStorage.removeItem('sessionExpiry');
    setUserInfo(null);
    setIsAuthenticated(false);
  };

  const checkAuth = () => {
    const sessionData = localStorage.getItem('declaracionSession');
    const sessionExpiry = localStorage.getItem('sessionExpiry');

    if (sessionData && sessionExpiry) {
      const expiryTime = new Date(sessionExpiry);
      if (new Date() < expiryTime) {
        setUserInfo(JSON.parse(sessionData));
        setIsAuthenticated(true);
      } else {
        clearSession();
      }
    }
    setIsLoading(false);
  };

  const logout = () => {
    clearSession();
    router.replace('/'); // redirige al home
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return { isAuthenticated, userInfo, isLoading, createSession, logout };
};
