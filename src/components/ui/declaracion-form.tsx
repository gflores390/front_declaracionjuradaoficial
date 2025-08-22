"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { DeclaracionData, Inputs } from "@/app/declaracion-jurada/declaracion-jurada.interface";
import { createDeclaracionJurada, updateDeclaracion } from "@/app/declaracion-jurada/declaracion-jurada.api";
import { Link } from "lucide-react";

export const DeclaracionForm = ({ declaracion }: { declaracion?: DeclaracionData }) => {
    // Para navegar
    const router = useRouter();

    const { register, handleSubmit, control, setValue, watch } = useForm<Inputs>({
        defaultValues: {
            datosPersonales: declaracion?.datosPersonales || {},
            actividadDocenteAdministrativa: declaracion?.actividadDocenteAdministrativa || [],
            actividadExtraUniversitaria: declaracion?.actividadExtraUniversitaria || [],
            actividadAdministrativa: declaracion?.actividadAdministrativa || [],
            profesionalJubilado: declaracion?.profesionalJubilado || [],
            otraInformacion: declaracion?.otraInformacion || []
        },
    });

    const { fields: docenteFields, append: appendDocente, remove: removeDocente } =
        useFieldArray({ control, name: "actividadDocenteAdministrativa" });

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
                resultado[key] = value;
            }
        }
        return resultado;
    };

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        try {
            let response: any;
            if (declaracion?._id) {
                response = await updateDeclaracion(declaracion._id, limpiarPayload(data));
                toast.success("Se actualizó la declaración jurada");
            } else {
                const payloadLimpio = limpiarPayload(data);
                response = await createDeclaracionJurada(payloadLimpio);
                toast.success("Se creó la declaración jurada");
            }
            // Mensajes
            router.push("/declaracion-jurada");
        } catch (error) {
            console.error("Error al enviar el formulario:", error);
            toast.error("Error al enviar el formulario");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
            {/* Datos Personales */}
            <Card>
                <CardHeader>
                    <CardTitle>I. Datos Personales</CardTitle>
                    <CardDescription>Información básica del declarante</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input {...register("datosPersonales.nombres")} placeholder="Nombres" />
                    <Input {...register("datosPersonales.paterno")} placeholder="Apellido Paterno" />
                    <Input {...register("datosPersonales.materno")} placeholder="Apellido Materno" />
                    <Input {...register("datosPersonales.apellidoCasada")} placeholder="Apellido de Casada" />
                    <Input type="date" min="" {...register("datosPersonales.fechaNacimiento")} />
                    <Select defaultValue={declaracion?.datosPersonales.documentoIdentidad.tipo} onValueChange={(v) => setValue("datosPersonales.documentoIdentidad.tipo", v)}>
                        <SelectTrigger><SelectValue placeholder="Tipo Doc" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="CI">CI</SelectItem>
                            <SelectItem value="Pasaporte">Pasaporte</SelectItem>
                        </SelectContent>
                    </Select>
                    <Input {...register("datosPersonales.documentoIdentidad.numero")} placeholder="Número Documento" />
                    <Select defaultValue={declaracion?.datosPersonales.documentoIdentidad.expedido} onValueChange={(v) => setValue("datosPersonales.documentoIdentidad.expedido", v)}>
                        <SelectTrigger><SelectValue placeholder="Expedido en" /></SelectTrigger>
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
                    <Input {...register("datosPersonales.direccion.zona")} placeholder="Zona" />
                    <Input {...register("datosPersonales.direccion.avenida")} placeholder="Avenida" />
                    <Input {...register("datosPersonales.direccion.calle")} placeholder="Calle" />
                    <Input {...register("datosPersonales.direccion.numeroDomicilio")} placeholder="Número Domicilio" />
                    <Input {...register("datosPersonales.telefonoDomicilio")} placeholder="Teléfono Domicilio" />
                    <Input {...register("datosPersonales.celular")} placeholder="Celular" />
                    <Input type="email" {...register("datosPersonales.correoElectronico")} placeholder="Correo" />
                </CardContent>
            </Card>

            {/* Actividad Docente/Administrativa */}
            <Card>
                <CardHeader>
                    <CardTitle>II. Actividad Docente/Administrativa UPEA</CardTitle>
                </CardHeader>
                <CardContent>
                    {docenteFields.map((field, index) => (
                        <div key={field.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-xl mb-4">
                            <Input {...register(`actividadDocenteAdministrativa.${index}.data.dependenciaDecanaturaArea`)} placeholder="Dependencia" />
                            <Input {...register(`actividadDocenteAdministrativa.${index}.data.carreraInstituto`)} placeholder="Carrera" />
                            <Input {...register(`actividadDocenteAdministrativa.${index}.data.materiaCargo`)} placeholder="Materia/Cargo" />
                            <Input {...register(`actividadDocenteAdministrativa.${index}.data.categoriaDocenteAdministrativo`)} placeholder="Categoría" />
                            <Input {...register(`actividadDocenteAdministrativa.${index}.data.cargaHoraria`)} placeholder="Carga Horaria" />
                            <Input {...register(`actividadDocenteAdministrativa.${index}.data.dias`)} placeholder="Días" />
                            <Input {...register(`actividadDocenteAdministrativa.${index}.data.horasHorarios`)} placeholder="Horarios" />
                            <Input type="number" {...register(`actividadDocenteAdministrativa.${index}.data.totalGanadoBs`)} placeholder="Total Ganado Bs" />
                            <Button type="button" variant="destructive" onClick={() => removeDocente(index)}>Eliminar</Button>
                        </div>
                    ))}
                    <Button type="button" onClick={() => appendDocente({ data: {} })}>+ Añadir actividad docente</Button>
                </CardContent>
            </Card>

            {/* Actividad Extra Universitaria */}
            <Card>
                <CardHeader>
                    <CardTitle>III. Actividad Extra Universitaria</CardTitle>
                </CardHeader>
                <CardContent>
                    {extraFields.map((field, index) => (
                        <div key={field.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-xl mb-4">
                            <Input {...register(`actividadExtraUniversitaria.${index}.nombreInstitucion`)} placeholder="Institución" />
                            <Input {...register(`actividadExtraUniversitaria.${index}.nivelCargoOcupacional`)} placeholder="Cargo" />
                            <Select defaultValue={field.actividadPublicaPrivada} onValueChange={(v) => setValue(`actividadExtraUniversitaria.${index}.actividadPublicaPrivada`, v)}>
                                <SelectTrigger><SelectValue placeholder="Tipo" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="publica">Pública</SelectItem>
                                    <SelectItem value="privada">Privada</SelectItem>
                                </SelectContent>
                            </Select>
                            <Input {...register(`actividadExtraUniversitaria.${index}.diasLaborales`)} placeholder="Días Laborales" />
                            <Input {...register(`actividadExtraUniversitaria.${index}.tiempoCompletoCargaHoraria`)} placeholder="Carga Horaria" />
                            <Input type="number" {...register(`actividadExtraUniversitaria.${index}.totalGanado`)} placeholder="Total Ganado" />
                            <Button type="button" variant="destructive" onClick={() => removeExtra(index)}>Eliminar</Button>
                        </div>
                    ))}
                    <Button type="button" onClick={() => appendExtra({})}>+ Añadir actividad extra</Button>
                </CardContent>
            </Card>

            {/* Actividad Administrativa */}
            <Card>
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
                            <Input {...register(`actividadAdministrativa.${index}.diasHorarioFunciones`)} placeholder="Días/Horario" />
                            <Input {...register(`actividadAdministrativa.${index}.cargaHoraria`)} placeholder="Carga Horaria" />
                            <Input type="number" {...register(`actividadAdministrativa.${index}.totalGanado`)} placeholder="Total Ganado" />
                            <Button type="button" variant="destructive" onClick={() => removeAdmin(index)}>Eliminar</Button>
                        </div>
                    ))}
                    <Button type="button" onClick={() => appendAdmin({})}>+ Añadir actividad administrativa</Button>
                </CardContent>
            </Card>

            {/* Profesional Jubilado */}
            <Card>
                <CardHeader>
                    <CardTitle>V. Profesional Jubilado</CardTitle>
                </CardHeader>
                <CardContent>
                    {jubiladoFields.map((field, index) => (
                        <div key={field.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-xl mb-4">
                            <Input {...register(`profesionalJubilado.${index}.nombreInstitucion`)} placeholder="Institución" />
                            <Input {...register(`profesionalJubilado.${index}.nivelCargo`)} placeholder="Cargo" />
                            <Input type="date" {...register(`profesionalJubilado.${index}.fechaDeJubilacion`)} />
                            <Input type="number" {...register(`profesionalJubilado.${index}.montoTitular`)} placeholder="Monto Bs" />
                            <Button type="button" variant="destructive" onClick={() => removeJubilado(index)}>Eliminar</Button>
                        </div>
                    ))}
                    <Button type="button" onClick={() => appendJubilado({})}>+ Añadir jubilación</Button>
                </CardContent>
            </Card>

            {/* Otra Información */}
            <Card>
                <CardHeader>
                    <CardTitle>VI. Otra Información</CardTitle>
                </CardHeader>
                <CardContent>
                    {otraInfoFields.map((field, index) => (
                        <div key={field.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-xl mb-4">
                            <Textarea {...register(`otraInformacion.${index}.descripcionAdecuacionSalarial`)} placeholder="Descripción" />
                            <Input {...register(`otraInformacion.${index}.institucion`)} placeholder="Institución" />
                            <Input {...register(`otraInformacion.${index}.documentoRespaldo`)} placeholder="Documento" />
                            <Input type="number" {...register(`otraInformacion.${index}.montoDescuento`)} placeholder="Monto Descuento" />
                            <Button type="button" variant="destructive" onClick={() => removeOtra(index)}>Eliminar</Button>
                        </div>
                    ))}
                    <Button type="button" onClick={() => appendOtra({})}>
                        + Añadir otra información
                    </Button>
                </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex justify-between gap-4">
                <Button type="submit">
                    {declaracion?._id ? 'Actualizar Declaración Jurada' : 'Crear Declaración Jurada'}
                </Button>

                <Button asChild variant="link">
                    <Link>Atras</Link>
                </Button>
            </div>
        </form>
    );
};
