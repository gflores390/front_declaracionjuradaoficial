"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { CheckCircle, AlertCircle, Phone } from "lucide-react"
import { motion } from "framer-motion"

export function InfoCards() {
    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    }

    return (
        <section className="grid gap-6 md:grid-cols-2">
            {/* Primera Card */}
            <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <Card className="shadow-lg rounded-2xl border border-gray-200 dark:border-gray-800 transition-all duration-300 hover:border-blue-500 dark:hover:border-blue-400">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                            Instrucciones de llenado
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-gray-700 dark:text-gray-300 space-y-4 text-sm leading-relaxed">
                        <p className="flex items-start gap-2">
                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0" />
                            <span>Los datos a ingresar deben ser como están en su <span className="font-medium">cédula de identidad</span>.</span>
                        </p>
                        <p className="flex items-start gap-2">
                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0" />
                            <span>Los campos con <span className="text-red-600 dark:text-red-400 font-bold">*</span> son obligatorios.</span>
                        </p>
                        <p className="flex items-start gap-2">
                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0" />
                            <span>El o los campos que no llene, <span className="italic">dejarlos vacíos</span>.</span>
                        </p>
                        <p className="flex items-start gap-2">
                            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 shrink-0" />
                            <span>Por favor leer el <span className="font-medium">instructivo número 2</span> antes de llenar el formulario.</span>
                        </p>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Segunda Card */}
            <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <Card className="shadow-lg rounded-2xl border border-gray-200 dark:border-gray-800 transition-all duration-300 hover:border-blue-500 dark:hover:border-blue-400">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                            Nota
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-gray-700 dark:text-gray-300 space-y-4 text-sm leading-relaxed">
                        <p className="flex items-start gap-2">
                            <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0" />
                            <span><span className="font-medium">Nota</span>: En caso de <span className="font-medium">problemas técnicos</span>, por favor pasar a oficinas de <span className="font-bold">PSG</span>.</span>
                        </p>
                        <p className="flex items-start gap-2">
                            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 shrink-0" />
                            <span>
                                <span className="font-medium">Importante:</span> La impresión del formulario se realizara en <span className="font-bold">tamaño oficio</span> para asegurar su correcta presentación.
                            </span>
                        </p>

                    </CardContent>
                </Card>
            </motion.div>
        </section>
    )
}
