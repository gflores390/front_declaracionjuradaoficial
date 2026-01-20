"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Controller, Control, FieldArrayWithId, useWatch } from "react-hook-form";
import { Check, Pencil, Plus, Trash2 } from "lucide-react";
import { actividadDocenteJson } from "@/app/declaracion-jurada/actividad-docente";
import React, { useState } from "react";
import { Inputs } from "@/app/declaracion-jurada/declaracion-jurada.interface";

interface ActividadDocenteProps {
    control: Control<Inputs>;
    docenteFields: FieldArrayWithId<Inputs, "actividadDocente", "id">[];
    appendDocente: (value: any) => void;
    removeDocente: (index: number) => void;
    colapsadas: Record<string, boolean>;
    setColapsadas: React.Dispatch<
        React.SetStateAction<Record<string, boolean>>
    >;
}

interface ActividadItemProps {
    control: Control<Inputs>;
    index: number;
    removeDocente: (index: number) => void;
    colapsado: boolean;
    onToggle: () => void;
}
interface Horario {
  dia: string;
  inicio: string;
  fin: string;
  orden: number;
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
const horarioRowBase = `
  grid grid-cols-2 md:grid-cols-[140px_90px_90px_1fr_auto]
  gap-3 items-center
  rounded-lg border p-3
  transition-all duration-200
`;

const horarioCompleto = `
  bg-[#EDF2F7]
  border-[#215F99]
  shadow-[0_2px_6px_rgba(33,95,153,0.12)]
`;

const horarioIncompleto = `
  bg-white
  border-[#215F99]/30
`;

const selectTriggerStyle = `
  w-full
min-h-[3rem]                     
  px-4
  text-sm
  uppercase                     
  rounded-lg

  bg-white
  border
  border-[#215F99]/30

  transition-all
  duration-200
  ease-in-out

  hover:border-[#215F99]

  focus:outline-none
  focus:border-[#215F99]
  focus:ring-2
  focus:ring-[#215F99]/25

  data-[state=open]:bg-[#EDF2F7]            
  data-[state=open]:border-[#215F99]          
  data-[state=open]:shadow-[0_2px_6px_rgba(33,95,153,0.15)] 
`
const filledFieldStyle =
  "bg-[#EDF2F7] border-[#215F99] shadow-[0_2px_6px_rgba(33,95,153,0.15)]";

const ActividadItem: React.FC<ActividadItemProps> = ({ control, index, removeDocente, colapsado,onToggle, }) => {
    
    const dependencia = useWatch({
    control,
    name: `actividadDocente.${index}.dependenciaDecanaturaArea`,
    });
    const carrera = useWatch({
    control,
    name: `actividadDocente.${index}.carreraInstituto`,
    });
    const materia = useWatch({
    control,
    name: `actividadDocente.${index}.materiaSigla`,
    });

    return (
        <Card className="mb-4 transition-all duration-300 bg-transparent border-dashed border border-[#215F99] gap-2 rounded-md !p-2">
            <CardHeader className="flex flex-row justify-between items-center gap-2 ">
                <div className="text-base sm:text-lg font-semibold text-[#215F99]">
                    2.{index + 1} Actividad Docente
                </div>
            </CardHeader>
            {!colapsado && (
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {/* Dependencia */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[#215F99]">Dependencia / Área</label>
                    
                    <Controller
                        name={`actividadDocente.${index}.dependenciaDecanaturaArea`}
                        control={control}
                        render={({ field }) => (
                            <Select value={field.value ?? ""} onValueChange={field.onChange}>
                                <SelectTrigger  className={`
                                        ${selectTriggerStyle}
                                        ${field.value && field.value !== "" && field.value !== "NINGUNA" 
                                            ? "bg-[#EDF2F7] border-[#215F99] shadow-[0_2px_6px_rgba(33,95,153,0.15)]" 
                                            : ""
                                        }
                                    `}>
                                    <SelectValue >
                                        {field.value || "Selecciona Dependencia"}
                                    </SelectValue>
                                </SelectTrigger>

                                <SelectContent className="bg-white">
                                    <SelectItem value="NINGUNA" className="hover:bg-blue-50">--Ninguna--</SelectItem>
                                    {actividadDocenteJson.dependencia.map((opt, i) => (
                                        <SelectItem key={i} value={opt} className="hover:bg-blue-50">
                                            {opt}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />

                </div>

                {/* Carrera */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[#215F99]">Carrera / Instituto</label>
                    <Controller
                        name={`actividadDocente.${index}.carreraInstituto`}
                        control={control}
                        render={({ field }) => (
                            <Select value={field.value ?? ""} onValueChange={field.onChange}>
                                <SelectTrigger  className={`
                                        ${selectTriggerStyle}
                                        ${field.value && field.value !== "" && field.value !== "NINGUNA" 
                                            ? "bg-[#EDF2F7] border-[#215F99] shadow-[0_2px_6px_rgba(33,95,153,0.15)]" 
                                            : ""
                                        }
                                    `}>
                                    <SelectValue>
                                        {field.value || "Selecciona Carrera"}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                    <SelectItem value="NINGUNA" className="hover:bg-blue-50">--Ninguna--</SelectItem>
                                    {actividadDocenteJson.carrera.map((opt, i) => (
                                        <SelectItem key={i} value={opt}  className="hover:bg-blue-50">{opt}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>

                {/* Materia / Cargo */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[#215F99]">Materia / Cargo Administrativo</label>
                    <Controller
                        name={`actividadDocente.${index}.materiaSigla`}
                        control={control}
                        render={({ field }) => (
                            <Select value={field.value ?? ""} onValueChange={field.onChange}>
                                <SelectTrigger  className={`
                                        ${selectTriggerStyle}
                                        ${field.value && field.value !== "" && field.value !== "NINGUNA" 
                                            ? "bg-[#EDF2F7] border-[#215F99] shadow-[0_2px_6px_rgba(33,95,153,0.15)]" 
                                            : ""
                                        }
                                    `}>
                                    <SelectValue>{field.value || "Selecciona Materia"}</SelectValue>
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                    {actividadDocenteJson.materia.map((opt, i) => (
                                        <SelectItem key={i} value={opt} className="hover:bg-blue-50">{opt}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>

                {/* Categoría */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[#215F99]">Categoría</label>
                    <Controller
                        name={`actividadDocente.${index}.categoriaDocente`}
                        control={control}
                        render={({ field }) => (
                            <Select value={field.value ?? ""} onValueChange={field.onChange}>
                                <SelectTrigger  className={`
                                        ${selectTriggerStyle}
                                        ${field.value && field.value !== "" && field.value !== "NINGUNA" 
                                            ? "bg-[#EDF2F7] border-[#215F99] shadow-[0_2px_6px_rgba(33,95,153,0.15)]" 
                                            : ""
                                        }
                                    `}>
                                    <SelectValue>{field.value || "Selecciona Categoría"}</SelectValue>
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                    {actividadDocenteJson.categoria.map((opt, i) => (
                                        <SelectItem key={i} value={opt} className="hover:bg-blue-50">{opt}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>

                {/* Cargo */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[#215F99]">Cargo</label>
                    <Controller
                        name={`actividadDocente.${index}.cargo`}
                        control={control}
                        render={({ field }) => (
                            <Select value={field.value ?? ""} onValueChange={field.onChange}>
                                <SelectTrigger  className={`
                                        ${selectTriggerStyle}
                                        ${field.value && field.value !== "" && field.value !== "NINGUNA" 
                                            ? "bg-[#EDF2F7] border-[#215F99] shadow-[0_2px_6px_rgba(33,95,153,0.15)]" 
                                            : ""
                                        }
                                    `}>
                                    <SelectValue>{field.value || "Selecciona Cargo"}</SelectValue>
                                </SelectTrigger>
                                <SelectContent className="bg-white">
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
                    <label className="text-sm font-medium text-[#215F99]">Carga Horaria</label>
                    <Controller
                        name={`actividadDocente.${index}.cargaHoraria`}
                        control={control}
                        render={({ field }) => (
                            <Select
                                value={field.value?.toString() ?? ""}
                                onValueChange={(val) => field.onChange(Number(val))}
                            >
                                <SelectTrigger className={`
                                    ${selectTriggerStyle}
                                    ${field.value && field.value !== 0
                                        ? "bg-[#EDF2F7] border-[#215F99] shadow-[0_2px_6px_rgba(33,95,153,0.15)]" 
                                        : ""
                                    }
                                `}>
                                    <SelectValue>{field.value?.toString() || "Selecciona Horas"}</SelectValue>
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                    {actividadDocenteJson.cargaHoraria.map((opt, i) => (
                                        <SelectItem key={i} value={opt.toString()} className="hover:bg-blue-50" >{opt}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>

                {/* Días y Horarios */}
                 <div className="flex flex-col gap-3 w-full col-span-1 sm:col-span-2 lg:col-span-3">
                <label className="font-semibold text-sm text-[#215F99]">
                    Días y Horarios
                </label>

                <Controller
                    name={`actividadDocente.${index}.horarios`}
                    control={control}
                    defaultValue={[]}
                    render={({ field }) => {
                    const horarios = field.value || [];

                    const handleChange = (
                        hIndex: number, 
                        key: keyof Horario, 
                        value: string) => {
                        const updated = [...horarios];
                        updated[hIndex] = {
                        ...updated[hIndex],
                        [key]: value,
                        orden:
                            key === "dia"
                            ? diasOrden[value.toUpperCase()] || 0
                            : updated[hIndex].orden || 0,
                        };
                        field.onChange(updated);
                    };

                    const handleAddDia = () => {
                        field.onChange([
                        ...horarios,
                        { dia: "", inicio: "", fin: "", orden: 0 },
                        ]);
                    };

                   const handleRemove = (hIndex: number) => {
                    const updated = [...horarios];
                    updated.splice(hIndex, 1);
                    field.onChange(updated);
                    };


                    return (
                        <>
                        <div className="grid gap-3">
                            {horarios.map((h, hIndex) => {
                            const completo = h.dia && h.inicio && h.fin;

                            return (
                                <div
                                key={hIndex}
                                className={`${horarioRowBase} ${
                                    completo ? horarioCompleto : horarioIncompleto
                                }`}
                                >
                                {/* DIA */}
                                <Select
                                    value={h.dia || ""}
                                    onValueChange={(val) =>
                                    handleChange(hIndex, "dia", val.toUpperCase())
                                    }
                                >
                                    <SelectTrigger className="h-9 text-xs uppercase">
                                    <SelectValue placeholder="Día" />
                                    </SelectTrigger>
                                    <SelectContent>
                                    {actividadDocenteJson.dias.map((opt, i) => (
                                        <SelectItem key={i} value={opt.toUpperCase()}>
                                        {opt}
                                        </SelectItem>
                                    ))}
                                    </SelectContent>
                                </Select>

                                {/* INICIO */}
                                <Input
                                    type="time"
                                    value={h.inicio || ""}
                                    onChange={(e) =>
                                    handleChange(hIndex, "inicio", e.target.value)
                                    }
                                    className="h-9 text-xs"
                                />

                                {/* FIN */}
                                <Input
                                    type="time"
                                    value={h.fin || ""}
                                    onChange={(e) =>
                                    handleChange(hIndex, "fin", e.target.value)
                                    }
                                    className="h-9 text-xs"
                                />

                                {/* DURACIÓN */}
                                <span className="text-xs text-[#215F99]/80">
                                    {h.inicio && h.fin && (() => {
                                    const [hi, mi] = h.inicio.split(":").map(Number);
                                    const [hf, mf] = h.fin.split(":").map(Number);
                                    const min = hf * 60 + mf - (hi * 60 + mi);
                                    return `${Math.floor(min / 60)}hrs. ${min % 60}min.`;
                                    })()}
                                </span>

                                {/* ELIMINAR */}
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleRemove(hIndex)}
                                    className="text-red-500 hover:bg-red-50"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                                </div>
                            );
                            })}
                        </div>

                        {/* AGREGAR */}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleAddDia}
                            className="mt-2 w-fit flex items-center gap-1
                            text-[#215F99] border-[#215F99]
                            hover:bg-[#215F99]/10"
                        >
                            <Plus className="w-4 h-4" />
                            Añadir horario
                        </Button>
                        </>
                    );
                    }}
                />
                </div>

                {/* Total Ganado Bs */}
                <div className="flex flex-col gap-1 w-full">
                    <label className="font-medium text-sm text-[#215F99]">Total Ganado Bs</label>
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
                                className={`
                                    ${selectTriggerStyle}
                                    ${field.value && field.value !== 0
                                        ? "bg-[#EDF2F7] border-[#215F99] shadow-[0_2px_6px_rgba(33,95,153,0.15)]" 
                                        : ""
                                    }
                                `}
                            />
                        )}
                    />
                </div>

            </CardContent>
            )}

            {colapsado && (
                <div className=" ml-4 mbg-white rounded-md px-2 py-1 flex items-center justify-between text-sm text-[#215F99]">
                    
                    <div className="truncate ">
                    <span className="font-semibold">{dependencia || "Decanatura de Educación"}</span>
                    {" · "}
                    <span>{carrera || "Ingeniería Electrónica"}</span>
                    {" · "}
                    <span className="text-xs text-[#215F99]/80">{materia || "Física II"}</span>
                    </div>

                </div>
                )}



            {/* Botón eliminar actividad docente */}
            <CardContent className="flex justify-end gap-4 pt-2 mb-2 ">
                <>
                <Button
                size="sm"
                onClick={() => removeDocente(index)}
                className="flex items-center gap-1 bg-white text-red-600 border border-red-600 hover:bg-red-600 hover:text-white"
                >
                <Trash2 className="w-4 h-4" />
                Eliminar
                </Button>

                <Button
                type="button"
                size="sm"
                onClick={onToggle}
                className="flex items-center gap-2 bg-[#215F99] text-white border border-[#215F99]
                hover:bg-white hover:text-[#215F99]"
                >
                {colapsado ? (
                    <>
                    <Pencil className="w-4 h-4" />
                    Editar
                    </>
                ) : (
                    <>
                    <Check className="w-4 h-4" />
                    Completado
                    </>
                )}
                </Button>

                </>
            </CardContent>
        </Card>
    );
};



export const ActividadDocenteCard: React.FC<ActividadDocenteProps> = ({ control, docenteFields, appendDocente, removeDocente, colapsadas, setColapsadas }) => {
    const [openDatosPersonales, setOpenDatosPersonales] = useState(true)
    return (
        <div className="rounded-xl shadow-[0_8px_22px_rgba(33,95,153,0.20)] p-6">
                <div
                    className="cursor-pointer select-none"
                    onClick={() => setOpenDatosPersonales(!openDatosPersonales)}
                    >
                {/* TÍTULO */}
                <h2 className="font-sans text-[#215F99] font-bold uppercase text-base mb-1">
                    III. Actividad Docente/Administrativa UPEA
                </h2>

                {/* LÍNEA + CONTROL */}
                <div className="relative flex items-center">
                    {/* LÍNEA */}
                    <div className="flex-1 border-t border-dashed border-[#215F99]" />

                    {/* RECTÁNGULO */}
                    <div
                    className="
                        ml-3 flex items-center gap-2
                        px-3 py-1
                        border border-dashed border-[#215F99]
                        rounded-md
                        text-[#215F99]
                        text-sm font-semibold
                        hover:bg-[#215F99]/5
                        transition-colors
                    "
                    >
                    {/* TEXTO */}
                    <span>
                        {openDatosPersonales ? "Ver menos" : "Ver más"}
                    </span>

                    {/* FLECHA (SOLO ESTA SE MUEVE) */}
                    <span
                        className={`
                        text-lg
                        transition-transform duration-200
                        ${openDatosPersonales ? "rotate-180" : ""}
                        `}
                    >
                        ▾
                    </span>
                    </div>
                </div>
                </div>

              {openDatosPersonales && (                   
            <CardContent className="space-y-4 mt-10">
               {docenteFields.map((field, index) => (
                    <ActividadItem
                    key={field.id}
                    control={control}
                    index={index}
                    removeDocente={removeDocente}
                    colapsado={colapsadas[index] ?? true}
                    onToggle={() =>
                        setColapsadas((prev) => ({
                        ...prev,
                        [index]: !prev[index],
                        }))
                    }
                    />
                ))}

            </CardContent>     
            )}
            <div>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-10 w-full flex items-center justify-center gap-2 border-[#215F99] text-[#215F99] hover:bg-blue-500/10 font-semibold transition-colors"
                    onClick={() => {
                        const newIndex = docenteFields.length;
                        setOpenDatosPersonales(true);
                        appendDocente({ 
                        horarios: [], 
                        totalGanadoBs: 0,
                    });
                    setColapsadas((prev: Record<string, boolean>) => ({
                    ...prev,
                    [newIndex]: false,
                    }));
                }}
                >
                    <Plus className="w-4 h-4" /> Añadir Actividad Docente
                </Button>
            </div>
        </div>
    );
};
