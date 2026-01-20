"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Controller, Control, FieldArrayWithId, useWatch } from "react-hook-form";
import { Check, Pencil, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Inputs } from "@/app/declaracion-jurada/declaracion-jurada.interface";

// Opciones base para este formulario
const actividadExtraJson = {
    tipo: ["PÚBLICA", "PRIVADA"],
};

// Orden por día de la semana


interface ActividadExtraProps {
    control: Control<Inputs>;
    extraFields: FieldArrayWithId<Inputs, "actividadExtraUniversitaria", "id">[];
    appendExtra: (value: any) => void;
    removeExtra: (index: number) => void;
    colapsadas: Record<string, boolean>;
        setColapsadas: React.Dispatch<
            React.SetStateAction<Record<string, boolean>>
        >;
}

interface ActividadExtraItemProps {
    control: Control<Inputs>;
    index: number;
    removeExtra: (index: number) => void;
    colapsado: boolean;
    onToggle: () => void;
}
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
`;
const filledFieldStyle =
  "bg-[#EDF2F7] border-[#215F99] shadow-[0_2px_6px_rgba(33,95,153,0.15)]";


const ActividadExtraItem: React.FC<ActividadExtraItemProps> = ({ control, index, removeExtra, colapsado,onToggle,  }) => {
    
       const dependencia = useWatch({
        control,
        name: `actividadExtraUniversitaria.${index}.nombreInstitucion`,
        });
        const carrera = useWatch({
        control,
        name: `actividadExtraUniversitaria.${index}.nivelCargoOcupacional`,
        });
        const materia = useWatch({
        control,
        name: `actividadExtraUniversitaria.${index}.actividadPublicaPrivada`,
        });
        const [mounted, setMounted] = useState(false);
        useEffect(() => setMounted(true), []);
    
    
    return (
        <Card className="mb-4 transition-all duration-300 bg-transparent border-dashed border border-[#215F99] gap-2 rounded-md !p-2">
            <CardHeader className="flex flex-row justify-between items-center gap-2">
                <div className="text-base sm:text-lg font-semibold text-[#215F99]">
                    3.{index + 1} Actividad Extra Universitaria
                </div>
            </CardHeader>
            {!colapsado && mounted && (
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {/* Institución */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[#215F99]">Institución</label>

                    <Controller
                        name={`actividadExtraUniversitaria.${index}.nombreInstitucion`}
                        control={control}

                        defaultValue=""
                        render={({ field }) => (
                            <Input {...field} 
                            placeholder="Nombre de la Institución" 
                            className={`
                                ${selectTriggerStyle}
                                ${field.value && field.value !== ""
                                ? filledFieldStyle
                                : ""
                                }
                            `} 
                            />
                        )}

                    />

                </div>

                {/* Cargo */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[#215F99]">Nivel / Cargo Ocupacional</label>
                    <Controller
                        name={`actividadExtraUniversitaria.${index}.nivelCargoOcupacional`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <Input {...field} 
                            placeholder="Cargo Ocupacional" 
                            className={`
                                ${selectTriggerStyle}
                                ${field.value && field.value !== ""
                                ? filledFieldStyle
                                : ""
                                }
                            `} />
                        )}
                    />
                </div>

                {/* Tipo Pública/Privada */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[#215F99]">Tipo</label>
                    <Controller
                        name={`actividadExtraUniversitaria.${index}.actividadPublicaPrivada`}
                        control={control}
                        render={({ field }) => (
                            <Select value={field.value || ""} onValueChange={field.onChange}>
                                <SelectTrigger  className={`
                                 ${selectTriggerStyle}
                                    ${field.value && field.value !== "" && field.value !== "NINGUNA" 
                                    ? "bg-[#EDF2F7] border-[#215F99] shadow-[0_2px_6px_rgba(33,95,153,0.15)]" 
                                    : ""
                                  }
                                `}>                                       
                                    <SelectValue>
                                        {field.value || "Selecciona Tipo"}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                    <SelectItem value="NINGUNA" className="hover:bg-blue-50" >--Ninguna--</SelectItem>
                                    {actividadExtraJson.tipo.map((opt, i) => (
                                        <SelectItem key={i} value={opt}  className="hover:bg-blue-50" >
                                            {opt}
                                        </SelectItem>
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
                    name={`actividadExtraUniversitaria.${index}.horarios`}
                    control={control}
                    defaultValue={[]}
                    render={({ field }) => {
                    const horarios = field.value || [];

                    const handleChange = (
                        hIndex: number,
                        key: "dia" | "inicio" | "fin",
                        value: string
                    ) => {
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
                                {/* DÍA */}
                                <Select
                                    value={h.dia || ""}
                                    onValueChange={(val) =>
                                    handleChange(hIndex, "dia", val.toUpperCase())
                                    }
                                >
                                    <SelectTrigger className={selectTriggerStyle}>
                                    <SelectValue placeholder="Día" />
                                    </SelectTrigger>
                                    <SelectContent>
                                    {Object.keys(diasOrden).map((opt) => (
                                        <SelectItem key={opt} value={opt}>
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
                                    className={`
                                    h-9 text-xs
                                    ${h.inicio ? filledFieldStyle : ""}
                                    `}
                                />

                                {/* FIN */}
                                <Input
                                    type="time"
                                    value={h.fin || ""}
                                    onChange={(e) =>
                                    handleChange(hIndex, "fin", e.target.value)
                                    }
                                    className={`
                                    h-9 text-xs
                                    ${h.fin ? filledFieldStyle : ""}
                                    `}
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

                        {/* AGREGAR HORARIO */}
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


                
               {/* Carga Horaria */}
                <div className="flex flex-col gap-1 w-full">
                <label className="text-sm font-medium text-[#215F99]">
                    Carga Horaria
                </label>

                <Controller
                    name={`actividadExtraUniversitaria.${index}.cargaHoraria`}
                    control={control}
                    render={({ field }) => {
                    const tieneValor =
                        field.value !== null &&
                        field.value !== undefined &&
                        Number(field.value) > 0;

                    return (
                        <Input
                        type="number"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => {
                            const val = e.target.value;
                            field.onChange(val === "" ? 0 : Number(val));
                        }}
                        placeholder="Ej: 20"
                        className={`
                            w-full
                            min-h-[3rem]
                            ${tieneValor ? filledFieldStyle : ""}
                        `}
                        />
                    );
                    }}
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
                                className={`
                                    ${selectTriggerStyle}
                                    ${field.value && field.value !== 0
                                        ? filledFieldStyle
                                        : ""
                                    }
                                `}
                            />
                        )}
                    />
                </div>
            </CardContent>
            )}
            {colapsado && mounted && (
                <div className="ml-4 bg-white rounded-md px-2 py-1 flex items-center justify-between text-sm text-[#215F99]">
                    
                    <div className="truncate ">
                    <span className="font-semibold">{dependencia || "Decanatura de Educación"}</span>
                    {" · "}
                    <span>{carrera || "Ingeniería Electrónica"}</span>
                    {" · "}
                    <span className="text-xs text-[#215F99]/80">{materia || "Física II"}</span>
                    </div>

                </div>
                )}
            {/* Botón eliminar */}
            <CardContent className="flex justify-end pt-0">
               <>
                <Button
                size="sm"
                onClick={() => removeExtra(index)}
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
                 {mounted && (
                    colapsado ? (
                    <>
                        <Pencil className="w-4 h-4" />
                        Editar
                    </>
                    ) : (
                    <>
                        <Check className="w-4 h-4" />
                        Completado
                    </>
                    )
                )}
                </Button>

                </>
            </CardContent>
        </Card>
    );
};

export const ActividadExtraCard: React.FC<ActividadExtraProps> = ({ control, extraFields, appendExtra, removeExtra , colapsadas, setColapsadas}) => {
    const [openDatosPersonales, setOpenDatosPersonales] = useState(true)
   
    return (
      <div className="rounded-xl shadow-[0_8px_22px_rgba(33,95,153,0.20)] p-6">     
                 <div
                        className="cursor-pointer"
                        onClick={() => setOpenDatosPersonales(!openDatosPersonales)}
                        >
                <h2 className="font-sans text-[#215F99] font-bold uppercase text-base mb-1">
                    IV. Actividad Extra Universitaria
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
                {extraFields.map((field, index) => (
                    <ActividadExtraItem 
                    key={field.id} 
                    control={control} 
                    index={index} 
                    removeExtra={removeExtra} 
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
                        const newIndex = extraFields.length;
                        setOpenDatosPersonales(true);
                        appendExtra({ horarios: [], totalGanado: 0 ,

                        });
                    
                        setColapsadas((prev: Record<string, boolean>) => ({
                            ...prev,
                            [newIndex]: false,
                        }));
                    }}
                >
                    <Plus className="w-4 h-4" /> Añadir Actividad Extra
                </Button>
             </div>
        </div>
    );
};
