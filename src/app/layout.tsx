'use client';
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { Button } from "@/components/ui/button";
import { Sun, Moon, Menu, LogOut } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import Image from "next/image";

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
  
  const pathname = usePathname();
  const router = useRouter();
  
  const isHomePage = pathname === '/';

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const { cerrarSesion } = await import('@/lib/session');
      await cerrarSesion();
      toast.success("Sesión cerrada correctamente");
      router.push('/');
      router.refresh();
    } catch (error) {
      toast.error("Error al cerrar sesión");
      console.error('Error en logout:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        <SidebarProvider>

          {/* ✅ Contenedor principal ÚNICO */}
          <div className="flex-1 flex flex-col h-screen">
            
            {/* Header fijo */}
            {!isHomePage && (
              <header className="flex-shrink-0 sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 shadow-md transition-colors duration-300">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <SidebarTrigger>
                      <Menu className="w-6 h-6 text-gray-800 dark:text-gray-200 cursor-pointer" />
                    </SidebarTrigger>
                    <Image
                      src="/images/logo-posgrado.png"
                      alt="Logo"
                      height={32}
                      width={120}
                      className="h-8 w-auto"
                      priority
                    />
                  </div>

                  <nav className="space-x-4 flex items-center">
                    <Button
                      variant="ghost"
                      onClick={() => setDarkMode(!darkMode)}
                      className="transition-transform duration-300 hover:scale-110"
                    >
                      {darkMode ? (
                        <Sun className="w-5 h-5 text-yellow-400" />
                      ) : (
                        <Moon className="w-5 h-5 text-gray-700" />
                      )}
                    </Button>

                    <Button 
                      onClick={handleLogout} 
                      variant="outline"
                      disabled={isLoggingOut}
                      className="hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      {isLoggingOut ? "Cerrando..." : "Cerrar Sesión"}
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

              <footer className="flex-shrink-0 bg-gray-100 dark:bg-gray-800 py-6 border-t border-gray-200">
                <div className="container mx-auto px-4 text-center text-gray-700 dark:text-gray-300">
                  <div>© {new Date().getFullYear()} Área de Sistemas.</div>
                </div>
              </footer>
            </div>

          </div>

        </SidebarProvider>

        <Toaster position="top-center" expand={true} richColors />
      </body>
    </html>
  );
}
