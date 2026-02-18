import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import Image from "next/image";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [darkMode, setDarkMode] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const pathname = usePathname();
  const router = useRouter();
  
  const isHomePage = pathname === '/';
  const isOtpPage = pathname === '/declaracion-jurada/otp';

  // Verificar autenticación
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const data = await response.json();
        setIsAuthenticated(data.authenticated);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    if (!isHomePage && !isOtpPage) {
      checkAuth();
    }
  }, [pathname, isHomePage, isOtpPage]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        setIsAuthenticated(false);
        toast.success('Sesión cerrada correctamente');
        
        // Esperar un momento antes de redirigir
        setTimeout(() => {
          router.push('/');
          router.refresh();
        }, 500);
      } else {
        toast.error('Error al cerrar sesión');
        setIsLoggingOut(false);
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      toast.error('Error al cerrar sesión');
      setIsLoggingOut(false);
    }
  };

  // Determinar si mostrar el header (no en home ni en OTP)
  const showHeader = !isHomePage && !isOtpPage && isAuthenticated;

  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        <Providers>
          {/* Contenedor principal */}
          <div className="flex-1 flex flex-col h-screen">
            
            {/* Header fijo - solo si está autenticado y no está en home/otp */}
            {showHeader && (
              <header className="
                sticky top-0 z-50
                backdrop-blur-xl
                bg-gradient-to-r
                from-white/90 via-white/80 to-white/90
                dark:from-gray-900/90 dark:via-gray-900/80 dark:to-gray-900/90
                border-b border-blue-200/40 dark:border-blue-900/40
                shadow-[0_8px_30px_rgba(33,95,153,0.18)]
              ">
                {/* Línea superior decorativa */}
                <div className="h-[3px] bg-gradient-to-r from-[#215F99] via-blue-400 to-[#215F99]" />

                {/* Contenido del header */}
                <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                  
                  {/* IZQUIERDA - Logo y título */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <Image
                        src="/images/logo-posgrado.png"
                        alt="Logo Posgrado"
                        height={32}
                        width={120}
                        className="h-8 w-auto drop-shadow-sm"
                        priority
                      />

                      <span className="h-7 w-px bg-blue-300/60 dark:bg-blue-700/60" />

                      <span className="
                        hidden lg:inline-block
                        text-sm font-semibold tracking-widest
                        text-[#215F99] dark:text-blue-400
                        uppercase
                      ">
                        Sistema Académico
                      </span>
                    </div>
                  </div>

                  {/* DERECHA - Botón de cerrar sesión */}
                  <nav className="flex items-center gap-3">
                    <Button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="
                        flex items-center gap-2
                        px-4 py-2
                        rounded-lg
                        bg-white dark:bg-gray-900
                        border border-gray-300 dark:border-gray-700
                        text-gray-700 dark:text-gray-200
                        hover:bg-red-50 hover:text-red-600 hover:border-red-300
                        dark:hover:bg-red-900/20 dark:hover:text-red-400
                        transition-all duration-200
                        disabled:opacity-50 disabled:cursor-not-allowed
                      "
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm font-semibold">
                        {isLoggingOut ? "Cerrando..." : "Cerrar Sesión"}
                      </span>
                    </Button>
                  </nav>
                </div>
              </header>
            )}

            {/* Contenedor con scroll */}
            <div className="flex-1 overflow-y-auto flex flex-col">
              <main className="bg-gray-50 dark:bg-gray-900 flex-1">
                {children}
              </main>

              {/* Footer */}
              <footer className="flex-shrink-0 bg-gray-100 dark:bg-gray-800 py-6 border-t border-gray-200 dark:border-gray-700">
                <div className="container mx-auto px-4 text-center text-gray-700 dark:text-gray-300">
                  <div className="text-sm">
                    © {new Date().getFullYear()} Área de Sistemas. Todos los derechos reservados.
                  </div>
                </div>
              </footer>
            </div>
          </div>
        </Providers>

        {/* Toast notifications */}
        <Toaster position="top-center" expand={true} richColors />
      </body>
    </html>
  );
}