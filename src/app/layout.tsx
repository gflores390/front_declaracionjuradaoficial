'use client'; // NUEVO: Hace que este layout sea Client Component para poder usar hooks (useState, useEffect)
import { useState, useEffect } from "react"; // NUEVO: Necesario para manejar dark/light toggle
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";


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

  // NUEVO: Estado para controlar si estamos en dark mode
  const [darkMode, setDarkMode] = useState(false);

  // NUEVO: Efecto que aplica la clase "dark" al <html> cuando darkMode cambia
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        {/* HEADER: barra superior de navegación */}
        <header className="bg-white dark:bg-gray-900 shadow-md">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            {/* Logo o nombre del proyecto */}
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Posgrado (UPEA)
            </h1>

            {/* Navegación */}
            <nav className="space-x-4 flex items-center">
              {/* NUEVO: Botón toggle dark/light */}
              <Button variant="ghost" onClick={() => setDarkMode(!darkMode)} className="transition-transform duration-300 hover:scale-110">
                {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-700" />}
              </Button>
              <Button variant="ghost">Inicio</Button> {/* Botón estilo ghost de Shadcn */}
              <Button variant="ghost">Declaración</Button>
              <Button variant="ghost">Contacto</Button>
            </nav>

          </div>
        </header>

        {/* MAIN: contenido principal que cambia según la página */}
        <main className="flex-1">
          {children} {/* Aquí se renderiza cada página dentro del layout */}
        </main>

        {/* FOOTER: parte inferior de la página */}
        <footer className="bg-gray-100 dark:bg-gray-800 py-6 mt-auto">
          <div className="container mx-auto px-4 text-center text-gray-700 dark:text-gray-300">
            © {new Date().getFullYear()} Area de Sistemas.
          </div>
        </footer>

        {children}
        <Toaster position="top-center" expand={true} richColors />
      </body>
    </html>
  );
}
