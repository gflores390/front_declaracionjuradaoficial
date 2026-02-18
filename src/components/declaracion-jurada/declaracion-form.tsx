"use client";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { DeclaracionData, Inputs } from "@/app/declaracion-jurada/declaracion-jurada.interface";
import React, { useState } from "react";
import { ActividadDocenteCard } from "./actividad-docente";
import { ActividadExtraCard } from "./actividad-extra-universitaria";
import { ActividadAdministrativaCard } from "./actividad-adminstrativa";
import { ProfesionalJubiladoCard } from "./profesinal-jubilado";
import { PdfDeclaracion } from "../documentopdf/pdf-declaracion-completo";
import { useParams } from 'next/navigation';
export const getDeclaracionPorCI = async (ci: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/declaracion-jurada/existe/${ci}`);
  if (!response.ok) throw new Error('Error al obtener declaración');
  return response.json();
};

export const DeclaracionForm = ({ declaracion }: { declaracion?: DeclaracionData }) => {
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
    const params = useParams();
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

    const sumarUnDia = (fecha: string | Date): string => {
        const d = new Date(fecha);

        // si no es válido, retorna vacío (o lanza error)
        if (Number.isNaN(d.getTime())) return "";

        d.setDate(d.getDate() + 1);

        return d.toISOString(); // <-- ISO válido
    };

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        const normalizarFecha = (fecha?: string | Date | null): string => {
            if (!fecha) return ""; // <-- si no hay fecha, envia cadena vacía

            const iso = sumarUnDia(fecha);
            return iso;
        };

        const dataToSend = {
            ...data,

            datosPersonales: {
                ...data.datosPersonales,
                fechaNacimiento: normalizarFecha(data.datosPersonales?.fechaNacimiento),
            },

            profesionalJubilado: data.profesionalJubilado?.map((item) => ({
                ...item,
                fechaDeJubilacion: normalizarFecha(item.fechaDeJubilacion),
            })),
        };

    };

    const [openDatosPersonales, setOpenDatosPersonales] = useState(true);

    /////////////// ESTADO PARA GUARDAR LAS ACTIVIDADES COLAPSADAS ///////////
    const [colapsadas, setColapsadas] =
        React.useState<Record<number, boolean>>(() => {
            if (typeof window === "undefined") return {};
            const saved = localStorage.getItem("actividadDocente_colapsadas");
            return saved ? JSON.parse(saved) : {};
        });

    React.useEffect(() => {
        localStorage.setItem(
            "actividadDocente_colapsadas",
            JSON.stringify(colapsadas)
        );
    }, [colapsadas]);

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

    const [colapsadasOtraInfo, setColapsadasOtraInfo] =
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

    React.useEffect(() => {
        const cargarDatosPorCI = async () => {
            const ci = params?.id as string;

            if (ci && !declaracion?._id) {
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/declaracion-jurada/existe/${ci}`);
                    const result = await response.json();

                    if (result.status === 'success' && result.data.declaracion.persona) {
                        const persona = result.data.declaracion.persona;

                        // Separar nombre completo
                        const nombreCompleto = persona.nombresApellidos.trim().split(' ');

                        setValue('datosPersonales.documentoIdentidad.tipo', persona.tipoDocumento?.toUpperCase() || 'CI');
                        setValue('datosPersonales.documentoIdentidad.numero', persona.ci?.trim() || '');
                        setValue('datosPersonales.nombres', nombreCompleto[0]?.toUpperCase() || '');
                        setValue('datosPersonales.paterno', nombreCompleto[1]?.toUpperCase() || '');
                        setValue('datosPersonales.materno', nombreCompleto[2]?.toUpperCase() || '');
                        setValue('datosPersonales.fechaNacimiento', persona.fechaNacimiento || '');
                        setValue('datosPersonales.direccion.zona', persona.domicilio || '');
                        setValue('datosPersonales.telefonoDomicilio', persona.telefono || '');
                        setValue('datosPersonales.celular', persona.celular || '');
                        setValue('datosPersonales.correoElectronico', persona.correo || '');

                        toast.success('Datos personales cargados');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    toast.error('Error al cargar datos');
                }
            }
        };

        cargarDatosPorCI();
    }, [params, declaracion, setValue]);

    React.useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setMostrarVistaPrevia(false);
            }
        };

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // ✅ CAMBIAR EL RETURN PRINCIPAL PARA DIVIDIR EN DOS COLUMNAS
    return (
        <div className="flex h-screen w-full bg-gray-50">
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
                                className={`hidden lg:flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all text-[#215F99] hover:bg-[#EDF2F7] focus:outline-none focus:ring-2 focus:ring-[#215F99]/20`}
                                title={mostrarVistaPrevia ? "Ocultar vista previa" : "Mostrar vista previa"}
                            >
                                <svg
                                    className={`w-6 h-6 transition-transform ${mostrarVistaPrevia ? "rotate-180" : ""}`}
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
                                            className={`text-lg transition-transform duration-200 ${openDatosPersonales ? "rotate-180" : ""}`}
                                        >
                                            ▾
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {openDatosPersonales && (
                            <div className="mt-6 p-6 bg-white/0 backdrop-blur-md rounded-lg border border-dashed border-gray-400">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                                
                                {/* Nombres y Apellidos */}
                                {watchedData?.datosPersonales?.nombres && (
                                    <div className="flex flex-col">
                                    <span className="font-semibold text-gray-900">Nombres y Apellidos</span>
                                    <span>
                                        {watchedData.datosPersonales.nombres} {watchedData.datosPersonales?.paterno || ''} {watchedData.datosPersonales?.materno || ''}
                                    </span>
                                    </div>
                                )}

                                {/* CI */}
                                {watchedData?.datosPersonales?.documentoIdentidad?.numero && (
                                    <div className="flex flex-col">
                                    <span className="font-semibold text-gray-900">CI</span>
                                    <span>{watchedData.datosPersonales.documentoIdentidad.numero}</span>
                                    </div>
                                )}

                                {/* Tipo de Documento */}
                                {watchedData?.datosPersonales?.documentoIdentidad?.tipo && (
                                    <div className="flex flex-col">
                                    <span className="font-semibold text-gray-900">Tipo Documento</span>
                                    <span>{watchedData.datosPersonales.documentoIdentidad.tipo}</span>
                                    </div>
                                )}

                                {/* Fecha de Nacimiento */}
                                {watchedData?.datosPersonales?.fechaNacimiento && (
                                    <div className="flex flex-col">
                                    <span className="font-semibold text-gray-900">Fecha de Nacimiento</span>
                                    <span>{new Date(watchedData.datosPersonales.fechaNacimiento).toLocaleDateString('es-ES')}</span>
                                    </div>
                                )}

                                {/* Celular */}
                                {watchedData?.datosPersonales?.celular && (
                                    <div className="flex flex-col">
                                    <span className="font-semibold text-gray-900">Celular</span>
                                    <span>{watchedData.datosPersonales.celular}</span>
                                    </div>
                                )}

                                {/* Teléfono Domicilio */}
                                {watchedData?.datosPersonales?.telefonoDomicilio && (
                                    <div className="flex flex-col">
                                    <span className="font-semibold text-gray-900">Teléfono Domicilio</span>
                                    <span>{watchedData.datosPersonales.telefonoDomicilio}</span>
                                    </div>
                                )}

                                {/* Correo */}
                                {watchedData?.datosPersonales?.correoElectronico && (
                                    <div className="flex flex-col">
                                    <span className="font-semibold text-gray-900">Correo Electrónico</span>
                                    <span>{watchedData.datosPersonales.correoElectronico}</span>
                                    </div>
                                )}

                                {/* Domicilio */}
                                {watchedData?.datosPersonales?.direccion?.zona && (
                                    <div className="flex flex-col">
                                    <span className="font-semibold text-gray-900">Domicilio</span>
                                    <span>{watchedData.datosPersonales.direccion.zona}</span>
                                    </div>
                                )}

                                </div>
                            </div>
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
                            setColapsadas={setColapsadasJubilado}
                        />

                        {/* Submit */}
                        {/* BOTÓN SIEMPRE VISIBLE EN PANTALLA */}
                        <div className="fixed z-[9999] right-4 bottom-4 sm:right-6 sm:bottom-6 lg:right-10 lg:bottom-20">
                            <Button
                                type="submit"
                                className="group relative flex items-center gap-4 px-10 py-8 rounded-xl bg-gradient-to-br from-[#215F99] to-[#1B4F7D] text-white shadow-[0_10px_25px_rgba(33,95,153,0.35)] hover:shadow-[0_14px_35px_rgba(33,95,153,0.45)] transition-all duration-300 ease-out hover:-translate-y-[2px] active:translate-y-0 active:shadow-[0_6px_15px_rgba(33,95,153,0.35)]"
                            >
                                {/* ICONO */}
                                <span className="flex items-center justify-center w-11 h-11 rounded-lg bg-white/10 backdrop-blur-sm shadow-inner transition-transform duration-300 group-hover:scale-110">
                                    <svg className="w-6 h-6 text-white drop-shadow-sm" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M7 10l5 5m0 0 5-5m-5 5V4" />
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
