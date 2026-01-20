"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, useFieldArray, SubmitHandler, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DeclaracionData, Inputs } from "@/app/declaracion-jurada/declaracion-jurada.interface";
import { createDeclaracionJurada, updateDeclaracion } from "@/app/declaracion-jurada/declaracion-jurada.api";
import { DatePicker } from "@/components/date-picker"
import React, { useState } from "react";
import { ActividadDocenteCard } from "./actividad-docente";
import { ActividadExtraCard } from "./actividad-extra-universitaria";
import { ActividadAdministrativaCard } from "./actividad-adminstrativa";
import { ProfesionalJubiladoCard } from "./profesinal-jubilado";
import { OtraInformacionCard } from "./otra-informacion";
import { PdfDeclaracion } from "../documentopdf/pdf-declaracion-completo";



export const DeclaracionForm = ({ declaracion }: { declaracion?: DeclaracionData }) => {
    // Para navegar
    const router = useRouter();
    const inputBaseStyle = `
  w-full h-12 px-4
  rounded-lg text-sm
  transition-all duration-200 ease-in-out

  border border-[#215F99]/30
  bg-white

  hover:border-[#215F99]

  focus:outline-none
  focus:border-[#215F99]
  focus:ring-2 focus:ring-[#215F99]/25
  focus:bg-[#EDF2F7]
  focus:shadow-[0_2px_6px_rgba(33,95,153,0.15)]
`


    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    // ✅ NUEVO ESTADO PARA CONTROLAR LA VISTA PREVIA
    const [mostrarVistaPrevia, setMostrarVistaPrevia] = useState(true);

    // Convertimos la fechaNacimiento a YYYY-MM-DD
    const defaultDatosPersonales = declaracion?.datosPersonales
        ? {
            ...declaracion.datosPersonales,
            fechaNacimiento: declaracion.datosPersonales.fechaNacimiento
                ? new Date(declaracion.datosPersonales.fechaNacimiento).toISOString().split("T")[0]
                : "",
        }
        : {};

    // ✅ AGREGAR watch PARA VER LOS DATOS EN TIEMPO REAL
    const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm<Inputs>({
    defaultValues: {
        datosPersonales: defaultDatosPersonales,
        actividadDocente: declaracion?.actividadDocente || [],
        actividadExtraUniversitaria: declaracion?.actividadExtraUniversitaria || [],
        actividadAdministrativa: declaracion?.actividadAdministrativa || [],
        profesionalJubilado: declaracion?.profesionalJubilado || [],
        otraInformacion: declaracion?.otraInformacion || [],
        datosFormulario: declaracion?.datosFormulario || {},
    },
});


    // ✅ OBTENER LOS DATOS EN TIEMPO REAL PARA EL PDF
    const watchedData = watch();

    const { fields: docenteFields, append: appendDocente, remove: removeDocente } =
        useFieldArray({ control, name: "actividadDocente" });

    const { fields: extraFields, append: appendExtra, remove: removeExtra } =
        useFieldArray({ control, name: "actividadExtraUniversitaria" });

    const { fields: adminFields, append: appendAdmin, remove: removeAdmin } =
        useFieldArray({ control, name: "actividadAdministrativa" });

    const { fields: jubiladoFields, append: appendJubilado, remove: removeJubilado } =
        useFieldArray({ control, name: "profesionalJubilado" });

    const { fields: otraInfoFields, append: appendOtra, remove: removeOtra } =
        useFieldArray({ control, name: "otraInformacion" });

    const limpiarPayload = (payload: any): any => {
        const resultado: any = {};

        // Arrays que siempre deben enviarse, incluso vacíos
        const alwaysArrays = [
            "actividadDocenteAdministrativa",
            "actividadExtraUniversitaria",
            "actividadAdministrativa",
            "profesionalJubilado",
            "otraInformacion"
        ];

        for (const key in payload) {
            let value = payload[key];

            if (Array.isArray(value)) {
                // Limpiar cada elemento del array
                const arrLimpio = value.map((item) => limpiarPayload(item)).filter((item) => item && Object.keys(item).length > 0);
                resultado[key] = arrLimpio;
                if (alwaysArrays.includes(key) && !arrLimpio.length) {
                    resultado[key] = [];
                }
            } else if (typeof value === "object" && value !== null) {
                const objLimpio = limpiarPayload(value);
                if (Object.keys(objLimpio).length) resultado[key] = objLimpio;
            } else if (value !== undefined && value !== null && value !== "") {
                if (value === "NINGUNA") return undefined;
                resultado[key] = value;
            }
        }
        return resultado;
    };

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
         console.log("📤 DATOS QUE SE VAN A ENVIAR:", data);
        console.log("📤 datosPersonales:", data.datosPersonales);
        try {
            let response: Inputs;
            if (declaracion?._id) {
                response = await updateDeclaracion(declaracion._id, limpiarPayload(data));
                toast.success("Se actualizó la declaración jurada");
            } else {
                const payloadLimpio = limpiarPayload(data);
                response = await createDeclaracionJurada(payloadLimpio);
                toast.success("Se creó la declaración jurada");
            }
            handleOpenPdf(response._id);
        } catch (error) {
            console.error("Error al enviar el formulario:", error);
            toast.error("Error al enviar el formulario");
        }
    };

    const handleOpenPdf = (id: string) => {
    const pdfUrl = `${process.env.NEXT_PUBLIC_API_URL}/declaracion-jurada/reporte/${id}`;
    window.open(pdfUrl, "_blank");
    
    // Si estamos editando, quedarnos en edit
    if (declaracion?._id) {
        router.push(`/declaracion-jurada/${id}/edit`);
        router.refresh(); // Recargar datos actualizados
    } else {
        // Si es nuevo, ir al listado
        router.push(`/declaracion-jurada/${id}/edit`);
    }
    };

    const [openDatosPersonales, setOpenDatosPersonales] = useState(true)
   
