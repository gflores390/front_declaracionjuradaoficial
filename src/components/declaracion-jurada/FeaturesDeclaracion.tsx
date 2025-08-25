// src/components/declaracion-jurada/FeaturesDeclaracion.tsx
import { Check } from "lucide-react";

const features = [
    { title: "Control de Asistencia", description: "Registra automáticamente la asistencia de cada trabajador." },
    { title: "Evaluación de Desempeño", description: "Genera reportes y feedback basado en progreso real." },
    { title: "Gestión de Documentos", description: "Sube PDFs y fotos, todo centralizado y seguro." },
];

export default function FeaturesDeclaracion() {
    return (
        <section className="py-24 bg-gray-50 dark:bg-gray-800 text-center">
            <h2 className="text-3xl font-bold mb-12 text-gray-900 dark:text-white">Funciones del Sistema</h2>
            <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-4">
                {features.map((feature) => (
                    <div key={feature.title} className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow hover:shadow-lg transition">
                        <Check className="mx-auto mb-4 w-8 h-8 text-blue-600" />
                        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
                        <p className="text-gray-700 dark:text-gray-300">{feature.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
