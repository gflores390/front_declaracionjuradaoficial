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
import { useState } from "react";
import { ActividadDocenteCard } from "./actividad-docente";
import { ActividadExtraCard } from "./actividad-extra-universitaria";
import { ActividadAdministrativaCard } from "./actividad-adminstrativa";
import { ProfesionalJubiladoCard } from "./profesinal-jubilado";
import { OtraInformacionCard } from "./otra-informacion";
import { PdfDeclaracion } from "../documentopdf/pdf-declaracion-completo";


export const DeclaracionForm = ({ declaracion }: { declaracion?: DeclaracionData }) => {
    // Para navegar
    const router = useRouter();
    
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




    // ✅ CAMBIAR EL RETURN PRINCIPAL PARA DIVIDIR EN DOS COLUMNAS
    return (
 <div className="flex w-full bg-gray-50">
    
            {/* ✅ COLUMNA IZQUIERDA - FORMULARIO (OCUPA MITAD) */}
            <div className={`h-full overflow-y-auto bg-white ${
                mostrarVistaPrevia ? 'w-1/2' : 'w-full'
            }`}>
                <div className="p-6">
                    {/* ✅ HEADER CON BOTÓN PARA MOSTRAR/OCULTAR PDF */}
                    {/* HEADER */}
                    <div className="mb-6 border-b pb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                                    {declaracion?._id ? 'Editar Declaración Jurada' : 'Nueva Declaración Jurada'}
                                </h1>
                                <p className="text-gray-600 text-sm">Complete todos los campos requeridos</p>
                            </div>
                            
                            {/* <Button
                                type="button"
                                variant="outline"
                                onClick={() => setMostrarVistaPrevia(!mostrarVistaPrevia)}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-300 hover:bg-gray-50 transition-colors"
                            >
                                {mostrarVistaPrevia ? (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                        Ocultar Vista Previa
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        Mostrar Vista Previa
                                    </>
                                )}
                            </Button> */}
                        </div>
                    </div>
          
                    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
                        {/* <InfoCards /> */}
                        
                        {/* Datos Personales */}
                        <Card>
                            <CardHeader>
                                <CardTitle>I. Datos Personales</CardTitle>
                                <CardDescription>Información básica del declarante</CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="flex flex-col gap-1 flex-1">
                                    <label className="font-medium text-sm">Tipo de Documento</label>
                                    <Select
                                        {...register("datosPersonales.documentoIdentidad.tipo", {
                                            required: "Debe seleccionar un tipo de documento"
                                        })}
                                        defaultValue={declaracion?.datosPersonales.documentoIdentidad.tipo || ""}
                                        onValueChange={(v) => setValue("datosPersonales.documentoIdentidad.tipo", v, { shouldValidate: true })}
                                    >
                                        <SelectTrigger className="w-full md:w-full">
                                            <SelectValue placeholder="Tipo Documento" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="CI">CI</SelectItem>
                                            <SelectItem value="Pasaporte">Pasaporte</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.datosPersonales?.documentoIdentidad?.tipo && (
                                        <span className="text-red-500 text-sm">
                                            {errors.datosPersonales.documentoIdentidad.tipo.message}
                                        </span>
                                    )}
                                </div>

                                <div className="flex flex-col gap-1 flex-[2]">
                                    <label className="font-medium text-sm">Número de Documento</label>
                                    <Input
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

                                {/* ... (MANTENER TODOS TUS CAMPOS EXISTENTES EXACTAMENTE COMO ESTÁN) */}
                                
                                <div className="flex flex-col gap-1 flex-1">
                                    <label className="font-medium text-sm">Expedido</label>
                                    <Select
                                        defaultValue={declaracion?.datosPersonales.documentoIdentidad.expedido}
                                        onValueChange={(v) => setValue("datosPersonales.documentoIdentidad.expedido", v)}
                                    >
                                        <SelectTrigger className="w-full md:w-full">
                                            <SelectValue placeholder="Expedido en" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="LP">La Paz</SelectItem>
                                            <SelectItem value="CB">Cochabamba</SelectItem>
                                            <SelectItem value="SC">Santa Cruz</SelectItem>
                                            <SelectItem value="OR">Oruro</SelectItem>
                                            <SelectItem value="PT">Potosí</SelectItem>
                                            <SelectItem value="CH">Chuquisaca</SelectItem>
                                            <SelectItem value="BN">Beni</SelectItem>
                                            <SelectItem value="PA">Pando</SelectItem>
                                            <SelectItem value="TJ">Tarija</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="font-medium text-sm">Nombres</label>
                                    <Input
                                        {...register("datosPersonales.nombres", {
                                            required: "El nombre es obligatorio",
                                            pattern: {
                                                value: /^[A-Za-zÀ-ÿ\s]+$/i,
                                                message: "El nombre no puede contener números ni caracteres especiales",
                                            },
                                        })}
                                        placeholder="Nombres"
                                    />
                                    {errors.datosPersonales?.nombres && (
                                        <span className="text-red-500 text-sm">{errors.datosPersonales.nombres.message}</span>
                                    )}
                                </div>

                                <div className="flex flex-col gap-1">
                        <label className="font-medium text-sm">Apellido Paterno</label>
                        <Input
                            {...register("datosPersonales.paterno", {
                                pattern: {
                                    value: /^[A-Za-zÀ-ÿ\s]+$/i,
                                    message: "El apellido paterno no puede contener números ni caracteres especiales",
                                },
                            })}
                            placeholder="Apellido Paterno"
                        />
                        {errors.datosPersonales?.paterno && (
                            <span className="text-red-500 text-sm">{errors.datosPersonales.paterno.message}</span>
                        )}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="font-medium text-sm">Apellido Materno</label>
                        <Input
                            {...register("datosPersonales.materno", {
                                pattern: {
                                    value: /^[A-Za-zÀ-ÿ\s]+$/i,
                                    message: "El apellido materno no puede contener números ni caracteres especiales",
                                },
                            })}
                            placeholder="Apellido Materno"
                        />
                        {errors.datosPersonales?.materno && (
                            <span className="text-red-500 text-sm">{errors.datosPersonales.materno.message}</span>
                        )}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="font-medium text-sm">Apellido de Casada</label>
                        <Input
                            {...register("datosPersonales.apellidoCasada", {
                                pattern: {
                                    value: /^[A-Za-zÀ-ÿ\s]+$/i,
                                    message: "El apellido de casada no puede contener números ni caracteres especiales",
                                },
                            })}
                            placeholder="Apellido de Casada"
                        />
                        {errors.datosPersonales?.apellidoCasada && (
                            <span className="text-red-500 text-sm">{errors.datosPersonales.apellidoCasada.message}</span>
                        )}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="font-medium text-sm">Fecha de Nacimiento</label>
                        <Input
                            type="date"
                            {...register("datosPersonales.fechaNacimiento", {
                                required: "La fecha de nacimiento es obligatoria",
                                validate: (value) => {
                                    if (!value) return "La fecha es obligatoria";

                                    const hoy = new Date();
                                    const fecha = new Date(value);
                                    const edad = hoy.getFullYear() - fecha.getFullYear();
                                    const mes = hoy.getMonth() - fecha.getMonth();
                                    const dia = hoy.getDate() - fecha.getDate();
                                    const edadFinal = mes < 0 || (mes === 0 && dia < 0) ? edad - 1 : edad;

                                    if (edadFinal < 18) return "Debes tener al menos 18 años";
                                    if (edadFinal > 100) return "Edad no válida";
                                    return true;
                                },
                            })}
                        />
                        {errors.datosPersonales?.fechaNacimiento && (
                            <span className="text-red-500 text-sm">{errors.datosPersonales.fechaNacimiento.message}</span>
                        )}
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="font-medium text-sm">Zona</label>
                        <Input {...register("datosPersonales.direccion.zona")} placeholder="Zona" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="font-medium text-sm">Avenida</label>
                        <Input {...register("datosPersonales.direccion.avenida")} placeholder="Avenida" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="font-medium text-sm">Calle</label>
                        <Input {...register("datosPersonales.direccion.calle")} placeholder="Calle" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="font-medium text-sm">Número Domicilio</label>
                        <Input {...register("datosPersonales.direccion.numeroDomicilio")} placeholder="Número Domicilio" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="font-medium text-sm">Teléfono Domicilio</label>
                        <Input {...register("datosPersonales.telefonoDomicilio")} placeholder="Teléfono Domicilio" />
                    </div>

                    {/* Celular con error */}
                    <div className="flex flex-col gap-1">
                        <label className="font-medium text-sm">Celular</label>
                        <Input
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

                    {/* Correo con error */}
                    <div className="flex flex-col gap-1">
                        <label className="font-medium text-sm">Correo Electrónico</label>
                        <Input
                            type="email"
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
                        </Card>

                        {/* Actividad Docente/Administrativa */}
                        <ActividadDocenteCard
                            docenteFields={docenteFields}
                            removeDocente={removeDocente}
                            appendDocente={appendDocente}
                            control={control}
                        />

                        {/* Actividad Extra Universitaria */}
                        <ActividadExtraCard
                            control={control}
                            extraFields={extraFields}
                            appendExtra={appendExtra}
                            removeExtra={removeExtra}
                        />

                        {/* Actividad Administrativa */}
                        <ActividadAdministrativaCard
                            control={control}
                            adminFields={adminFields}
                            appendAdmin={appendAdmin}
                            removeAdmin={removeAdmin}
                        />

                        {/* Profesional Jubilado */}
                        <ProfesionalJubiladoCard
                            control={control}
                            jubiladoFields={jubiladoFields}
                            appendJubilado={appendJubilado}
                            removeJubilado={removeJubilado}
                        />

                        {/* Otra Información */}
                        <OtraInformacionCard
                            control={control}
                            otraInfoFields={otraInfoFields}
                            appendOtra={appendOtra}
                            removeOtra={removeOtra}
                        />

                        {/* Submit */}
                        <div className="sticky bottom-0 bg-transparent py-6 z-10 flex justify-center border-t">
                            <Button
                                type="submit"
                                className="px-10 py-4 text-lg font-bold rounded-md transition-all duration-200 flex items-center gap-2"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                {declaracion?._id ? 'Actualizar Declaración Jurada' : 'Crear Declaración Jurada'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            {/* ✅ COLUMNA DERECHA - VISTA PREVIA PDF (OCUPA MITAD) */}
            {/* COLUMNA DERECHA - VISTA PREVIA PDF */}
            {mostrarVistaPrevia && (
                <div className="w-1/2 h-full overflow-y-auto bg-gray-50 border-l border-gray-300 p-6">
                    <PdfDeclaracion data={watchedData} />
                </div>
            )}
        </div>
    );
};