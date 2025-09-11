"use client";
import { Inputs } from "@/app/declaracion-jurada/declaracion-jurada.interface";
import { Control, Controller, FieldArrayWithId } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Plus, Trash2 } from "lucide-react";
import React from "react";

interface OtraInfoProps {
    control: Control<Inputs>;
    otraInfoFields: FieldArrayWithId<Inputs, "otraInformacion", "id">[];
    appendOtra: (value: any) => void;
    removeOtra: (index: number) => void;
}

interface OtraInfoItemProps {
    control: Control<Inputs>;
    index: number;
    removeOtra: (index: number) => void;
}

const OtraInfoItem: React.FC<OtraInfoItemProps> = ({ control, index, removeOtra }) => {
    return (
        <Card className="mb-4 bg-gray-50 dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
            <CardHeader className="flex justify-between items-center">
                <CardTitle className="text-base sm:text-lg font-semibold">
                    6.{index + 1} Otra Información
                </CardTitle>
            </CardHeader>

            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Descripción */}
                <div className="flex flex-col gap-1 col-span-1 sm:col-span-2">
                    <label className="text-sm font-medium">Descripción</label>
                    <Controller
                        name={`otraInformacion.${index}.descripcionAdecuacion`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <Textarea {...field} placeholder="Descripción" className="w-full" />
                        )}
                    />
                </div>

                {/* Institución */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Institución</label>
                    <Controller
                        name={`otraInformacion.${index}.institucion`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => <Input {...field} placeholder="Institución" className="w-full" />}
                    />
                </div>

                {/* Documento */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Documento</label>
                    <Controller
                        name={`otraInformacion.${index}.documentoRespaldo`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => <Input {...field} placeholder="Documento" className="w-full" />}
                    />
                </div>

                {/* Monto Descuento */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Monto Descuento</label>
                    <Controller
                        name={`otraInformacion.${index}.montoDescuento`}
                        control={control}
                        defaultValue={0}
                        render={({ field }) => (
                            <Input
                                type="number"
                                {...field}
                                value={field.value ?? 0}
                                onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                                placeholder="Monto Descuento"
                                className="w-full"
                            />
                        )}
                    />
                </div>
            </CardContent>

            {/* Botón eliminar */}
            <CardContent className="flex justify-end pt-0">
                <Button variant="destructive" size="sm" onClick={() => removeOtra(index)} className="flex items-center gap-1">
                    <Trash2 className="w-4 h-4" /> Eliminar
                </Button>
            </CardContent>
        </Card>
    );
};

export const OtraInformacionCard: React.FC<OtraInfoProps> = ({ control, otraInfoFields, appendOtra, removeOtra }) => {
    return (
        <Card className="border rounded-xl bg-gray-50 dark:bg-gray-800 shadow-md">
            <CardHeader>
                <CardTitle>VI. Otra Información</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {otraInfoFields.map((field, index) => (
                    <OtraInfoItem key={field.id} control={control} index={index} removeOtra={removeOtra} />
                ))}

                <Button
                    type="button"
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2 border-blue-500 text-blue-500 hover:bg-blue-500/10 font-semibold transition-colors"
                    onClick={() =>
                        appendOtra({
                            descripcionAdecuacion: "",
                            institucion: "",
                            documentoRespaldo: "",
                            montoDescuento: 0,
                        })
                    }
                >
                    <Plus className="w-4 h-4" /> Añadir otra información
                </Button>
            </CardContent>
        </Card>
    );
};
