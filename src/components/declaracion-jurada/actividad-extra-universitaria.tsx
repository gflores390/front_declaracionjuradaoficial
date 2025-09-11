"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Controller, Control, FieldArrayWithId } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import React from "react";
import { Inputs } from "@/app/declaracion-jurada/declaracion-jurada.interface";

// Opciones base para este formulario
const actividadExtraJson = {
    tipo: ["PÚBLICA", "PRIVADA"],
};

// Orden por día de la semana
const diasOrden: Record<string, number> = {
    LUNES: 1,
    MARTES: 2,
    MIERCOLES: 3,
    JUEVES: 4,
    VIERNES: 5,
    SABADO: 6,
    DOMINGO: 7
};

interface ActividadExtraProps {
    control: Control<Inputs>;
    extraFields: FieldArrayWithId<Inputs, "actividadExtraUniversitaria", "id">[];
    appendExtra: (value: any) => void;
    removeExtra: (index: number) => void;
}

interface ActividadExtraItemProps {
    control: Control<Inputs>;
    index: number;
    removeExtra: (index: number) => void;
}

const ActividadExtraItem: React.FC<ActividadExtraItemProps> = ({ control, index, removeExtra }) => {
    return (
        <Card className="mb-4 bg-gray-50 dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
            <CardHeader className="flex justify-between items-center">
                <CardTitle className="text-base sm:text-lg font-semibold">
                    3.{index + 1} Actividad Extra Universitaria
                </CardTitle>
            </CardHeader>

            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Institución */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Institución</label>
                    <Controller
                        name={`actividadExtraUniversitaria.${index}.nombreInstitucion`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <Input {...field} placeholder="Nombre de la Institución" className="w-full" />
                        )}
                    />
                </div>

                {/* Cargo */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Nivel / Cargo Ocupacional</label>
                    <Controller
                        name={`actividadExtraUniversitaria.${index}.nivelCargoOcupacional`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <Input {...field} placeholder="Cargo Ocupacional" className="w-full" />
                        )}
                    />
                </div>

                {/* Tipo Pública/Privada */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Tipo</label>
                    <Controller
                        name={`actividadExtraUniversitaria.${index}.actividadPublicaPrivada`}
                        control={control}
                        render={({ field }) => (
                            <Select value={field.value || ""} onValueChange={field.onChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue>{field.value || "Selecciona Tipo"}</SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="NINGUNA">--Ninguna--</SelectItem>
                                    {actividadExtraJson.tipo.map((opt, i) => (
                                        <SelectItem key={i} value={opt}>{opt}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>

                {/* Días y Horarios */}
                <div className="flex flex-col gap-2 w-full col-span-1 sm:col-span-2 lg:col-span-3">
                    <label className="font-medium text-sm">Días y Horarios</label>
                    <Controller
                        name={`actividadExtraUniversitaria.${index}.horarios`}
                        control={control}
                        defaultValue={[]}
                        render={({ field }) => {
                            const horarios = field.value || [];

                            const handleChange = (hIndex: number, key: string, value: string) => {
                                const updated = [...horarios];
                                updated[hIndex] = {
                                    ...updated[hIndex],
                                    [key]: value,
                                    orden: key === "dia" ? diasOrden[value.toUpperCase()] || 0 : updated[hIndex].orden || 0
                                };
                                field.onChange(updated);
                            };

                            const handleAddDia = () => {
                                field.onChange([...horarios, { dia: "", inicio: "", fin: "", orden: 0 }]);
                            };

                            return (
                                <>
                                    {horarios.map((h, hIndex) => (
                                        <div key={hIndex} className="flex gap-2 items-center w-full flex-wrap">
                                            <Select
                                                value={h.dia || ""}
                                                onValueChange={(val) => handleChange(hIndex, "dia", val)}
                                            >
                                                <SelectTrigger className="w-28">
                                                    <SelectValue>{h.dia || "Selecciona Día"}</SelectValue>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Object.keys(diasOrden).map((opt) => (
                                                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>

                                            <Input
                                                type="time"
                                                value={h.inicio || ""}
                                                onChange={(e) => handleChange(hIndex, "inicio", e.target.value)}
                                                className="w-20"
                                            />

                                            <Input
                                                type="time"
                                                value={h.fin || ""}
                                                onChange={(e) => handleChange(hIndex, "fin", e.target.value)}
                                                className="w-20"
                                            />

                                            <div className="ml-auto flex gap-2">
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => {
                                                        const updated = [...horarios];
                                                        updated.splice(hIndex, 1);
                                                        field.onChange(updated);
                                                    }}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>

                                                {hIndex === horarios.length - 1 && (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        className="flex items-center gap-1 text-blue-500 border-blue-500 hover:bg-blue-500/10"
                                                        onClick={handleAddDia}
                                                    >
                                                        <Plus className="w-4 h-4" /> Añadir Día
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {horarios.length === 0 && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="flex items-center gap-1 text-blue-500 border-blue-500 hover:bg-blue-500/10 mt-2"
                                            onClick={handleAddDia}
                                        >
                                            <Plus className="w-4 h-4" /> Añadir Día
                                        </Button>
                                    )}
                                </>
                            );
                        }}
                    />
                </div>

                {/* Carga Horaria */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Carga Horaria</label>
                    <Controller
                        name={`actividadExtraUniversitaria.${index}.cargaHoraria`}
                        control={control}
                        defaultValue={0}
                        render={({ field }) => (
                            <Input
                                type="number"
                                {...field}
                                value={field.value ?? 0}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    field.onChange(val === "" ? 0 : Number(val));
                                }}
                                placeholder="Ej: 20"
                                className="w-full"
                            />
                        )}
                    />

                </div>

                {/* Total Ganado */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Total Ganado Bs</label>
                    <Controller
                        name={`actividadExtraUniversitaria.${index}.totalGanado`}
                        control={control}
                        defaultValue={0}
                        render={({ field }) => (
                            <Input
                                type="number"
                                value={field.value ?? 0}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    field.onChange(value === "" ? 0 : Number(value));
                                }}
                                placeholder="Total Ganado Bs"
                                className="w-full"
                            />
                        )}
                    />
                </div>
            </CardContent>

            {/* Botón eliminar */}
            <CardContent className="flex justify-end pt-0">
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeExtra(index)}
                    className="flex items-center gap-1"
                >
                    <Trash2 className="w-4 h-4" /> Eliminar
                </Button>
            </CardContent>
        </Card>
    );
};

export const ActividadExtraCard: React.FC<ActividadExtraProps> = ({ control, extraFields, appendExtra, removeExtra }) => {
    return (
        <Card className="border rounded-xl bg-gray-50 dark:bg-gray-800 shadow-md">
            <CardHeader>
                <CardTitle>III. Actividad Extra Universitaria</CardTitle>
                <CardDescription>Complete las actividades realizadas fuera de la UPEA</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {extraFields.map((field, index) => (
                    <ActividadExtraItem key={field.id} control={control} index={index} removeExtra={removeExtra} />
                ))}

                <Button
                    type="button"
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2 border-blue-500 text-blue-500 hover:bg-blue-500/10 font-semibold transition-colors"
                    onClick={() => appendExtra({ horarios: [], totalGanado: 0 })}
                >
                    <Plus className="w-4 h-4" /> Añadir Actividad Extra
                </Button>
            </CardContent>
        </Card>
    );
};
