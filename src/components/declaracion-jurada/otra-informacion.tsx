"use client"
import type { Inputs } from "@/app/declaracion-jurada/declaracion-jurada.interface"
import { type Control, Controller, type FieldArrayWithId, useWatch } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"
import { Plus, Trash2, ChevronDown, Pencil, Check } from "lucide-react"
import type React from "react"
import { useEffect, useState } from "react"

interface OtraInfoProps {
  control: Control<Inputs>
  otraInfoFields: FieldArrayWithId<Inputs, "otraInformacion", "id">[]
  appendOtra: (value: any) => void
  removeOtra: (index: number) => void
  colapsadas: Record<number, boolean>
  setColapsadas: React.Dispatch<React.SetStateAction<Record<number, boolean>>>
}

interface OtraInfoItemProps {
  control: Control<Inputs>
  index: number
  removeOtra: (index: number) => void
  colapsado: boolean
  onToggle: () => void
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

const filledFieldStyle = "bg-[#EDF2F7] border-[#215F99] shadow-[0_2px_6px_rgba(33,95,153,0.15)]"

const OtraInfoItem: React.FC<OtraInfoItemProps> = ({ control, index, removeOtra, colapsado, onToggle }) => {
  const dependencia = useWatch({
    control,
    name: `otraInformacion.${index}.descripcionAdecuacion`,
  })
  const carrera = useWatch({
    control,
    name: `otraInformacion.${index}.institucion`,
  })
  const materia = useWatch({
    control,
    name: `otraInformacion.${index}.documentoRespaldo`,
  })
  const [mounted, setMounted] = useState(false);
          useEffect(() => setMounted(true), []);
  return (
    <Card className="mb-4 transition-all duration-300 bg-transparent border-dashed border border-[#215F99] rounded-md p-2">
      <CardHeader className="flex flex-row justify-between items-center gap-2 pb-2">
        <div
          className="text-base sm:text-lg font-semibold text-[#215F99] cursor-pointer flex-1"
          onClick={onToggle}
        >
          6.{index + 1} Otra Información
        </div>
      
      </CardHeader>

      {!colapsado && mounted && (
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {/* Descripción */}
          <div className="flex flex-col gap-1 col-span-1 sm:col-span-2">
            <label className="text-sm font-medium text-[#215F99]">Descripción</label>
            <Controller
              name={`otraInformacion.${index}.descripcionAdecuacion`}
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder="Descripción"
                  className={`
                                        ${selectTriggerStyle}
                                        ${
                                          field.value && field.value !== "" && field.value !== "NINGUNA"
                                            ? filledFieldStyle
                                            : ""
                                        }
                                    `}
                />
              )}
            />
          </div>

          {/* Institución */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[#215F99]">Institución</label>
            <Controller
              name={`otraInformacion.${index}.institucion`}
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Institución"
                  className={`
                                        ${selectTriggerStyle}
                                        ${
                                          field.value && field.value !== "" && field.value !== "NINGUNA"
                                            ? filledFieldStyle
                                            : ""
                                        }
                                    `}
                />
              )}
            />
          </div>

          {/* Documento */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[#215F99]">Documento</label>
            <Controller
              name={`otraInformacion.${index}.documentoRespaldo`}
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Documento"
                  className={`
                                        ${selectTriggerStyle}
                                        ${
                                          field.value && field.value !== "" && field.value !== "NINGUNA"
                                            ? filledFieldStyle
                                            : ""
                                        }
                                    `}
                />
              )}
            />
          </div>

          {/* Monto Descuento */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[#215F99]">Monto Descuento</label>
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
                  className={`
                                        ${selectTriggerStyle}
                                        ${field.value && field.value !== 0 ? filledFieldStyle : ""}
                                    `}
                />
              )}
            />
          </div>
        </CardContent>
      )}
       {!colapsado && mounted && (
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
              {/* Botón eliminar */}
            <CardContent className="flex justify-end pt-0">
                <>  <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => removeOtra(index)} 
                className="flex items-center gap-1 bg-white text-red-600 border border-red-600 hover:bg-red-600 hover:text-white">
                    <Trash2 className="w-4 h-4" /> Eliminar
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
  )
}

export const OtraInformacionCard: React.FC<OtraInfoProps> = ({
  control,
  otraInfoFields,
  appendOtra,
  removeOtra,
  colapsadas,
  setColapsadas,
}) => {
  const [openDatosPersonales, setOpenDatosPersonales] = useState(true)

  return (
    <div className="rounded-xl shadow-[0_8px_22px_rgba(33,95,153,0.20)] p-6">
      <div className="cursor-pointer" onClick={() => setOpenDatosPersonales(!openDatosPersonales)}>
        <h2 className="font-sans text-[#215F99] font-bold uppercase text-base mb-1">VII. Otra Información</h2>
        
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
          {otraInfoFields.map((field, index) => (
            <OtraInfoItem
              key={field.id}
              control={control}
              index={index}
              removeOtra={removeOtra}
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
              const newIndex = otraInfoFields.length;
              setOpenDatosPersonales(true);
              appendOtra({
                descripcionAdecuacion: "",
                institucion: "",
                documentoRespaldo: "",
                montoDescuento: 0,
              });
              setColapsadas((prev: Record<number, boolean>) => ({
                ...prev,
                [newIndex]: false,
              }));
            } }
          >
            <Plus className="w-4 h-4" /> Añadir otra información
          </Button>
      </div>
    </div>
  )
}
