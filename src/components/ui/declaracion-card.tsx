"use client";

import { useState } from "react";
import { DeclaracionData } from "@/app/declaracion-jurada/declaracion-jurada.interface";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "./badge";
import { Button } from "./button";
import { LucideTrash, FileText } from "lucide-react";
import { deleteDeclaracion } from "@/app/declaracion-jurada/declaracion-jurada.api";
import { revalidate } from "@/lib/actions";
import { toast } from "sonner";
import Link from "next/link";
import ModalPDF from "./modalPDF";

export function DeclaracionCard({ declaracion }: { declaracion: DeclaracionData }) {
    const [openPdf, setOpenPdf] = useState(false);

    // elimina
    const handleDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
        try {
            event.preventDefault();
            await deleteDeclaracion(declaracion._id);
            await revalidate("/declaracion-jurada");
            toast.success('Declaración Jurada eliminada con éxito');
        } catch (error) {
            console.log("Error al eliminar la Declaración Jurada:", error);
        }
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        Datos Personales
                        <div className="flex gap-2">
                            {/* Botón eliminar */}
                            <Button onClick={handleDelete} size="sm" variant="ghost">
                                <LucideTrash />
                            </Button>
                            {/* Botón PDF */}
                            <Button onClick={() => setOpenPdf(true)} size="sm" variant="outline">
                                <FileText />
                            </Button>
                            {/* Botón Editar */}
                            <Link href={`/declaracion-jurada/${declaracion._id}/edit`} passHref>
                                <Button size="sm" variant="secondary">Editar</Button>
                            </Link>
                        </div>
                    </CardTitle>
                    <CardDescription>Descripción de la Persona</CardDescription>
                </CardHeader>

                <CardContent>
                    <p>{declaracion.datosPersonales?.nombres ?? ""}{" "}{declaracion.datosPersonales?.paterno ?? ""}{" "}{declaracion.datosPersonales?.materno ?? ""}</p>
                    <p>{declaracion.datosPersonales?.documentoIdentidad?.numero ?? ""}</p>
                    <p>{declaracion.datosPersonales?.documentoIdentidad?.expedido ?? ""}</p>
                    <p>{declaracion.datosPersonales?.direccion?.zona ?? ""}</p>
                    <p>{declaracion.datosPersonales?.direccion?.urbanizacion ?? ""}</p>
                    <p>{declaracion.datosPersonales?.direccion?.avenida ?? ""}</p>
                    <p>{declaracion.datosPersonales?.direccion?.calle ?? ""}</p>
                    <p>{declaracion.datosPersonales?.direccion?.numeroDomicilio ?? ""}</p>
                    <p>{declaracion.datosPersonales?.telefonoDomicilio ?? ""}</p>
                    <p>{declaracion.datosPersonales?.celular ?? ""}</p>
                    <p>{declaracion.datosPersonales?.correoElectronico ?? ""}</p>
                    <p>Casada: <Badge>{declaracion.datosPersonales?.apellidoCasada ?? "N/A"}</Badge></p>
                </CardContent>

                <CardFooter>
                    <p className="text-sm text-muted-foreground">Usuario:</p>
                </CardFooter>
            </Card>

            {/* Modal PDF */}
            <ModalPDF
                open={openPdf}
                onClose={() => setOpenPdf(false)}
                pdfUrl={`${process.env.NEXT_PUBLIC_API_URL}/declaracion-jurada/reporte/${declaracion._id}`}
            />
        </>
    );
};
