"use client";
import { Inputs } from "@/app/declaracion-jurada/declaracion-jurada.interface";
import { Control, Controller, FieldArrayWithId } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Plus, Trash2 } from "lucide-react";
import React from "react";

interface JubiladoProps {
    control: Control<Inputs>;
    jubiladoFields: FieldArrayWithId<Inputs, "profesionalJubilado", "id">[];
    appendJubilado: (value: any) => void;
    removeJubilado: (index: number) => void;
}

interface JubiladoItemProps {
    control: Control<Inputs>;
    index: number;
    removeJubilado: (index: number) => void;
}

const JubiladoItem: React.FC<JubiladoItemProps> = ({ control, index, removeJubilado }) => {
    return (
        <Card className="mb-4 bg-gray-50 dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
            <CardHeader className="flex justify-between items-center">
                <CardTitle className="text-base sm:text-lg font-semibold">
                    5.{index + 1} Profesional Jubilado
                </CardTitle>
            </CardHeader>

            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Institución */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Institución</label>
                    <Controller
                        name={`profesionalJubilado.${index}.nombreInstitucion`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => <Input {...field} placeholder="Institución" className="w-full" />}
                    />
                </div>

                {/* Cargo */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Cargo</label>
                    <Controller
                        name={`profesionalJubilado.${index}.nivelCargo`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => <Input {...field} placeholder="Cargo" className="w-full" />}
                    />
                </div>

                {/* Fecha de Jubilación */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Fecha de Jubilación</label>
                    <Controller
                        name={`profesionalJubilado.${index}.fechaDeJubilacion`}
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="date"
                                {...field}
                                value={
                                    field.value
                                        ? typeof field.value === "string"
                                            ? field.value
                                            : field.value instanceof Date
                                                ? field.value.toISOString().substring(0, 10)
                                                : ""
                                        : ""
                                }
                                onChange={(e) => field.onChange(e.target.value)}
                                className="w-full"
                            />
                        )}
                    />
                </div>

                {/* Monto */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Monto Bs</label>
                    <Controller
                        name={`profesionalJubilado.${index}.montoTitular`}
                        control={control}
                        defaultValue={0}
                        render={({ field }) => (
                            <Input
                                type="number"
                                {...field}
                                value={field.value ?? 0}
                                onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                                placeholder="Monto Bs"
                                className="w-full"
                            />
                        )}
                    />
                </div>
            </CardContent>

            {/* Botón eliminar */}
            <CardContent className="flex justify-end pt-0">
                <Button variant="destructive" size="sm" onClick={() => removeJubilado(index)} className="flex items-center gap-1">
                    <Trash2 className="w-4 h-4" /> Eliminar
                </Button>
            </CardContent>
        </Card>
    );
};

export const ProfesionalJubiladoCard: React.FC<JubiladoProps> = ({ control, jubiladoFields, appendJubilado, removeJubilado }) => {
    return (
        <Card className="border rounded-xl bg-gray-50 dark:bg-gray-800 shadow-md">
            <CardHeader>
                <CardTitle>V. Profesional Jubilado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {jubiladoFields.map((field, index) => (
                    <JubiladoItem key={field.id} control={control} index={index} removeJubilado={removeJubilado} />
                ))}

                <Button
                    type="button"
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2 border-blue-500 text-blue-500 hover:bg-blue-500/10 font-semibold transition-colors"
                    onClick={() => appendJubilado({
                        nombreInstitucion: "",
                        nivelCargo: "",
                        fechaDeJubilacion: "",
                        montoTitular: 0
                    })}
                >
                    <Plus className="w-4 h-4" /> Añadir Jubilación
                </Button>
            </CardContent>
        </Card>
    );
};
