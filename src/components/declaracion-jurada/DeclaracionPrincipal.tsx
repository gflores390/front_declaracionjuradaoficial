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

  const toggleDarkMode = () => {
    const html = document.documentElement;
    html.classList.toggle("dark");
    setIsDarkMode(html.classList.contains("dark"));
  };
function RandomPerson() {
  const [index, setIndex] = useState(0);
  const images = [
    "/images/PER1.png",
    "/images/PER2.png",
    "/images/PER3.png",
    "/images/PER4.png",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); 
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="hidden lg:block absolute right-0 bottom-0 z-10 w-[65vw] h-screen pointer-events-none overflow-hidden">
      <div className="relative w-full h-full flex items-end justify-end pr-20 xl:pr-32">
        <motion.div
          key={images[index]}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="relative w-full h-full flex items-end justify-end"
        >
          <Image
            src={images[index]}
            alt="Persona Institucional"
            width={1800} 
            height={2400}
            quality={100} // Máxima calidad de Next.js
            priority
            className="object-contain h-[105vh] w-auto select-none scale-110 origin-bottom 
                       drop-shadow-[0_10px_40px_rgba(0,0,0,0.4)]"
            style={{ 
              // Cambiamos "smooth" por "auto" que es el estándar compatible con TS
              imageRendering: 'auto', 
              // Este truco mejora el suavizado en navegadores basados en Webkit (Chrome/Edge/Safari)
              WebkitBackfaceVisibility: 'hidden',
              transform: 'translate3d(0,0,0)' // Fuerza renderizado por hardware (GPU) para mayor nitidez
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
  return (
    <div
      className="fixed inset-0 w-screen h-screen overflow-hidden transition-all duration-700"
      style={{
        background: isDarkMode
          ? "linear-gradient(135deg, #1e3a8a 0%, #0f172a 50%, #1e3a8a 100%)"
          : "linear-gradient(135deg, #eff6ff 0%, #F5F9FF 50%, #eff6ff 100%)",
      }}
    >
      {/* IMAGEN DE FONDO - FONDO.png para PC, FONDOC.png para móvil/tablet */}
      <div 
        className="absolute inset-0 z-[1] bg-cover bg-center bg-no-repeat opacity-100"
        style={{
          backgroundImage: isMobile
            ? "url(/images/FONDOC.png)"
            : "url(/images/FONDO.png)",
        }}
      />

      {/* Elemento decorativo de fondo - Orbs institucionales */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-[5]">
        {/* Orb 1 - Superior derecha (Azul) */}
        <div 
          className="absolute w-96 h-96 rounded-full opacity-15 dark:opacity-10"
          style={{
            background: 'radial-gradient(circle, #2563eb, transparent)',
            top: '-10%',
            right: '5%',
            filter: 'blur(80px)',
          }}
        />
        {/* Orb 2 - Centro derecha (Amarillo) */}
        <div 
          className="absolute w-80 h-80 rounded-full opacity-10 dark:opacity-5"
          style={{
            background: 'radial-gradient(circle, #fbbf24, transparent)',
            top: '30%',
            right: '-5%',
            filter: 'blur(70px)',
          }}
        />
        {/* Orb 3 - Inferior izquierda (Azul) */}
        <div 
          className="absolute w-72 h-72 rounded-full opacity-12 dark:opacity-5"
          style={{
            background: 'radial-gradient(circle, #1e40af, transparent)',
            bottom: '10%',
            left: '-5%',
            filter: 'blur(70px)',
          }}
        />
      </div>

      {/* Decoración de líneas verticales a la derecha */}
      <div className="hidden lg:block absolute right-0 top-0 h-full w-1 pointer-events-none z-[5]">
        <div className="absolute right-12 top-0 h-full w-px bg-gradient-to-b from-blue-400 via-yellow-300 to-blue-400 opacity-20"></div>
        <div className="absolute right-24 top-20 h-96 w-px bg-gradient-to-b from-transparent via-blue-300 to-transparent opacity-15"></div>
      </div>

      {/* Decoración flotante a la derecha */}
      {!isMobile && (
        <motion.div
          className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none hidden lg:flex flex-col gap-6 z-[5]"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <div className="w-20 h-20 rounded-lg bg-blue-500 opacity-10 dark:opacity-5 rotate-12"></div>
          <div className="w-16 h-16 rounded-full bg-yellow-400 opacity-12 dark:opacity-5"></div>
          <div className="w-24 h-24 rounded-lg bg-blue-600 opacity-8 dark:opacity-3 -rotate-6"></div>
        </motion.div>
      )}

      {/* CONTENEDOR SUPERIOR - Logo y botón */}
      <div className="absolute top-0 z-50 w-full px-4 sm:px-8 py-4 md:py-6 flex justify-between items-center">
        {/* Logo */}
        <div className="z-50 flex items-center">
          {/* MODO CLARO */}
          <Image
  src="/images/logoblanco.png"
  alt="Logo Posgrado"
  width={200} 
  height={60}
  className="h-auto 
    /* Móvil: pequeño y centrado visualmente */
    w-[35vw] max-w-[120px] 
    /* Tablet/Laptop: Escala ligera */
    md:w-[15vw] md:max-w-[140px] 
    /* PC Monitor Normal: Tamaño profesional reducido */
    lg:max-w-[160px] 
    /* Pantallas muy grandes: No sobrepasa los 200px */
    xl:max-w-[180px] 2xl:max-w-[200px] 
    object-contain"
  priority
/>

          {/* MODO OSCURO */}
          <Image
            src="/images/logoblanco.png"
            alt="Logo Posgrado Blanco"
            width={190}
            height={55}
            className="hidden dark:block h-10 md:h-14 w-auto object-contain"
            priority
          />
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="absolute inset-0 z-20 flex flex-col justify-center items-center px-4 sm:px-6 md:px-8 lg:items-start lg:text-left lg:px-16">
        
        {/* Título principal */}
        <motion.h1
  className="font-extrabold mb-5 text-center lg:text-left text-balance leading-tight
    text-[1.8rem] 
    sm:text-[2.2rem] 
    md:text-[2.8rem] 
    lg:text-[3.2rem] /* Tamaño moderado para PC */
    xl:text-[3.5rem] 
    2xl:text-[3.8rem]"
>
  <span className="text-yellow-400 ...">
    Declaración Jurada
  </span>
</motion.h1>

        {/* Descripción */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="
            text-white dark:text-slate-400
            mb-8
            max-w-4xl
            leading-relaxed
            mx-auto lg:mx-0
            font-light
            text-justify
          "
        >
          <strong className="block text-justify">
            La información consignada en el presente formulario tiene carácter de
            Declaración Jurada y será utilizada exclusivamente para fines administrativos
            y de control institucional.
          </strong>

          <span className="block mt-4 text-center lg:text-left">
            Acceda con su Cédula de Identidad para iniciar sesión y completar su declaración.
          </span>
        </motion.p>


        {/* Componente OTP */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="w-full flex justify-center lg:justify-start"
        >
          <div className="w-full max-w-[85vw] sm:max-w-[320px] lg:max-w-[340px] xl:max-w-[360px]">
            <OtpComponent />
          </div>
        </motion.div>
      </div>

      {/* Estilos CSS globales */}
      <style jsx global>{`
        html, body {
          overflow: hidden !important;
          height: 100vh !important;
          width: 100vw !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        #__next, #root {
          height: 100vh !important;
          width: 100vw !important;
          overflow: hidden !important;
        }
      `}</style>
      {/* IMAGEN DE PERSONA ALEATORIA (SOLO PC) */}
<div className="hidden lg:block absolute right-0 bottom-0 z-10 w-[45vw] h-[85vh] pointer-events-none">
  <RandomPerson />
</div>
    </div>
  );
}