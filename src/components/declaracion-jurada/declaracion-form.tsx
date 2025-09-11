"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, useFieldArray, SubmitHandler, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { DeclaracionData, Inputs } from "@/app/declaracion-jurada/declaracion-jurada.interface";
import { createDeclaracionJurada, updateDeclaracion } from "@/app/declaracion-jurada/declaracion-jurada.api";
import { Link, Plus } from "lucide-react";
import { InfoCards } from "./info-card";
import { useEffect, useState } from "react";
import { actividadDocenteJson } from "@/app/declaracion-jurada/actividad-docente";
import { ActividadDocenteCard } from "./actividad-docente";
import { ActividadExtraCard } from "./actividad-extra-universitaria";

export const DeclaracionForm = ({ declaracion }: { declaracion?: DeclaracionData }) => {
    // Para navegar
    const router = useRouter();
    const [openPdf, setOpenPdf] = useState<{ open: boolean; pdfUrl: string }>({ open: false, pdfUrl: "" });

    // Convertimos la fechaNacimiento a YYYY-MM-DD
    const defaultDatosPersonales = declaracion?.datosPersonales
        ? {
            ...declaracion.datosPersonales,
            fechaNacimiento: declaracion.datosPersonales.fechaNacimiento
                ? new Date(declaracion.datosPersonales.fechaNacimiento).toISOString().split("T")[0]
                : "",
        }
        : {};

    const { register, handleSubmit, control, setValue, formState: { errors } } = useForm<Inputs>({
        defaultValues: {
            // datosPersonales: declaracion?.datosPersonales || {},
            datosPersonales: defaultDatosPersonales,
            actividadDocente: declaracion?.actividadDocente || [],
            actividadExtraUniversitaria: declaracion?.actividadExtraUniversitaria || [],
            actividadAdministrativa: declaracion?.actividadAdministrativa || [],
            profesionalJubilado: declaracion?.profesionalJubilado || [],
            otraInformacion: declaracion?.otraInformacion || []
        },
    });

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
        console.log(data);
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
            // Mensajes
            // router.push("/declaracion-jurada");
        } catch (error) {
            console.error("Error al enviar el formulario:", error);
            toast.error("Error al enviar el formulario");
        }
    };

    const handleOpenPdf = (id: string) => {
        const pdfUrl = `${process.env.NEXT_PUBLIC_API_URL}/declaracion-jurada/reporte/${id}`;
        window.open(pdfUrl, "_blank"); // Abre el PDF en nueva pestaña
        router.push("/"); // Redirige a la ruta principal
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
            <InfoCards />
            {/* Datos Personales */}
            <Card>
                <CardHeader>
                    <CardTitle>I. Datos Personales</CardTitle>
                    <CardDescription>Información básica del declarante</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
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
                    <div className="flex flex-col gap-1 flex-1">
                        <label className="font-medium text-sm">Expedido</label>
                        <Select
                            defaultValue={declaracion?.datosPersonales.documentoIdentidad.expedido}
                            onValueChange={(v) => setValue("datosPersonales.documentoIdentidad.expedido", v)}
                        >
                            <SelectTrigger className="w-full md:w-full">
                                <SelectValue placeholder="Expedido en" /></SelectTrigger>
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
            < Card >
                <CardHeader>
                    <CardTitle>IV. Actividad Administrativa Otras Instituciones</CardTitle>
                </CardHeader>
                <CardContent>
                    {adminFields.map((field, index) => (
                        <div key={field.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-xl mb-4">
                            <Input {...register(`actividadAdministrativa.${index}.nombreInstitucion`)} placeholder="Institución" />
                            <Input {...register(`actividadAdministrativa.${index}.nivelCargoOcupacional`)} placeholder="Cargo" />
                            <Select defaultValue={field.actividadPublicaPrivada} onValueChange={(v) => setValue(`actividadAdministrativa.${index}.actividadPublicaPrivada`, v)}>
                                <SelectTrigger><SelectValue placeholder="Tipo" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="publica">Pública</SelectItem>
                                    <SelectItem value="privada">Privada</SelectItem>
                                </SelectContent>
                            </Select>
                            <Input {...register(`actividadAdministrativa.${index}.modalidadContrato`)} placeholder="Contrato" />
                            <Input {...register(`actividadAdministrativa.${index}.cargaHoraria`)} placeholder="Carga Horaria" />
                            <Input {...register(`actividadAdministrativa.${index}.horarios`)} placeholder="Horarios" />
                            <Input type="number" {...register(`actividadAdministrativa.${index}.totalGanado`, { setValueAs: v => Number(v) })} placeholder="Total Ganado" />
                            <Button type="button" variant="destructive" onClick={() => removeAdmin(index)}>Eliminar</Button>
                        </div>
                    ))}
                    <Button type="button" onClick={() => appendAdmin({})}>+ Añadir actividad administrativa</Button>
                </CardContent>
            </Card >

            {/* Profesional Jubilado */}
            < Card >
                <CardHeader>
                    <CardTitle>V. Profesional Jubilado</CardTitle>
                </CardHeader>
                <CardContent>
                    {jubiladoFields.map((field, index) => (
                        <div key={field.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-xl mb-4">
                            <Input {...register(`profesionalJubilado.${index}.nombreInstitucion`)} placeholder="Institución" />
                            <Input {...register(`profesionalJubilado.${index}.nivelCargo`)} placeholder="Cargo" />
                            <Input type="date" {...register(`profesionalJubilado.${index}.fechaDeJubilacion`)} />
                            <Input type="number" {...register(`profesionalJubilado.${index}.montoTitular`, { setValueAs: v => Number(v) })} placeholder="Monto Bs" />
                            <Button type="button" variant="destructive" onClick={() => removeJubilado(index)}>Eliminar</Button>
                        </div>
                    ))}
                    <Button type="button" onClick={() => appendJubilado({})}>+ Añadir jubilación</Button>
                </CardContent>
            </Card >

            {/* Otra Información */}
            < Card >
                <CardHeader>
                    <CardTitle>VI. Otra Información</CardTitle>
                </CardHeader>
                <CardContent>
                    {otraInfoFields.map((field, index) => (
                        <div key={field.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-xl mb-4">
                            <Textarea {...register(`otraInformacion.${index}.descripcionAdecuacion`)} placeholder="Descripción" />
                            <Input {...register(`otraInformacion.${index}.institucion`)} placeholder="Institución" />
                            <Input {...register(`otraInformacion.${index}.documentoRespaldo`)} placeholder="Documento" />
                            <Input type="number" {...register(`otraInformacion.${index}.montoDescuento`, { setValueAs: v => Number(v) })} placeholder="Monto Descuento" />
                            <Button type="button" variant="destructive" onClick={() => removeOtra(index)}>Eliminar</Button>
                        </div>
                    ))}
                    <Button type="button" onClick={() => appendOtra({})}>
                        + Añadir otra información
                    </Button>
                </CardContent>
            </Card >

            {/* Submit */}
            < div className="sticky bottom-0 bg-transparent py-6 z-10 flex justify-center border-t" >
                <Button
                    type="submit"
                    className="px-10 py-4 text-lg font-bold rounded-md transition-all duration-200 flex items-center gap-2"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {declaracion?._id ? 'Actualizar Declaración Jurada' : 'Crear Declaración Jurada'}
                </Button>
            </div >
        </form >
    );
};


