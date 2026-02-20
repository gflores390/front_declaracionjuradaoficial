"use client";

import { createContext, ReactNode, useContext } from "react";
import { useAuth, UserData } from "@/hooks/useAuth";

interface AuthContextProps {
  isAuthenticated: boolean;
  userInfo: UserData | null;
  isLoading: boolean;
  // createSession: (data: UserData) => void;
  logout: () => void;
}

// Creamos el contexto
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Provider que envolverá tu aplicación
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

// Hook personalizado para usar el contexto
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthContext debe estar dentro de AuthProvider");
  return context;
};
