'use client';
import { useState, useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"
import { Button } from "@/components/ui/button";
import { Sun, Moon, Menu } from "lucide-react";
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
}: Readonly<{
  children: React.ReactNode;
}>) {

  // Estado para controlar si estamos en dark mode
  const [darkMode, setDarkMode] = useState(false);

  // Efecto que aplica la clase "dark" al <html> cuando darkMode cambia
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex min-h-screen bg-background text-foreground`}
      >

        {/* PROVIDER del sidebar */}
        <SidebarProvider>
          {/* SIDEBAR a la izquierda */}
          <AppSidebar />

          {/* CONTENEDOR principal */}
          <div className="flex-1 flex flex-col">

            {/* HEADER */}
            <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 shadow-md transition-colors duration-300">
              <div className="container mx-auto px-4 py-4 flex justify-between items-center">

                {/* BOTÓN HAMBURGER (abre/cierra sidebar) */}
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

                {/* Acciones del header */}
                <nav className="space-x-4 flex items-center">
                  {/* Toggle dark/light */}
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
                </nav>
              </div>
            </header>

            {/* MAIN */}
            <main className="flex-1 p-6">
              {children}
            </main>

            {/* FOOTER */}
            <footer className="bg-gray-100 dark:bg-gray-800 py-6 mt-auto">
              <div className="container mx-auto px-4 text-center text-gray-700 dark:text-gray-300">
                © {new Date().getFullYear()} Area de Sistemas.
              </div>
            </footer>
          </div>
        </SidebarProvider>

        {/* TOAST NOTIFICATIONS */}
        <Toaster position="top-center" expand={true} richColors />
      </body>
    </html>
  );

}
