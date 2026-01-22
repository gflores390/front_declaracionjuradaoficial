"use client";

import React from "react";
import { motion } from "framer-motion";
import { Scale, BookOpen, AlertTriangle, CheckCircle2, Info, Gavel, Clock, FileText, Users } from "lucide-react";
import Image from "next/image";

export const SeccionesInformativas = () => {
  return (
    <div className="relative w-full bg-[#EEF1FA]">
      {/* Decoración de líneas verticales a la derecha */}
      <div className="hidden lg:block absolute right-0 top-0 h-full w-1 pointer-events-none z-[5]">
        <div className="absolute right-12 top-0 h-full w-px bg-gradient-to-b from-blue-400 via-yellow-300 to-blue-400 opacity-20"></div>
        <div className="absolute right-24 top-20 h-full w-px bg-gradient-to-b from-transparent via-blue-300 to-transparent opacity-15"></div>
      </div>

      {/* Decoración de cuadrados flotantes a la derecha */}
      <motion.div
        className="absolute right-8 top-20 pointer-events-none hidden lg:flex flex-col gap-6 z-[5]"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <div className="w-20 h-20 rounded-lg bg-blue-500 opacity-10 rotate-12"></div>
        <div className="w-16 h-16 rounded-full bg-yellow-400 opacity-12"></div>
        <div className="w-24 h-24 rounded-lg bg-blue-600 opacity-8 -rotate-6"></div>
      </motion.div>

      <motion.div
        className="absolute right-8 top-[600px] pointer-events-none hidden lg:flex flex-col gap-6 z-[5]"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
      >
        <div className="w-16 h-16 rounded-lg bg-yellow-500 opacity-10 -rotate-12"></div>
        <div className="w-20 h-20 rounded-full bg-blue-400 opacity-12"></div>
        <div className="w-18 h-18 rounded-lg bg-yellow-600 opacity-8 rotate-6"></div>
      </motion.div>

      <motion.div
        className="absolute right-8 top-[1200px] pointer-events-none hidden lg:flex flex-col gap-6 z-[5]"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 4.5, repeat: Infinity }}
      >
        <div className="w-24 h-24 rounded-lg bg-blue-500 opacity-10 rotate-45"></div>
        <div className="w-16 h-16 rounded-full bg-yellow-400 opacity-12"></div>
        <div className="w-20 h-20 rounded-lg bg-blue-600 opacity-8 -rotate-12"></div>
      </motion.div>

      <motion.div
        className="absolute right-8 bottom-[400px] pointer-events-none hidden lg:flex flex-col gap-6 z-[5]"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <div className="w-18 h-18 rounded-lg bg-yellow-500 opacity-10 rotate-12"></div>
        <div className="w-20 h-20 rounded-full bg-blue-400 opacity-12"></div>
      </motion.div>

      {/* Contenedor principal con fondo */}
      <div 
        className="w-full min-h-screen py-20 px-6 sm:px-12 lg:px-20 relative"
        style={{
          background: "linear-gradient(135deg, #F5F9FF 0%, #F5F9FF 50%, #F5F9FF 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* TÍTULO PRINCIPAL DE LA SECCIÓN */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-24"
          >
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-blue-900 mb-6 leading-tight">
              Guía de <span className="text-yellow-500">Declaración Jurada</span>
            </h2>
            <p className="text-slate-700 text-xl md:text-2xl max-w-4xl mx-auto font-medium">
              Información esencial para completar su declaración jurada en la UPEA
            </p>
            <div className="w-32 h-1.5 bg-gradient-to-r from-blue-600 to-yellow-500 mx-auto mt-8 rounded-full"></div>
          </motion.div>

          {/* SECCIÓN 1: ¿QUÉ ES UNA DECLARACIÓN JURADA? */}
          <motion.section
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-32"
          >
            {/* Título de sección */}
            <div className="flex items-center gap-6 mb-12">
              <div className="flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-xl">
                <Scale className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-4xl md:text-5xl font-black text-blue-900">
                  ¿Qué es una Declaración Jurada?
                </h3>
                <p className="text-yellow-600 font-bold text-lg uppercase tracking-wide mt-2">
                  Marco Legal y Obligatoriedad
                </p>
              </div>
            </div>

            {/* Contenido en columnas de izquierda a derecha */}
            <div className="space-y-12">
              {/* Definición principal */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <p className="text-2xl md:text-3xl text-blue-900 leading-relaxed font-semibold">
                  Es una <span className="font-black text-yellow-600">manifestación oficial bajo juramento</span> donde el declarante certifica la veracidad de la información proporcionada.
                </p>
                <p className="text-xl text-slate-700 mt-6 leading-relaxed">
                  Cualquier dato falso, incompleto u omitido genera <span className="font-bold text-blue-900">responsabilidad legal</span>.
                </p>
              </motion.div>

              {/* Dos columnas: Respaldo Legal y Cuándo Presentar */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Columna Izquierda: Respaldo Legal */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="flex items-center gap-4 mb-8">
                    <Gavel className="w-10 h-10 text-yellow-600" />
                    <h4 className="text-3xl font-black text-blue-900 uppercase">Respaldo Legal</h4>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <CheckCircle2 className="w-8 h-8 text-green-600 shrink-0 mt-1" />
                      <div>
                        <p className="text-xl font-bold text-blue-900">Ley 1178 (SAFCO)</p>
                        <p className="text-base text-slate-600 mt-1">Sistema de Administración y Control Gubernamental</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <CheckCircle2 className="w-8 h-8 text-green-600 shrink-0 mt-1" />
                      <div>
                        <p className="text-xl font-bold text-blue-900">Código Penal Art. 200/203</p>
                        <p className="text-base text-slate-600 mt-1">Falsedad ideológica y material</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <CheckCircle2 className="w-8 h-8 text-green-600 shrink-0 mt-1" />
                      <div>
                        <p className="text-xl font-bold text-blue-900">Reglamentos UPEA</p>
                        <p className="text-base text-slate-600 mt-1">Normativa institucional vigente</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Columna Derecha: Cuándo Presentar */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="flex items-center gap-4 mb-8">
                    <Clock className="w-10 h-10 text-blue-600" />
                    <h4 className="text-3xl font-black text-yellow-900 uppercase">¿Cuándo presentar?</h4>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-3">
                      <span className="text-3xl font-black text-yellow-600">•</span>
                      <div>
                        <p className="text-xl font-bold text-blue-900">Inicio de gestión académica</p>
                        <p className="text-base text-slate-600 mt-1">Al comenzar cada periodo lectivo</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="text-3xl font-black text-yellow-600">•</span>
                      <div>
                        <p className="text-xl font-bold text-blue-900">Cambios de ingresos u horarios</p>
                        <p className="text-base text-slate-600 mt-1">Actualización de información laboral</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="text-3xl font-black text-yellow-600">•</span>
                      <div>
                        <p className="text-xl font-bold text-blue-900">Convocatorias y designaciones</p>
                        <p className="text-base text-slate-600 mt-1">Nuevos nombramientos o contratos</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Advertencia */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex items-start gap-6 border-l-8 border-red-500 pl-6 py-4"
              >
                <AlertTriangle className="w-12 h-12 text-red-600 shrink-0" />
                <div>
                  <p className="text-2xl font-black text-red-600 uppercase mb-3">⚠️ Prohibiciones Importantes</p>
                  <p className="text-lg text-slate-700 leading-relaxed">
                    Está <span className="font-bold text-red-600">estrictamente prohibido</span> registrar montos aproximados o datos de periodos futuros. 
                    Toda la información debe ser <span className="font-bold text-blue-900">exacta, verificable y corresponder al periodo actual</span>.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.section>

          {/* SECCIÓN 2: INSTRUCTIVO DE LLENADO */}
          <motion.section
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-32"
          >
            {/* Título de sección */}
            <div className="flex items-center gap-6 mb-12">
              <div className="flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-xl">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-4xl md:text-5xl font-black text-blue-900">
                  Instructivo de Llenado
                </h3>
                <p className="text-blue-600 font-bold text-lg uppercase tracking-wide mt-2">
                  Guía paso a paso para personal UPEA
                </p>
              </div>
            </div>

            {/* Contenido en columnas de izquierda a derecha */}
            <div className="space-y-12">
              {/* Objetivo del formulario */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <p className="text-2xl md:text-3xl text-blue-900 leading-relaxed font-semibold">
                  Este formulario permite verificar <span className="font-black text-blue-600">actividades laborales, ingresos del sector público</span> y condición de jubilación.
                </p>
                <p className="text-xl text-slate-700 mt-6 leading-relaxed">
                  Se utiliza para realizar adecuaciones salariales conforme a la normativa vigente.
                </p>
              </motion.div>

              {/* Dos columnas: Carga Horaria y Categorías */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Columna Izquierda: Carga Horaria */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <Clock className="w-10 h-10 text-blue-600" />
                    <h4 className="text-3xl font-black text-blue-900 uppercase">Carga Horaria</h4>
                  </div>
                  <p className="text-lg text-slate-700 leading-relaxed">
                    Registre todas las horas de clase presenciales, planificación académica, prácticas de laboratorio, 
                    trabajo de investigación y cualquier otra actividad académica asignada.
                  </p>
                </motion.div>

                {/* Columna Derecha: Categorías */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <Users className="w-10 h-10 text-indigo-600" />
                    <h4 className="text-3xl font-black text-indigo-900 uppercase">Categorías</h4>
                  </div>
                  <p className="text-lg text-slate-700 leading-relaxed">
                    <span className="font-bold text-blue-900">Docentes Ordinarios:</span> Titulares con designación permanente.
                  </p>
                  <p className="text-lg text-slate-700 leading-relaxed mt-3">
                    <span className="font-bold text-blue-900">Docentes Extraordinarios:</span> Invitados o interinos.
                  </p>
                </motion.div>
              </div>

              {/* Bloques de Registro */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="flex items-center gap-4 mb-10">
                  <FileText className="w-10 h-10 text-yellow-600" />
                  <h4 className="text-3xl font-black text-yellow-900 uppercase">
                    Bloques de Registro Obligatorios
                  </h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex items-start gap-5 border-l-8 border-yellow-500 pl-5">
                    <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-yellow-500 text-white font-black text-2xl shrink-0">1</div>
                    <div>
                      <p className="font-black text-2xl text-slate-900 mb-2">Datos Personales</p>
                      <p className="text-base text-slate-600">Información básica, contacto y documentación</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5 border-l-8 border-blue-500 pl-5">
                    <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-500 text-white font-black text-2xl shrink-0">2</div>
                    <div>
                      <p className="font-black text-2xl text-slate-900 mb-2">Actividad UPEA</p>
                      <p className="text-base text-slate-600">Carga horaria, funciones y designación</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5 border-l-8 border-indigo-500 pl-5">
                    <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-500 text-white font-black text-2xl shrink-0">3</div>
                    <div>
                      <p className="font-black text-2xl text-slate-900 mb-2">Otras Instituciones</p>
                      <p className="text-base text-slate-600">Empleos adicionales en el sector público</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5 border-l-8 border-purple-500 pl-5">
                    <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-purple-500 text-white font-black text-2xl shrink-0">4</div>
                    <div>
                      <p className="font-black text-2xl text-slate-900 mb-2">Profesionales Jubilados</p>
                      <p className="text-base text-slate-600">Completar solo si corresponde</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Nota importante */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex items-start gap-6 border-l-8 border-blue-500 pl-6 py-4"
              >
                <Info className="w-10 h-10 text-blue-600 shrink-0" />
                <div>
                  <p className="text-xl font-black text-blue-900 uppercase mb-2">Nota Importante</p>
                  <p className="text-lg text-slate-700 leading-relaxed">
                    Las autoridades con dedicación exclusiva tienen limitaciones específicas para ejercer otras actividades 
                    remuneradas en el sector público conforme a la normativa vigente.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.section>

        </div>
        
        {/* FOOTER - Imagen sobre el fondo con parte del gradiente visible */}
        {/* <div className="relative w-full -mb-20 pb-20">
          <div className="relative w-full h-auto">
            <Image
              src="/images/foter.png"
              alt="Footer UPEA"
              width={1920}
              height={400}
              className="w-full h-auto object-cover object-top"
              priority
            />
          </div>
        </div> */}
      </div>
    </div>
  );
};