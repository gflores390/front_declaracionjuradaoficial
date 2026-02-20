"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Image from "next/image";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [darkMode, setDarkMode] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const isHomePage = pathname === "/";
  const isOtpPage = pathname === "/declaracion-jurada/otp";

  // Verificar autenticación
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/session");
        const data = await response.json();
        setIsAuthenticated(data.authenticated);
      } catch {
        setIsAuthenticated(false);
      }
    };

    if (!isHomePage && !isOtpPage) {
      checkAuth();
    }
  }, [pathname, isHomePage, isOtpPage]);

  // Dark mode
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        setIsAuthenticated(false);
        toast.success("Sesión cerrada correctamente");

        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 500);
      } else {
        throw new Error();
      }
    } catch {
      toast.error("Error al cerrar sesión");
      setIsLoggingOut(false);
    }
  };

  const showHeader = !isHomePage && !isOtpPage && isAuthenticated;

  return (
    <div className="flex-1 flex flex-col h-screen">
      {showHeader && (
        <header
          className="
            sticky top-0 z-50
            backdrop-blur-xl
            bg-gradient-to-r
            from-white/90 via-white/80 to-white/90
            dark:from-gray-900/90 dark:via-gray-900/80 dark:to-gray-900/90
            border-b border-blue-200/40 dark:border-blue-900/40
            shadow-[0_8px_30px_rgba(33,95,153,0.18)]
          "
        >
          <div className="h-[3px] bg-gradient-to-r from-[#215F99] via-blue-400 to-[#215F99]" />

          <div className="container mx-auto px-6 py-3 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Image
                src="/images/logo-posgrado.png"
                alt="Logo Posgrado"
                height={32}
                width={120}
                priority
              />
            </div>

            <Button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              {isLoggingOut ? "Cerrando..." : "Cerrar Sesión"}
            </Button>
          </div>
        </header>
      )}

      <div className="flex-1 overflow-y-auto flex flex-col">
        <main className="bg-gray-50 dark:bg-gray-900 flex-1">
          {children}
        </main>

        <footer className="bg-gray-100 dark:bg-gray-800 py-6 border-t">
          <div className="text-center text-sm">
            © {new Date().getFullYear()} Área de Sistemas. Todos los derechos reservados.
          </div>
        </footer>
      </div>
    </div>
  );
}
