"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import OtpComponent from "./otp-ci-whats";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

export default function DeclaracionPrincipal() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    const observer = new MutationObserver(() => {
      setIsDarkMode(html.classList.contains("dark"));
    });
    observer.observe(html, { attributes: true, attributeFilter: ["class"] });
    setIsDarkMode(html.classList.contains("dark"));

    // Detectar si es móvil/tablet (incluyendo iPad Pro)
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Determinar si la imagen decorativa está presente
  const isDecorImagePresent = !isMobile;

  return (
    <div
      className="fixed inset-0 w-screen h-screen bg-cover bg-center overflow-hidden transition-all duration-500"
      style={{
        backgroundImage: isDarkMode
          ? "url('/images/fondo22.png')"
          : "url('/images/fondo11.png')",
      }}
    >

      {/* CONTENEDOR SUPERIOR - Logo y botón CON Z-INDEX ALTO */}
      <div className={`absolute top-4 z-50 w-full px-4 ${isMobile ? 'flex justify-between items-center' : 'flex justify-between items-center px-8'}`}>
        {/* Logo */}
        <div className="z-50">
          <Image
            src="/images/logoblanco.png"
            alt="Logo Posgrado"
            width={isMobile ? 140 : 190}
            height={isMobile ? 40 : 55}
            className={`${isMobile ? "h-10" : "h-14"} w-auto`}
            priority
          />
        </div>

        {/* Botón modo oscuro - COLOR CONDICIONAL BASADO EN LA IMAGEN DECORATIVA */}
        <Button
          variant="ghost"
          onClick={() => {
            const html = document.documentElement;
            html.classList.toggle("dark");
            setIsDarkMode(html.classList.contains("dark"));
          }}
          className="transition-transform duration-300 hover:scale-110 p-2 bg-transparent hover:bg-transparent z-50"
          aria-label="Toggle Dark Mode"
        >
          {isDarkMode ? (
            <Sun className={`${isMobile ? "w-7 h-7" : "w-8 h-8"} text-yellow-400`} /> 
          ) : (
            <Moon className={`${isMobile ? "w-7 h-7" : "w-8 h-8"} ${
              isDecorImagePresent ? "text-gray-400" : "text-white"
            }`} />
          )}
        </Button>
      </div>

      {/* Imagen decorativa - Solo en desktop */}
      {isDecorImagePresent && (
        <Image
          src="/images/fonfo1.png"
          alt="Decoración derecha"
          width={600}
          height={1000}
          className="hidden md:block pointer-events-none z-10 opacity-100"
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            height: '100%',
            width: 'auto',
            objectFit: 'cover',
            objectPosition: 'right center',
            filter: 'drop-shadow(-40px 0 60px rgba(255, 255, 255, 0.4))',
          }}
        />
      )}

      {/* CONTENIDO PRINCIPAL */}
      <div className={`absolute inset-0 z-20 flex flex-col justify-center items-center px-4 sm:px-6 md:px-8 ${
        isMobile ? 'text-center' : 'lg:items-start lg:text-left lg:px-12'
      }`}>
        
        {/* Título principal */}
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className={`font-bold mb-4 ${
            isMobile 
              ? 'text-2xl sm:text-3xl md:text-4xl max-w-md md:max-w-2xl' 
              : 'text-4xl md:text-5xl lg:text-6xl max-w-3xl'
          }`}
          style={{
            fontFamily: "'Public Sans', sans-serif",
            lineHeight: '1.1',
          }}
        >
          <span className="text-white dark:text-transparent dark:bg-gradient-to-r dark:from-[#FFC800] dark:to-white dark:bg-clip-text">
            ¡BIENVENIDO AL SISTEMA!
          </span>
        </motion.h1>

        {/* Subtítulo */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className={`text-white font-medium mb-8 ${
            isMobile 
              ? 'text-sm sm:text-base md:text-lg max-w-xs sm:max-w-md' 
              : 'text-lg md:text-xl lg:text-2xl max-w-xl'
          }`}
        >
          Su información es importante. Acceda con su Cédula de Identidad para iniciar sesión en el sistema.
        </motion.p>

        {/* Componente OTP */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className={`w-full ${
            isMobile 
              ? 'flex justify-center' 
              : 'lg:flex lg:justify-start'
          }`}
        >
          <div className={`${
            isMobile 
              ? 'w-full max-w-xs sm:max-w-sm md:max-w-md flex justify-center' 
              : 'lg:w-auto'
          }`}>
            <OtpComponent />
          </div>
        </motion.div>
      </div>

      {/* Estilos CSS */}
      <style jsx global>{`
        /* Asegurar que body y html no tengan scroll */
        html, body {
          overflow: hidden !important;
          height: 100vh !important;
          width: 100vw !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        /* Asegurar que el root también ocupe toda la pantalla */
        #__next, #root {
          height: 100vh !important;
          width: 100vw !important;
          overflow: hidden !important;
        }
        
        /* Asegurar que el botón de modo oscuro esté siempre al frente */
        .dark-mode-button-container {
          z-index: 1000 !important;
          position: relative !important;
        }
        
        .dark-mode-button {
          z-index: 1001 !important;
          position: relative !important;
          background: transparent !important;
          border: none !important;
        }
        
        /* Color amarillo vibrante para el sol */
        .sun-icon {
          color: #fbbf24 !important;
        }

        /* Asegurar que la imagen decorativa esté detrás */
        .decorative-image {
          z-index: 5 !important;
        }

        /* Contenido principal detrás del header pero delante del fondo */
        .main-content {
          z-index: 20 !important;
        }

        /* Centrado perfecto para iPad Pro (768px - 1023px) */
        @media (min-width: 768px) and (max-width: 1023px) {
          .main-container {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            text-align: center !important;
          }
          
          .title-container {
            text-align: center !important;
            margin-left: auto !important;
            margin-right: auto !important;
            max-width: 600px !important;
          }
          
          .subtitle-container {
            text-align: center !important;
            margin-left: auto !important;
            margin-right: auto !important;
            max-width: 500px !important;
            margin-bottom: 2.5rem !important;
          }
          
          .otp-wrapper {
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            width: 100% !important;
            margin: 0 auto !important;
          }
          
          .otp-component {
            width: 100% !important;
            max-width: 420px !important;
            display: flex !important;
            justify-content: center !important;
          }
        }

        /* Para móviles pequeños */
        @media (max-width: 767px) {
          .otp-component {
            max-width: 320px !important;
          }
        }

        /* Para desktop */
        @media (min-width: 1024px) {
          .main-container {
            align-items: flex-start !important;
            text-align: left !important;
          }
        }
      `}</style>
    </div>
  );
}