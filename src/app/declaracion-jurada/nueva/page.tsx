"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { Inputs } from "../declaracion-jurada.interface";
import { Button } from "@/components/ui/button";
import { createDeclaracionJurada } from "../declaracion-jurada.api";
import { useRouter } from "next/navigation";
import { toast } from "sonner"
import Link from "next/link";

// todo: no nos funciona el crear pipip desde el min 1:14:00 a 1:19:00 
export default function NuevaDeclaracionJurada() {
    // Rutas: Para redireccionar
    const router = useRouter();
    // Es el Toast
    toast.success('Se creo la declaración jurada')

    const { register, handleSubmit, control, setValue } = useForm<Inputs>({
        defaultValues: {
            actividadDocenteAdministrativa: [{ data: {} }],
            actividadExtraUniversitaria: [{}],
            actividadAdministrativa: [{}],
            profesionalJubilado: [{}],
            otraInformacion: [{}],
        },
    });

    const { fields: docenteFields, append: appendDocente } = useFieldArray({
        control,
        name: "actividadDocenteAdministrativa",
    });

    const { fields: extraFields, append: appendExtra } = useFieldArray({
        control,
        name: "actividadExtraUniversitaria",
    });

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        // try {
        //     const response = await createDeclaracionJurada(data);
        //     console.log("Formulario enviado con éxito:", response);
        // Rutas: Para redireccionar a la ruta
        router.push("/declaracion-jurada");
        // } catch (error) {
        //     console.error("Error al enviar el formulario:", error);
        // }
    };

    return (
        <div className="max-w-[900px] w-full p-8 mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Nueva Declaración Jurada</CardTitle>
                    <CardDescription>Formulario para nueva declaración jurada.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        {/* Sección I: Datos Personales */}
                        <div>
                            <h2 className="text-xl font-semibold mb-4">I. Datos Personales</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nombres">Nombres</Label>
                                    <Input {...register("datosPersonales.nombres", { required: true })} placeholder="Ej. Belen Paredes" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="paterno">Apellido Paterno</Label>
                                    <Input {...register("datosPersonales.paterno", { required: true })} placeholder="Ej. Cabrera" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="materno">Apellido Materno</Label>
                                    <Input {...register("datosPersonales.materno", { required: true })} placeholder="Ej. Apellido" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="apellidoCasada">Apellido de Casada</Label>
                                    <Input {...register("datosPersonales.apellidoCasada")} placeholder="Opcional" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="fechaNacimiento">Fecha de Nacimiento</Label>
                                    <Input {...register("datosPersonales.fechaNacimiento", { required: true })} type="date" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tipoDocumento">Tipo de Documento</Label>
                                    <Select onValueChange={value => setValue("datosPersonales.documentoIdentidad.tipo", value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione un tipo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="CI">Cédula de Identidad (CI)</SelectItem>
                                            <SelectItem value="Pasaporte">Pasaporte</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="numeroDocumento">Número de Documento</Label>
                                    <Input {...register("datosPersonales.documentoIdentidad.numero", { required: true })} placeholder="Ej. 6789012 LP" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="expedido">Expedido</Label>
                                    <Select onValueChange={value => setValue("datosPersonales.documentoIdentidad.expedido", value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione un lugar" />
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
                                {/* Resto de campos de dirección y contacto... */}
                            </div>
                        </div>

                        {/* Sección II: Actividad Docente y Administrativa */}
                        <div className="pt-8">
                            <h2 className="text-xl font-semibold mb-4">II. Actividad Docente y/o Administrativa en la UPEA</h2>
                            {docenteFields.map((item, index) => (
                                <div key={item.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-md mb-4">
                                    <div className="space-y-2">
                                        <Label>Dependencia, Decanatura, Área</Label>
                                        <Input {...register(`actividadDocenteAdministrativa.${index}.data.dependenciaDecanaturaArea`)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Carrera, Instituto</Label>
                                        <Input {...register(`actividadDocenteAdministrativa.${index}.data.carreraInstituto`)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Materia, Sigla, Cargo</Label>
                                        <Input {...register(`actividadDocenteAdministrativa.${index}.data.materiaCargo`)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Categoría</Label>
                                        <Input {...register(`actividadDocenteAdministrativa.${index}.data.categoriaDocenteAdministrativo`)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Carga Horaria</Label>
                                        <Input {...register(`actividadDocenteAdministrativa.${index}.data.cargaHoraria`)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Días</Label>
                                        <Input {...register(`actividadDocenteAdministrativa.${index}.data.dias`)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Horas / Horarios</Label>
                                        <Input {...register(`actividadDocenteAdministrativa.${index}.data.horasHorarios`)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Total Ganado (Bs)</Label>
                                        <Input {...register(`actividadDocenteAdministrativa.${index}.data.totalGanadoBs`)} />
                                    </div>
                                </div>
                            ))}
                            <Button type="button" onClick={() => appendDocente({ data: {} })}>Agregar otra actividad</Button>
                        </div>

                        {/* Sección III: Actividad Extra-Universitaria */}
                        <div className="pt-8">
                            <h2 className="text-xl font-semibold mb-4">III. Actividad Extra-Universitaria</h2>
                            {extraFields.map((item, index) => (
                                <div key={item.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-md mb-4">
                                    <div className="space-y-2">
                                        <Label>Nombre Institución</Label>
                                        <Input {...register(`actividadExtraUniversitaria.${index}.nombreInstitucion`)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Nivel o Cargo Ocupacional</Label>
                                        <Input {...register(`actividadExtraUniversitaria.${index}.nivelCargoOcupacional`)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Actividad Pública o Privada</Label>
                                        <Select onValueChange={value => setValue(`actividadExtraUniversitaria.${index}.actividadPublicaPrivada`, value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccione una opción" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="publica">Pública</SelectItem>
                                                <SelectItem value="privada">Privada</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Días Laborales</Label>
                                        <Input {...register(`actividadExtraUniversitaria.${index}.diasLaborales`)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Tiempo Completo / Carga Horaria</Label>
                                        <Input {...register(`actividadExtraUniversitaria.${index}.tiempoCompletoCargaHoraria`)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Total Ganado (Bs)</Label>
                                        <Input {...register(`actividadExtraUniversitaria.${index}.totalGanado`)} />
                                    </div>
                                </div>
                            ))}
                            <Button type="button" onClick={() => appendExtra({})}>Agregar otra actividad extra</Button>
                        </div>

                        {/* Botón de envío */}
                        <div className="flex justify-between gap-4">
                            <Button type="submit">Crear Declaración Jurada</Button>

                            <Button asChild variant="secondary">
                                <Link href={"/declaracion-jurada"}>Atrás</Link>
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
