// app/declaracion-jurada/ProtectedDeclaracion.tsx
"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface Props {
  children: ReactNode;
}

export default function ProtectedDeclaracion({ children }: Props) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace("/"); // redirige a OTP/login
      } else {
        setVerified(true);
      }
    }
  }, [isAuthenticated, isLoading, router]);

  if (!verified) return <div>Cargando...</div>;

  return <>{children}</>;
}