///////////// ESTADO PARA GUARDAR LAS ACTIVIDADES COLAPSADAS ///////////
    const [colapsadas, setColapsadas] =
    React.useState<Record<number, boolean>>(() => {
      if (typeof window === "undefined") return {};
      const saved = localStorage.getItem("actividadDocente_colapsadas");
      return saved ? JSON.parse(saved) : {};
    });

    React.useEffect(() => {
    const saved = localStorage.getItem("actividadDocente_colapsadas");
    if (saved) {
        setColapsadas(JSON.parse(saved));
    }
    }, []);


        const [colapsadasActividadExtra, setColapsadasActividadExtra] =
    React.useState<Record<number, boolean>>(() => {
      if (typeof window === "undefined") return {};
      const saved = localStorage.getItem("ActividadExtra_colapsadas");
      return saved ? JSON.parse(saved) : {};
    });

    React.useEffect(() => {
    localStorage.setItem(
        "ActividadExtra_colapsadas",
        JSON.stringify(colapsadasActividadExtra)
    );
    }, [colapsadasActividadExtra]);

        const [colapsadasActividadAdministrativa, setColapsadasActividadAdministrativa] =
    React.useState<Record<number, boolean>>(() => {
        if (typeof window === "undefined") return {};
        const saved = localStorage.getItem("ActividadAdministrativa_colapsadas");
        return saved ? JSON.parse(saved) : {};
    });

    React.useEffect(() => {
    localStorage.setItem(
        "ActividadAdministrativa_colapsadas",
        JSON.stringify(colapsadasActividadAdministrativa)
    );
    }, [colapsadasActividadAdministrativa]);

    const [colapsadasJubilado, setColapsadasJubilado] =
    React.useState<Record<number, boolean>>(() => {
        if (typeof window === "undefined") return {};
        const saved = localStorage.getItem("ProfesionalJubilado_colapsadas");
        return saved ? JSON.parse(saved) : {};
    });
    React.useEffect(() => {
    localStorage.setItem(
        "ProfesionalJubilado_colapsadas",
        JSON.stringify(colapsadasJubilado)
    );
    }, [colapsadasJubilado]);

    const[colapsadasOtraInfo, setColapsadasOtraInfo] =
    React.useState<Record<number, boolean>>(() => {
        if (typeof window === "undefined") return {};
        const saved = localStorage.getItem("OtraInfo_colapsadas");
        return saved ? JSON.parse(saved) : {};
    });
    React.useEffect(() => {
    localStorage.setItem(
        "OtraInfo_colapsadas",
        JSON.stringify(colapsadasOtraInfo)
    );
    }, [colapsadasOtraInfo]);

    // ✅ CAMBIAR EL RETURN PRINCIPAL PARA DIVIDIR EN DOS COLUMNAS
    return (<div className="flex h-screen w-full bg-gray-50">
    
            {/* ✅ COLUMNA IZQUIERDA - FORMULARIO (OCUPA MITAD) */}
           <div
                className={`h-full overflow-y-auto bg-[#F5F9FF]
                    w-full
                    ${mostrarVistaPrevia ? "lg:w-1/2" : "lg:w-full"}
                `}
                >

                <div className="p-6">
                    {/* ✅ HEADER CON BOTÓN PARA MOSTRAR/OCULTAR PDF */}
                    {/* HEADER */}
                    <div className="mb-6 border-b border-[#215F99]/20 pb-4">
                    <div className="flex items-center justify-between">
                        <div>
                        <h1 className="text-2xl font-bold text-[#215F99] mb-1">
                            {declaracion?._id ? "Editar Declaración Jurada" : "Nueva Declaración Jurada"}
                        </h1>
                        <p className="text-sm text-[#215F99]/70">
                            Complete todos los campos requeridos
                        </p>
                        </div>
                        <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setMostrarVistaPrevia(!mostrarVistaPrevia)}
                        className={`
                            hidden lg:flex items-center gap-2 px-3 py-2
                            rounded-md text-sm font-medium
                            transition-all

                            text-[#215F99]
                            hover:bg-[#EDF2F7]
                            focus:outline-none
                            focus:ring-2 focus:ring-[#215F99]/20
                        `}
                        title={mostrarVistaPrevia ? "Ocultar vista previa" : "Mostrar vista previa"}
                        >
                        <svg
                            className={`w-6 h-6 transition-transform ${
                            mostrarVistaPrevia ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth={1.8}
                        >
                            {mostrarVistaPrevia ? (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                            ) : (
                            <>
                                <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                            </>
                            )}
                        </svg>

                        <span className="hidden sm:inline">
                            {mostrarVistaPrevia ? "Ocultar vista previa" : "Vista previa"}
                        </span>
                        </Button>
                    </div>
                    </div>

                            
                    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
                      <div
                        className="
                            rounded-xl
                            shadow-[0_8px_22px_rgba(33,95,153,0.20)]
                            p-6
                        "
                        >
                        {/* Datos Personales */}
                          {/* CABECERA DATOS PERSONALES */}
                        <div
                        className="cursor-pointer"
                        onClick={() => setOpenDatosPersonales(!openDatosPersonales)}
                        >
                                {/* TEXTO */}
                                <h2 className="font-sans text-[#215F99] font-bold uppercase text-base mb-1">
                                    II. Datos Personales
                                </h2>

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
                            
                           <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
                                <div className="flex flex-col gap-1 flex-1">
                                <label className="font-medium text-sm text-[#215F99]">Tipo de Documento</label>
                                <Controller
                                    name="datosPersonales.documentoIdentidad.tipo"
                                    control={control}
                                    rules={{ required: "Debe seleccionar un tipo de documento" }}
                                    render={({ field }) => (
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger className={`
                                                ${inputBaseStyle}
                                                uppercase
                                                min-h-[48px]                
                                                [&:not(:placeholder-shown)]:bg-[#EDF2F7]
                                                [&:not(:placeholder-shown)]:border-[#215F99]
                                                [&:not(:placeholder-shown)]:shadow-[0_2px_6px_rgba(33,95,153,0.15)]
                                            `}>
                                                <SelectValue placeholder="Tipo Documento" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white">
                                                <SelectItem value="CI" className="hover:bg-blue-50">CI</SelectItem>
                                                <SelectItem value="Pasaporte" className="hover:bg-blue-50">Pasaporte</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.datosPersonales?.documentoIdentidad?.tipo && (
                                    <span className="text-red-500 text-sm">
                                        {errors.datosPersonales.documentoIdentidad.tipo.message}
                                    </span>
                                )}
                            </div>

                                <div className="flex flex-col gap-1 flex-[2]">
                                    <label className="font-medium text-sm text-[#215F99]">Número de Documento</label>
                                    <Input
                                        className={`
                                            ${inputBaseStyle}
                                            uppercase             
                                            [&:not(:placeholder-shown)]:bg-[#EDF2F7]
                                            [&:not(:placeholder-shown)]:border-[#215F99]
                                            [&:not(:placeholder-shown)]:shadow-[0_2px_6px_rgba(33,95,153,0.15)]
                                        `} 
                                        {...register("datosPersonales.documentoIdentidad.numero", {
                                            required: "El número de documento es obligatorio",
                                            pattern: {
                                                value: /^\d+$/,
                                                message: "El número de documento debe contener solo números",
                                            },
                                            minLength: {
                                                value: 5,
                                                message: "El número de documento debe tener al menos 5 dígitos",
                                            },
                                        })}
                                        placeholder="Número Documento"
                                    />
                                    {errors.datosPersonales?.documentoIdentidad?.numero && (
                                        <span className="text-red-500 text-sm">
                                            {errors.datosPersonales.documentoIdentidad.numero.message}
                                        </span>
                                    )}
                                </div>

                              
                                <div className="flex flex-col gap-1 flex-1">
                                    <label className="font-medium text-sm text-[#215F99]">Expedido</label>
                                    <Controller
                                        name="datosPersonales.documentoIdentidad.expedido"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <SelectTrigger className={`
                                                    ${inputBaseStyle}
                                                    uppercase
                                                    min-h-[48px]                
                                                    [&:not(:placeholder-shown)]:bg-[#EDF2F7]
                                                    [&:not(:placeholder-shown)]:border-[#215F99]
                                                    [&:not(:placeholder-shown)]:shadow-[0_2px_6px_rgba(33,95,153,0.15)]
                                                `}>
                                                    <SelectValue placeholder="Expedido en" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-white">
                                                    <SelectItem value="LP" className="hover:bg-blue-50">La Paz</SelectItem>
                                                    <SelectItem value="CB" className="hover:bg-blue-50">Cochabamba</SelectItem>
                                                    <SelectItem value="SC" className="hover:bg-blue-50">Santa Cruz</SelectItem>
                                                    <SelectItem value="OR" className="hover:bg-blue-50">Oruro</SelectItem>
                                                    <SelectItem value="PT" className="hover:bg-blue-50">Potosí</SelectItem>
                                                    <SelectItem value="CH" className="hover:bg-blue-50">Chuquisaca</SelectItem>
                                                    <SelectItem value="BN" className="hover:bg-blue-50">Beni</SelectItem>
                                                    <SelectItem value="PA" className="hover:bg-blue-50">Pando</SelectItem>
                                                    <SelectItem value="TJ" className="hover:bg-blue-50">Tarija</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="font-medium text-sm text-[#215F99]">Nombres</label>
                                    <Input
                                        className={`
                                                ${inputBaseStyle}
                                                uppercase

                                                [&:not(:placeholder-shown)]:bg-[#EDF2F7]
                                                [&:not(:placeholder-shown)]:border-[#215F99]
                                                [&:not(:placeholder-shown)]:shadow-[0_2px_6px_rgba(33,95,153,0.15)]
                                            `}
                                        {...register("datosPersonales.nombres", {
                                            required: "El nombre es obligatorio",
                                            pattern: {
                                                value: /^[A-Za-zÀ-ÿ\s]+$/i,
                                                message: "El nombre no puede contener números ni caracteres especiales",
                                            },
                                        })}
                                        placeholder="Nombres"
                                        onChange={(e) => {
                                            e.target.value = e.target.value.toUpperCase();
                                        }}
                                    />
                                    {errors.datosPersonales?.nombres && (
                                        <span className="text-red-500 text-sm">{errors.datosPersonales.nombres.message}</span>
                                    )}
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="font-medium text-sm text-[#215F99]">Apellido Paterno</label>
                                    <Input
                                        className={`
                                                ${inputBaseStyle}
                                                uppercase

                                                [&:not(:placeholder-shown)]:bg-[#EDF2F7]
                                                [&:not(:placeholder-shown)]:border-[#215F99]
                                                [&:not(:placeholder-shown)]:shadow-[0_2px_6px_rgba(33,95,153,0.15)]
                                            `}
                                        {...register("datosPersonales.paterno", {
                                            pattern: {
                                                value: /^[A-Za-zÀ-ÿ\s]+$/i,
                                                message: "El apellido paterno no puede contener números ni caracteres especiales",
                                            },
                                        })}
                                        placeholder="Apellido Paterno"
                                        onChange={(e) => {
                                            e.target.value = e.target.value.toUpperCase();
                                        }}
                                    />
                                    {errors.datosPersonales?.paterno && (
                                        <span className="text-red-500 text-sm">{errors.datosPersonales.paterno.message}</span>
                                    )}
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="font-medium text-sm text-[#215F99]">Apellido Materno</label>
                                    <Input
                                        className={`
                                                ${inputBaseStyle}
                                                uppercase
                                                [&:not(:placeholder-shown)]:bg-[#EDF2F7]
                                                [&:not(:placeholder-shown)]:border-[#215F99]
                                                [&:not(:placeholder-shown)]:shadow-[0_2px_6px_rgba(33,95,153,0.15)]
                                            `}
                                        {...register("datosPersonales.materno", {
                                            pattern: {
                                                value: /^[A-Za-zÀ-ÿ\s]+$/i,
                                                message: "El apellido materno no puede contener números ni caracteres especiales",
                                            },
                                        })}
                                        placeholder="Apellido Materno"
                                        onChange={(e) => {
                                            e.target.value = e.target.value.toUpperCase();
                                        }}
                                    />
                                    {errors.datosPersonales?.materno && (
                                        <span className="text-red-500 text-sm">{errors.datosPersonales.materno.message}</span>
                                    )}
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="font-medium text-sm text-[#215F99]">Apellido de Casada</label>
                                    <Input
                                        className={`
                                                ${inputBaseStyle}
                                                uppercase

                                                [&:not(:placeholder-shown)]:bg-[#EDF2F7]
                                                [&:not(:placeholder-shown)]:border-[#215F99]
                                                [&:not(:placeholder-shown)]:shadow-[0_2px_6px_rgba(33,95,153,0.15)]
                                            `}
                                        {...register("datosPersonales.apellidoCasada", {
                                            pattern: {
                                                value: /^[A-Za-zÀ-ÿ\s]+$/i,
                                                message: "El apellido de casada no puede contener números ni caracteres especiales",
                                            },
                                        })}
                                        placeholder="Apellido de Casada"
                                        onChange={(e) => {
                                            e.target.value = e.target.value.toUpperCase();
                                        }}
                                    />
                                    {errors.datosPersonales?.apellidoCasada && (
                                        <span className="text-red-500 text-sm">{errors.datosPersonales.apellidoCasada.message}</span>
                                    )}
                                </div>
                                
                        
                                    
                                <Controller
                                    name="datosPersonales.fechaNacimiento"
                                    control={control}
                                    render={({ field }) => (
                                        <DatePicker
                                        value={
                                            field.value
                                            ? new Date(field.value).toISOString().split("T")[0]
                                            : ""
                                        }
                                        onChange={field.onChange}
                                        label="Fecha de Nacimiento"
                                        placeholder="DD/MM/YYYY"
                                        />
                                    )}
                                    />
                                            {selectedDate && (
                                                <div className="mt-6 p-4 bg-[#EDF2F7] rounded-lg">
                                                <p className="text-sm text-gray-600 mb-1">Fecha seleccionada:</p>
                                                <p className="text-lg font-semibold text-[#215F99]">
                                                    {new Date(selectedDate).toLocaleDateString("es-ES", {
                                                    weekday: "long",
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                    })}
                                                </p>
                                                </div>
                                            )}
                                    

                                <div className="flex flex-col gap-1">
                                    <label className="font-medium text-sm text-[#215F99]">Zona</label>
                                    <Input 
                                        className={`
                                                ${inputBaseStyle}
                                                uppercase
                                                [&:not(:placeholder-shown)]:bg-[#EDF2F7]
                                                [&:not(:placeholder-shown)]:border-[#215F99]
                                                [&:not(:placeholder-shown)]:shadow-[0_2px_6px_rgba(33,95,153,0.15)]
                                            `}
                                        {...register("datosPersonales.direccion.zona")} 
                                        placeholder="Zona"
                                        onChange={(e) => {
                                            e.target.value = e.target.value.toUpperCase();
                                        }}
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="font-medium text-sm text-[#215F99]">Avenida</label>
                                    <Input 
                                        className={`
                                                ${inputBaseStyle}
                                                uppercase
                                                [&:not(:placeholder-shown)]:bg-[#EDF2F7]
                                                [&:not(:placeholder-shown)]:border-[#215F99]
                                                [&:not(:placeholder-shown)]:shadow-[0_2px_6px_rgba(33,95,153,0.15)]
                                            `}
                                        {...register("datosPersonales.direccion.avenida")} 
                                        placeholder="Avenida"
                                        onChange={(e) => {
                                            e.target.value = e.target.value.toUpperCase();
                                        }}
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="font-medium text-sm text-[#215F99]">Calle</label>
                                    <Input 
                                        className={`
                                                ${inputBaseStyle}
                                                uppercase
                                                [&:not(:placeholder-shown)]:bg-[#EDF2F7]
                                                [&:not(:placeholder-shown)]:border-[#215F99]
                                                [&:not(:placeholder-shown)]:shadow-[0_2px_6px_rgba(33,95,153,0.15)]
                                            `}
                                        {...register("datosPersonales.direccion.calle")} 
                                        placeholder="Calle"
                                        onChange={(e) => {
                                            e.target.value = e.target.value.toUpperCase();
                                        }}
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="font-medium text-sm text-[#215F99]">Número Domicilio</label>
                                    <Input 
                                        className={`
                                                ${inputBaseStyle}
                                                uppercase
                                                [&:not(:placeholder-shown)]:bg-[#EDF2F7]
                                                [&:not(:placeholder-shown)]:border-[#215F99]
                                                [&:not(:placeholder-shown)]:shadow-[0_2px_6px_rgba(33,95,153,0.15)]
                                            `}
                                        {...register("datosPersonales.direccion.numeroDomicilio")} 
                                        placeholder="Número Domicilio"
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="font-medium text-sm text-[#215F99]">Teléfono Domicilio</label>
                                    <Input 
                                        className={`
                                                ${inputBaseStyle}
                                                uppercase
                                                [&:not(:placeholder-shown)]:bg-[#EDF2F7]
                                                [&:not(:placeholder-shown)]:border-[#215F99]
                                                [&:not(:placeholder-shown)]:shadow-[0_2px_6px_rgba(33,95,153,0.15)]
                                            `}
                                        {...register("datosPersonales.telefonoDomicilio")} 
                                        placeholder="Teléfono Domicilio"
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="font-medium text-sm text-[#215F99]">Celular</label>
                                    <Input
                                        className={`
                                                ${inputBaseStyle}
                                                uppercase
                                                [&:not(:placeholder-shown)]:bg-[#EDF2F7]
                                                [&:not(:placeholder-shown)]:border-[#215F99]
                                                [&:not(:placeholder-shown)]:shadow-[0_2px_6px_rgba(33,95,153,0.15)]
                                            `}
                                        {...register("datosPersonales.celular", {
                                            required: "El celular es obligatorio",
                                            pattern: {
                                                value: /^\d{8}$/,
                                                message: "El celular debe tener exactamente 8 dígitos",
                                            },
                                        })}
                                        placeholder="Celular"
                                    />
                                    {errors.datosPersonales?.celular && (
                                        <span className="text-red-500 text-sm">{errors.datosPersonales.celular.message}</span>
                                    )}
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="font-medium text-sm text-[#215F99]">Correo Electrónico</label>
                                    <Input
                                        
                                        type="email"
                                        className={`
                                            ${inputBaseStyle}
                                            normal-case
                                            [&:not(:placeholder-shown)]:bg-[#EDF2F7]
                                            [&:not(:placeholder-shown)]:border-[#215F99]
                                            [&:not(:placeholder-shown)]:shadow-[0_2px_6px_rgba(33,95,153,0.15)]
                                        `}
                                        {...register("datosPersonales.correoElectronico", {
                                            required: "El correo es obligatorio",
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message: "Correo inválido",
                                            },
                                        })}
                                        placeholder="Correo"
                                    />
                                    {errors.datosPersonales?.correoElectronico && (
                                        <span className="text-red-500 text-sm">{errors.datosPersonales.correoElectronico.message}</span>
                                    )}
                                </div>
                            </CardContent>

                            )}
                    </div>        
                       

                        {/* Actividad Docente/Administrativa */}
                        <ActividadDocenteCard
                        docenteFields={docenteFields}
                        removeDocente={removeDocente}
                        appendDocente={appendDocente}
                        control={control}
                        colapsadas={colapsadas}
                        setColapsadas={setColapsadas}
                        />


                        {/* Actividad Extra Universitaria */}
                        <ActividadExtraCard
                            control={control}
                            extraFields={extraFields}
                            appendExtra={appendExtra}
                            removeExtra={removeExtra}
                            colapsadas={colapsadasActividadExtra}
                            setColapsadas={setColapsadasActividadExtra}
                        />

                        {/* Actividad Administrativa */}
                        <ActividadAdministrativaCard
                            control={control}
                            adminFields={adminFields}
                            appendAdmin={appendAdmin}
                            removeAdmin={removeAdmin}
                            colapsadas={colapsadasActividadAdministrativa}
                            setColapsadas={setColapsadasActividadAdministrativa}
                        />

                        {/* Profesional Jubilado */}
                        <ProfesionalJubiladoCard
                            control={control}
                            jubiladoFields={jubiladoFields}
                            appendJubilado={appendJubilado}
                            removeJubilado={removeJubilado}
                            colapsadas={colapsadasJubilado}
                            setColapsadas={ setColapsadasJubilado}
                            
                        />

                        {/* Otra Información */}
                        <OtraInformacionCard
                            control={control}
                            otraInfoFields={otraInfoFields}
                            appendOtra={appendOtra}
                            removeOtra={removeOtra}
                            colapsadas={colapsadasOtraInfo}
                            setColapsadas={setColapsadasOtraInfo}
                        />

                        {/* Submit */}
                        {/* BOTÓN SIEMPRE VISIBLE EN PANTALLA */}
                        <div className="fixed right-10 bottom-20 z-[9999]">
<Button
  type="submit"
  className="
    group relative
    flex items-center gap-4
    px-10 py-8
    rounded-xl
    bg-gradient-to-br from-[#215F99] to-[#1B4F7D]
    text-white
    shadow-[0_10px_25px_rgba(33,95,153,0.35)]
    hover:shadow-[0_14px_35px_rgba(33,95,153,0.45)]
    transition-all duration-300 ease-out
    hover:-translate-y-[2px]
    active:translate-y-0
    active:shadow-[0_6px_15px_rgba(33,95,153,0.35)]
  "
>
  {/* ICONO */}
  <span
    className="
      flex items-center justify-center
      w-11 h-11
      rounded-lg
      bg-white/10
      backdrop-blur-sm
      shadow-inner
      transition-transform duration-300
      group-hover:scale-110
    "
  >
    <svg
      className="w-6 h-6 text-white drop-shadow-sm"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M7 10l5 5m0 0 5-5m-5 5V4"
      />
    </svg>
  </span>

  {/* TEXTO */}
  <div className="flex flex-col leading-tight text-left">
    <span className="text-lg font-extrabold tracking-wide">
      {declaracion?._id ? "Actualizar" : "Crear"}
    </span>

    <span className="text-sm font-medium text-white/85">
      y descargar Declaración Jurada
    </span>
  </div>
</Button>

</div>



                    </form>
                </div>
            </div>

            {/* ✅ COLUMNA DERECHA - VISTA PREVIA PDF (OCUPA MITAD) */}
            {/* COLUMNA DERECHA - VISTA PREVIA PDF */}
            {mostrarVistaPrevia && (
            <div className="hidden lg:block w-1/2 h-full overflow-y-auto bg-gray-50 border-l border-gray-300 p-6">
                <PdfDeclaracion data={watchedData} />
            </div>
            )}
        </div>
    );
};