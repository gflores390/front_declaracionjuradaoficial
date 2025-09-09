// src/components/declaracion-jurada/DeclaracionPrincipal.tsx
"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import OtpComponent from "./otp-ci-whats";
import { motion } from "framer-motion";

export default function DeclaracionPrincipal() {
    return (
        <section className="relative py-24 px-6">

            {/* Glow sutil */}
            <div className="absolute top-0 left-1/2 w-[300px] h-[300px] bg-blue-200 rounded-full filter blur-3xl opacity-5 -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>

            {/* Título principal */}
            <motion.h1
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 text-center mb-12"
                style={{ fontFamily: "'Playfair Display', serif" }}
            >
                UNIVERSIDAD PÚBLICA DE EL ALTO
            </motion.h1>

            {/* Layout dos columnas */}
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">

                {/* Logo con giro sutil en X */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, rotateX: [0, 8, 0] }}
                    transition={{
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: 6,
                        ease: "easeInOut",
                    }}
                    className="w-full md:w-1/2 flex justify-center items-center"
                >
                    <Image
                        src="/images/logo-upea.png"
                        alt="UPEA Posgrado"
                        width={250}
                        height={250}
                        className="rounded-full shadow-lg"
                    />
                </motion.div>

                {/* Contenido textual */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="w-full md:w-1/2 flex flex-col justify-center text-center md:text-left space-y-6"
                >
                    <p className="text-base md:text-lg lg:text-xl font-serif text-gray-900 dark:text-gray-100 leading-relaxed tracking-wide text-justify my-4">
                        <span className="block text-center text-orange-600 dark:text-orange-500 font-bold uppercase text-lg md:text-xl lg:text-2xl mb-2">
                            FORMULARIO DE DECLARACIÓN JURADA
                        </span>
                        presentada ante la UPEA - El Alto, La Paz, Bolivia, mediante la cual el/la suscrito/a, en su calidad de estudiante o cargo correspondiente, certifica la veracidad de la información proporcionada y se compromete a cumplir con las disposiciones institucionales vigentes.
                    </p>



                    {/* Componente OTP */}
                    <div className="mt-4">
                        <OtpComponent />
                    </div>
                </motion.div>
            </div>

            {/* Cards informativos */}
            <div className="max-w-5xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                {[

                    {
                        title: "¿Qué es la Declaración Jurada?",
                        description: "Es un documento legal mediante el cual docentes o personal académico certifican la veracidad de información relacionada con su desempeño, asistencia, entrega de documentos, cumplimiento de responsabilidades y otras obligaciones institucionales."
                    },
                    {
                        title: "Importancia",
                        description: "Asegura la transparencia y responsabilidad administrativa, facilita auditorías y controles internos, y sirve como respaldo legal ante cualquier verificación de cumplimiento de deberes dentro de instituciones públicas o privadas."
                    },
                    {
                        title: "Beneficios",
                        description: "Permite un registro formal y confiable de acciones y compromisos del personal, simplifica la supervisión de asistencia y desempeño, y contribuye a mantener altos estándares de integridad y profesionalismo en la gestión educativa."
                    }


                ].map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.8 + index * 0.3 }}
                    >
                        <Card className="shadow-md hover:shadow-lg transition-shadow duration-500">
                            <CardHeader>
                                <CardTitle className="text-lg md:text-xl">{item.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-gray-700 dark:text-gray-300">{item.description}</CardDescription>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
