"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Controller, Control, FieldArrayWithId } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { actividadDocenteJson } from "@/app/declaracion-jurada/actividad-docente";
import React from "react";
import { Inputs } from "@/app/declaracion-jurada/declaracion-jurada.interface";

interface ActividadDocenteProps {
    control: Control<Inputs>;
    docenteFields: FieldArrayWithId<Inputs, "actividadDocente", "id">[];
    appendDocente: (value: any) => void;
    removeDocente: (index: number) => void;
}

interface ActividadItemProps {
    control: Control<Inputs>;
    index: number;
    removeDocente: (index: number) => void;
}

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

const ActividadItem: React.FC<ActividadItemProps> = ({ control, index, removeDocente }) => {
    return (
        <Card className="mb-4 bg-gray-50 dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
            <CardHeader className="flex justify-between items-center">
                <CardTitle className="text-base sm:text-lg font-semibold">
                    2.{index + 1} Actividad Docente
                </CardTitle>
            </CardHeader>

            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Dependencia */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Dependencia / Área</label>
                    <Controller
                        name={`actividadDocente.${index}.dependenciaDecanaturaArea`}
                        control={control}
                        render={({ field }) => (
                            <Select value={field.value || ""} onValueChange={field.onChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue>{field.value || "Selecciona Dependencia"}</SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="NINGUNA">--Ninguna--</SelectItem>
                                    {actividadDocenteJson.dependencia.map((opt, i) => (
                                        <SelectItem key={i} value={opt}>{opt}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>

                {/* Carrera */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Carrera / Instituto</label>
                    <Controller
                        name={`actividadDocente.${index}.carreraInstituto`}
                        control={control}
                        render={({ field }) => (
                            <Select value={field.value || ""} onValueChange={field.onChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue>{field.value || "Selecciona Carrera"}</SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="NINGUNA">--Ninguna--</SelectItem>
                                    {actividadDocenteJson.carrera.map((opt, i) => (
                                        <SelectItem key={i} value={opt}>{opt}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>

                {/* Materia / Cargo */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Materia / Cargo Administrativo</label>
                    <Controller
                        name={`actividadDocente.${index}.materiaSigla`}
                        control={control}
                        render={({ field }) => (
                            <Select value={field.value || ""} onValueChange={field.onChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue>{field.value || "Selecciona Materia"}</SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {actividadDocenteJson.materia.map((opt, i) => (
                                        <SelectItem key={i} value={opt}>{opt}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>

                {/* Categoría */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Categoría</label>
                    <Controller
                        name={`actividadDocente.${index}.categoriaDocente`}
                        control={control}
                        render={({ field }) => (
                            <Select value={field.value || ""} onValueChange={field.onChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue>{field.value || "Selecciona Categoría"}</SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {actividadDocenteJson.categoria.map((opt, i) => (
                                        <SelectItem key={i} value={opt}>{opt}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>

                {/* Cargo */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Cargo</label>
                    <Controller
                        name={`actividadDocente.${index}.cargo`}
                        control={control}
                        render={({ field }) => (
                            <Select value={field.value || ""} onValueChange={field.onChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue>{field.value || "Selecciona Cargo"}</SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {actividadDocenteJson.cargo.map((opt, i) => (
                                        <SelectItem key={i} value={opt}>{opt}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>

                {/* Carga Horaria */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Carga Horaria</label>
                    <Controller
                        name={`actividadDocente.${index}.cargaHoraria`}
                        control={control}
                        render={({ field }) => (
                            <Select
                                value={field.value?.toString() || ""}
                                onValueChange={(val) => field.onChange(Number(val))}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue>{field.value?.toString() || "Selecciona Horas"}</SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {actividadDocenteJson.cargaHoraria.map((opt, i) => (
                                        <SelectItem key={i} value={opt.toString()}>{opt}</SelectItem>
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
                        name={`actividadDocente.${index}.horarios`}
                        control={control}
                        defaultValue={[]}
                        render={({ field }) => {
                            const horarios = field.value || [];

                            const handleChange = (hIndex: number, key: string, value: string) => {
                                const updated = [...horarios];

                                updated[hIndex] = {
                                    ...updated[hIndex],
                                    [key]: value,
                                    // Si el campo modificado es "dia", actualizamos la propiedad "orden"
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
                                                    {actividadDocenteJson.dias.map((opt, i) => (
                                                        <SelectItem key={i} value={opt}>{opt}</SelectItem>
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

                {/* Total Ganado Bs */}
                <div className="flex flex-col gap-1 w-full">
                    <label className="font-medium text-sm">Total Ganado Bs</label>
                    <Controller
                        name={`actividadDocente.${index}.totalGanadoBs`}
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

            {/* Botón eliminar actividad docente */}
            <CardContent className="flex justify-end pt-0">
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeDocente(index)}
                    className="flex items-center gap-1"
                >
                    <Trash2 className="w-4 h-4" /> Eliminar
                </Button>
            </CardContent>
        </Card>
    );
};

export const ActividadDocenteCard: React.FC<ActividadDocenteProps> = ({ control, docenteFields, appendDocente, removeDocente }) => {
    return (
        <Card className="border rounded-xl bg-gray-50 dark:bg-gray-800 shadow-md">
            <CardHeader>
                <CardTitle>II. Actividad Docente/Administrativa UPEA</CardTitle>
                <CardDescription>Complete todas las actividades correspondientes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {docenteFields.map((field, index) => (
                    <ActividadItem key={field.id} control={control} index={index} removeDocente={removeDocente} />
                ))}

                <Button
                    type="button"
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2 border-blue-500 text-blue-500 hover:bg-blue-500/10 font-semibold transition-colors"
                    onClick={() => appendDocente({ horarios: [], totalGanadoBs: 0 })}
                >
                    <Plus className="w-4 h-4" /> Añadir Actividad Docente
                </Button>
            </CardContent>
        </Card>
    );
};
