// src/components/declaracion-jurada/DeclaracionPrincipal.tsx
import { Button } from "@/components/ui/button";

export default function DeclaracionPrincipal() {
    return (
        <section className="bg-white dark:bg-gray-900 py-24 text-center">
            {/* Título principal */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Sistema de Declaración Jurada
            </h1>

            {/* Subtítulo */}
            <p className="text-gray-700 dark:text-gray-300 text-lg md:text-xl mb-8">
                Controla asistencias, documentos y feedback automáticamente
            </p>

            {/* Botón CTA */}
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg">
                Comenzar
            </Button>
        </section>
    );
}
