"use client";
import { LucidePlusCircle, MoreHorizontal, Pencil, Trash, Loader2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { toast } from "sonner";
import { DeclaracionData } from "@/app/declaracion-jurada/declaracion-jurada.interface";
import { useState } from "react";
import { deleteDeclaracion } from "@/app/declaracion-jurada/declaracion-jurada.api";
import { revalidate } from "@/lib/actions";
import Link from "next/link";

export function DeclaracionTable({ declaracion }: { declaracion: DeclaracionData[] }) {
    const [loadingButtons, setLoadingButtons] = useState<{ [key: string]: boolean }>({});

    const handleDelete = async (_id: string) => {
        setLoadingButtons((prev) => ({ ...prev, [`delete-${_id}`]: true }));
        try {
            await deleteDeclaracion(_id);
            await revalidate("/declaracion-jurada");
            toast.success('Declaración Jurada eliminada con éxito');
        } catch (error) {
            console.error("Error al eliminar la Declaración Jurada:", error);
            toast.error('Error al eliminar la Declaración Jurada');
        } finally {
            setLoadingButtons((prev) => ({ ...prev, [`delete-${_id}`]: false }));
        }
    };

    return (
        <div className="max-w-screen-lg mx-auto p-8">
            {/* Header */}
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Declaración Jurada</h1>
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
                                Declarar <LucidePlusCircle className="ml-2 h-5 w-5" />
                            </>
                        )}
                    </Link>
                </Button>
            </header>

            {/* Tabla */}
            <div className="overflow-hidden rounded-lg border bg-white shadow-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead><Checkbox /></TableHead>
                            <TableHead>Nombres</TableHead>
                            <TableHead>CI</TableHead>
                            <TableHead>Número</TableHead>
                            <TableHead>Correo</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {declaracion.map((item) => (
                            <TableRow key={item._id} className="hover:bg-gray-50">
                                <TableCell><Checkbox /></TableCell>
                                <TableCell>{item.datosPersonales.nombres} {item.datosPersonales.paterno} {item.datosPersonales.materno}</TableCell>
                                <TableCell>{item.datosPersonales.documentoIdentidad.numero}</TableCell>
                                <TableCell>{item.datosPersonales.celular}</TableCell>
                                <TableCell>{item.datosPersonales.correoElectronico}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Abrir menú</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>

                                            {/* Editar */}
                                            <DropdownMenuItem className="flex items-center gap-2 w-full">
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

                                            <DropdownMenuSeparator />

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
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
