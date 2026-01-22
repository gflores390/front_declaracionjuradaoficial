"use client";
import { Inputs } from "@/app/declaracion-jurada/declaracion-jurada.interface";
import { Control, Controller, FieldArrayWithId, useWatch } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Check, Pencil, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { DatePicker } from "../date-picker";

interface JubiladoProps {
    control: Control<Inputs>;
    jubiladoFields: FieldArrayWithId<Inputs, "profesionalJubilado", "id">[];
    appendJubilado: (value: any) => void;
    removeJubilado: (index: number) => void;
    colapsadas: Record<string, boolean>;
                    setColapsadas: React.Dispatch<
                        React.SetStateAction<Record<string, boolean>>
                    >;     
}

interface JubiladoItemProps {
    control: Control<Inputs>;
    index: number;
    removeJubilado: (index: number) => void;
    colapsado: boolean;
    onToggle: () => void;
}

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

  
const JubiladoItem: React.FC<JubiladoItemProps> = ({ control, index, removeJubilado , colapsado,onToggle,}) => {
    const dependencia = useWatch({
        control,
        name: `profesionalJubilado.${index}.nombreInstitucion`,
        });
        const carrera = useWatch({
        control,
        name: `profesionalJubilado.${index}.nivelCargo`,
        });
        const materia = useWatch({
        control,
        name: `profesionalJubilado.${index}.fechaDeJubilacion`,
        });
        const [mounted, setMounted] = useState(false);
        useEffect(() => setMounted(true), []);
    return (
        <Card className="mb-4 transition-all duration-300 bg-transparent rounded-md rounded-xl shadow-[0_8px_22px_rgba(33,95,153,0.20)] p-6s">
            <CardHeader className="flex flex-row justify-between items-center gap-2 ">
                <div className="text-base sm:text-lg font-semibold text-[#215F99]">
                    5.{index + 1} Profesional Jubilado
                </div>
            </CardHeader>
             {!colapsado && mounted && (
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Institución */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[#215F99]">Institución</label>
                    <Controller
                        name={`profesionalJubilado.${index}.nombreInstitucion`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => 
                        <Input {...field} 
                        placeholder="Institución" 
                        className={`
                                    ${selectTriggerStyle}
                                    ${field.value && field.value !== "" && field.value !== "NINGUNA" 
                                        ? filledFieldStyle 
                                        : ""
                                    }
                                `}
                        
                        />}
                    />
                </div>

                {/* Cargo */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[#215F99]">Cargo</label>
                    <Controller
                        name={`profesionalJubilado.${index}.nivelCargo`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => 
                        <Input {...field} 
                        placeholder="Cargo" 
                        className={`
                                    ${selectTriggerStyle}
                                    ${field.value && field.value !== "" && field.value !== "NINGUNA" 
                                        ? filledFieldStyle 
                                        : ""
                                    }
                                `}
                         />}
                    />
                </div>

                {/* Fecha de Jubilación */}
                <div className="flex flex-col gap-1">
                <Controller
                    name={`profesionalJubilado.${index}.fechaDeJubilacion`}
                    control={control}
                    render={({ field }) => (
                    <>
                        <DatePicker
                        value={
                            field.value
                            ? new Date(field.value).toISOString().split("T")[0]
                            : ""
                        }
                        onChange={field.onChange}
                        label="Fecha de Jubilación"
                        placeholder="DD/MM/YYYY"
                        />
                    </>
                    )}
                />
                </div>


                {/* Monto */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[#215F99]">Monto Bs</label>
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
                    
                    <div className="min-w-0 truncate ">
                    <span className="font-semibold truncate block">{dependencia || "Sin dependencia"}</span>
                    {" · "}
                    <span className="truncate inline-block">{carrera || "Sin Carrera"}</span>
                      </div>

                </div>
                )}

            {/* Botón eliminar */}
           <CardContent className="flex justify-end pt-0 gap-4">
                                     <>
                                      <Button
                                      size="sm"
                                      onClick={() => removeJubilado(index)}
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

export const ProfesionalJubiladoCard: React.FC<JubiladoProps> = ({ control, jubiladoFields, appendJubilado, removeJubilado , colapsadas, setColapsadas}) => {
     const [openDatosPersonales, setOpenDatosPersonales] = useState(true)
    return (
        <div className="rounded-xl shadow-[0_8px_22px_rgba(33,95,153,0.20)] p-6">
                <div
                className="cursor-pointer"
                onClick={() => setOpenDatosPersonales(!openDatosPersonales)}
                >
      
                <h2 className="font-sans text-[#215F99] font-bold uppercase text-base mb-1" >
                    VI. Profesional Jubilado
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
                {jubiladoFields.map((field, index) => (
                    <JubiladoItem 
                    key={field.id} 
                    control={control} 
                    index={index} 
                    removeJubilado={removeJubilado} 
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
                        const newIndex = jubiladoFields.length;
                        setOpenDatosPersonales(true);
                        appendJubilado({
                        nombreInstitucion: "",
                        nivelCargo: "",
                        fechaDeJubilacion: "",
                        montoTitular: 0
                    })
                        setColapsadas((prev: Record<string, boolean>) => ({
                            ...prev,
                            [newIndex]: false,
                        }));
                    }}
                >
                    <Plus className="w-4 h-4" /> Añadir Jubilación
                </Button>
            </div>
        </div>
    );
};
