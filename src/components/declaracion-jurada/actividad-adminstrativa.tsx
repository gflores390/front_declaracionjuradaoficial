"use client";
import { Inputs } from "@/app/declaracion-jurada/declaracion-jurada.interface";
import { Control, Controller, FieldArrayWithId } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { Plus, Trash2 } from "lucide-react";
import React from "react";

// Opciones tipo Pública / Privada
const actividadAdminJson = {
    tipo: ["PÚBLICA", "PRIVADA"],
};

// Orden por día (si luego quieres usar días para horarios tipo ExtraUniversitaria)
const diasOrden: Record<string, number> = {
    LUNES: 1,
    MARTES: 2,
    MIERCOLES: 3,
    JUEVES: 4,
    VIERNES: 5,
    SABADO: 6,
    DOMINGO: 7
};

interface ActividadAdminProps {
    control: Control<Inputs>;
    adminFields: FieldArrayWithId<Inputs, "actividadAdministrativa", "id">[];
    appendAdmin: (value: any) => void;
    removeAdmin: (index: number) => void;
}

interface ActividadAdminItemProps {
    control: Control<Inputs>;
    index: number;
    removeAdmin: (index: number) => void;
}

const ActividadAdminItem: React.FC<ActividadAdminItemProps> = ({ control, index, removeAdmin }) => {
    return (
        <Card className="mb-4 bg-gray-50 dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
            <CardHeader className="flex justify-between items-center">
                <CardTitle className="text-base sm:text-lg font-semibold">
                    4.{index + 1} Actividad Administrativa
                </CardTitle>
            </CardHeader>

            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Institución */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Institución</label>
                    <Controller
                        name={`actividadAdministrativa.${index}.nombreInstitucion`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => <Input {...field} placeholder="Institución" className="w-full" />}
                    />
                </div>

                {/* Cargo */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Nivel / Cargo Ocupacional</label>
                    <Controller
                        name={`actividadAdministrativa.${index}.nivelCargoOcupacional`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => <Input {...field} placeholder="Cargo" className="w-full" />}
                    />
                </div>

                {/* Tipo Pública/Privada */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Tipo</label>
                    <Controller
                        name={`actividadAdministrativa.${index}.actividadPublicaPrivada`}
                        control={control}
                        defaultValue="NINGUNA"
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue>{field.value || "Selecciona Tipo"}</SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="NINGUNA">--Ninguna--</SelectItem>
                                    {actividadAdminJson.tipo.map((opt, i) => (
                                        <SelectItem key={i} value={opt}>{opt}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>

                {/* Modalidad de Contrato */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Modalidad de Contrato</label>
                    <Controller
                        name={`actividadAdministrativa.${index}.modalidadContrato`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => <Input {...field} placeholder="Contrato" className="w-full" />}
                    />
                </div>

                {/* Carga Horaria */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Carga Horaria</label>
                    <Controller
                        name={`actividadAdministrativa.${index}.cargaHoraria`}
                        control={control}
                        defaultValue={0}
                        render={({ field }) => (
                            <Input
                                type="number"
                                {...field}
                                value={field.value ?? 0}
                                onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                                placeholder="Carga Horaria"
                                className="w-full"
                            />
                        )}
                    />
                </div>

                {/* Horarios */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Horarios</label>
                    <Controller
                        name={`actividadAdministrativa.${index}.horarios`}
                        control={control}
                        defaultValue={[]}
                        render={({ field }) => {
                            const horarios = field.value || [];
                            const handleChange = (hIndex: number, key: string, value: string) => {
                                const updated = [...horarios];
                                updated[hIndex] = { ...updated[hIndex], [key]: value };
                                field.onChange(updated);
                            };
                            const handleAdd = () => field.onChange([...horarios, { dia: "", inicio: "", fin: "" }]);

                            return (
                                <>
                                    {horarios.map((h, hIndex) => (
                                        <div key={hIndex} className="flex gap-2 items-center w-full flex-wrap">
                                            <Select
                                                value={h.dia || ""}
                                                onValueChange={(val) => handleChange(hIndex, "dia", val)}
                                            >
                                                <SelectTrigger className="w-28">
                                                    <SelectValue>{h.dia || "Día"}</SelectValue>
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
                                                <Button type="button" variant="destructive" size="sm" onClick={() => {
                                                    const updated = [...horarios];
                                                    updated.splice(hIndex, 1);
                                                    field.onChange(updated);
                                                }}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>

                                                {hIndex === horarios.length - 1 && (
                                                    <Button type="button" variant="outline" className="flex items-center gap-1 text-blue-500 border-blue-500 hover:bg-blue-500/10" onClick={handleAdd}>
                                                        <Plus className="w-4 h-4" /> Añadir Día
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {horarios.length === 0 && (
                                        <Button type="button" variant="outline" className="flex items-center gap-1 text-blue-500 border-blue-500 hover:bg-blue-500/10 mt-2" onClick={handleAdd}>
                                            <Plus className="w-4 h-4" /> Añadir Día
                                        </Button>
                                    )}
                                </>
                            );
                        }}
                    />
                </div>

                {/* Total Ganado */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Total Ganado Bs</label>
                    <Controller
                        name={`actividadAdministrativa.${index}.totalGanado`}
                        control={control}
                        defaultValue={0}
                        render={({ field }) => (
                            <Input
                                type="number"
                                {...field}
                                value={field.value ?? 0}
                                onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                                placeholder="Total Ganado Bs"
                                className="w-full"
                            />
                        )}
                    />
                </div>
            </CardContent>

            {/* Botón eliminar */}
            <CardContent className="flex justify-end pt-0">
                <Button variant="destructive" size="sm" onClick={() => removeAdmin(index)} className="flex items-center gap-1">
                    <Trash2 className="w-4 h-4" /> Eliminar
                </Button>
            </CardContent>
        </Card>
    );
};

export const ActividadAdministrativaCard: React.FC<ActividadAdminProps> = ({ control, adminFields, appendAdmin, removeAdmin }) => {
    return (
        <Card className="border rounded-xl bg-gray-50 dark:bg-gray-800 shadow-md">
            <CardHeader>
                <CardTitle>IV. Actividad Administrativa Otras Instituciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {adminFields.map((field, index) => (
                    <ActividadAdminItem key={field.id} control={control} index={index} removeAdmin={removeAdmin} />
                ))}

                <Button
                    type="button"
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2 border-blue-500 text-blue-500 hover:bg-blue-500/10 font-semibold transition-colors"
                    onClick={() => appendAdmin({
                        nombreInstitucion: "",
                        nivelCargoOcupacional: "",
                        actividadPublicaPrivada: "NINGUNA",
                        modalidadContrato: "",
                        cargaHoraria: 0,
                        horarios: [],
                        totalGanado: 0,
                    })}
                >
                    <Plus className="w-4 h-4" /> Añadir Actividad Administrativa
                </Button>
            </CardContent>
        </Card>
    );
};
