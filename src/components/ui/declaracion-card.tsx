"use client";
import { DeclaracionData } from "@/app/declaracion-jurada/declaracion-jurada.interface";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "./badge";
import { Button } from "./button";
import { LucideTrash } from "lucide-react";
import { deleteDeclaracion } from "@/app/declaracion-jurada/declaracion-jurada.api";
import { revalidate } from "@/lib/actions";
import { toast } from "sonner"
import Link from "next/link";


export function DeclaracionCard({ declaracion }: { declaracion: DeclaracionData }) {

    // elimina
    const handleDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
        try {
            event.preventDefault();
            await deleteDeclaracion(declaracion._id);
            await revalidate("/declaracion-jurada");
            toast.success('Declaracion Jurada eliminada con éxito');
        } catch (error) {
            console.log("Error al eliminar la Declaracion Jurada:", error);
        }
    }

    return (
        <Link href={`/declaracion-jurada/${declaracion._id}/edit`}>
            < Card >
                <CardHeader>
                    <CardTitle className=" flex justify-between items-center">Datos Personales
                        <Button onClick={(event) => handleDelete(event)} size="sm" variant="ghost"> <LucideTrash /></Button>
                    </CardTitle>
                    <CardDescription>Descripcion de la Persona</CardDescription>
                    {/* <CardAction>{fechaFormulario}</CardAction> */}
                </CardHeader>
                <CardContent>
                    <p>
                        {declaracion.datosPersonales?.nombres ?? ""}{" "}
                        {declaracion.datosPersonales?.paterno ?? ""}{" "}
                        {declaracion.datosPersonales?.materno ?? ""}
                    </p>
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
                    <p>
                        Casada: <Badge>{declaracion.datosPersonales?.apellidoCasada ?? "N/A"}</Badge>
                    </p>
                </CardContent>
                <CardFooter>
                    <p className="text-sm text-muted-foreground">Usuario:</p>
                </CardFooter>
            </Card >
        </Link >
    );
};