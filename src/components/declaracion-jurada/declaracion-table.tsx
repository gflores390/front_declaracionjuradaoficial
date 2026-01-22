"use client";
import { useState } from "react";
import { LucidePlusCircle, MoreHorizontal, Pencil, Trash, Loader2, FileText } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { toast } from "sonner";
import { DeclaracionData } from "@/app/declaracion-jurada/declaracion-jurada.interface";
import { deleteDeclaracion } from "@/app/declaracion-jurada/declaracion-jurada.api";
import { revalidate } from "@/lib/actions";
import Link from "next/link";
import ModalPDF from "./modal-pdf";

export function DeclaracionTable({ declaracion }: { declaracion: DeclaracionData[] }) {
    const [loadingButtons, setLoadingButtons] = useState<{ [key: string]: boolean }>({});
    const [openPdf, setOpenPdf] = useState<{ open: boolean; pdfUrl: string }>({ open: false, pdfUrl: "" });

    const handleDelete = async (_id: string) => {
        setLoadingButtons((prev) => ({ ...prev, [`delete-${_id}`]: true }));
        try {
            await deleteDeclaracion(_id);
            await revalidate("/declaracion-jurada");
            toast.success("Declaración Jurada eliminada con éxito");
        } catch (error) {
            console.error("Error al eliminar la Declaración Jurada:", error);
            toast.error("Error al eliminar la Declaración Jurada");
        } finally {
            setLoadingButtons((prev) => ({ ...prev, [`delete-${_id}`]: false }));
        }
    };

    const handleOpenPdf = (id: string) => {
        setOpenPdf({ open: true, pdfUrl: `${process.env.NEXT_PUBLIC_API_URL}/declaracion-jurada/reporte/${id}` });
    };

    return (
        <div className="max-w-screen-lg mx-auto p-8">
            {/* Header */}
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold dark:text-white">Declaración Jurada</h1>
                <Button asChild disabled={loadingButtons["create"]}>
                    <Link
                        href="/declaracion-jurada/nueva"
                        className="flex items-center"
                        onClick={() => setLoadingButtons((prev) => ({ ...prev, create: true }))}
                    >
                        {loadingButtons["create"] ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin mr-2" /> Cargando...
                            </>
                        ) : (
                            <>
                                Decasdfsalarar <LucidePlusCircle className="ml-2 h-5 w-5" />
                            </>
                        )}
                    </Link>
                </Button>
            </header>

            {/* Tabla */}
            <div className="overflow-hidden rounded-lg border bg-white dark:bg-gray-900 dark:border-gray-700 shadow-md">
                <Table>
                    <TableHeader className="dark:text-white">
                        <TableRow>
                            <TableHead><Checkbox /></TableHead>
                            <TableHead>Nombres</TableHead>
                            <TableHead>CI</TableHead>
                            <TableHead>Número</TableHead>
                            <TableHead>Correo</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {declaracion.map((item) => {
                            // ✅ PROTECCIÓN CONTRA DATOS NULOS
                            const dp = item.datosPersonales;
                            
                            // Si no hay datos personales, mostrar fila de error
                            if (!dp) {
                                return (
                                    <TableRow key={item._id} className="bg-red-50 dark:bg-red-900/20">
                                        <TableCell><Checkbox disabled /></TableCell>
                                        <TableCell colSpan={5} className="text-red-600 dark:text-red-400">
                                            ⚠️ Registro corrupto - Sin datos personales
                                        </TableCell>
                                    </TableRow>
                                );
                            }
                            
                            // ✅ Fila normal con datos completos
                            return (
                                <TableRow key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                    <TableCell><Checkbox /></TableCell>
                                    <TableCell className="dark:text-white">
                                        {dp.nombres} {dp.paterno} {dp.materno}
                                    </TableCell>
                                    <TableCell className="dark:text-white">
                                        {dp.documentoIdentidad?.numero || 'N/A'}
                                    </TableCell>
                                    <TableCell className="dark:text-white">
                                        {dp.celular || 'N/A'}
                                    </TableCell>
                                    <TableCell className="dark:text-white">
                                        {dp.correoElectronico || 'N/A'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Abrir menú</span>
                                                    <MoreHorizontal className="h-4 w-4 dark:text-white" />
                                                </Button>
                                            </DropdownMenuTrigger>

                                            <DropdownMenuContent align="end" className="dark:bg-gray-800 dark:text-white">
                                                <DropdownMenuLabel>Acciones</DropdownMenuLabel>

                                                {/* PDF */}
                                                <DropdownMenuItem
                                                    className="flex items-center gap-2 w-full dark:text-white"
                                                    onClick={() => handleOpenPdf(item._id)}
                                                >
                                                    <FileText className="h-4 w-4" /> PDF
                                                </DropdownMenuItem>

                                                {/* Editar */}
                                                <DropdownMenuItem className="flex items-center gap-2 w-full dark:text-white">
                                                    <Link
                                                        href={`/declaracion-jurada/${item._id}/edit`}
                                                        className="flex items-center gap-2 w-full"
                                                        onClick={() => setLoadingButtons((prev) => ({ ...prev, [`edit-${item._id}`]: true }))}
                                                    >
                                                        {loadingButtons[`edit-${item._id}`] && <Loader2 className="h-4 w-4 animate-spin" />}
                                                        <Pencil className="h-4 w-4" />
                                                        {loadingButtons[`edit-${item._id}`] ? "Cargando..." : "Editar"}
                                                    </Link>
                                                </DropdownMenuItem>

                                                <DropdownMenuSeparator className="dark:border-gray-600" />

                                                {/* Eliminar */}
                                                <DropdownMenuItem
                                                    className="text-red-600 flex items-center gap-2"
                                                    onClick={() => handleDelete(item._id)}
                                                >
                                                    {loadingButtons[`delete-${item._id}`] ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <Trash className="h-4 w-4" />
                                                    )}
                                                    Eliminar
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            {/* Modal PDF */}
            <ModalPDF
                open={openPdf.open}
                onClose={() => setOpenPdf({ open: false, pdfUrl: "" })}
                pdfUrl={openPdf.pdfUrl}
            />
        </div>
    );
}