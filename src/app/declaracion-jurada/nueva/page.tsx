"use client"; // ← importante
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm, SubmitHandler } from "react-hook-form";
import { Inputs } from "../declaracion-jurada.interface";
import { Button } from "@/components/ui/button";

export default function NuevaDeclaracionJurada() {

    // para el formulario
    const { register, handleSubmit, setValue } = useForm<Inputs>();
    const handleChange = (tipoDocumento: string) => {
        setValue("datosPersonales.tipoDocumento", tipoDocumento);
    }
    // muestra los datos en la consola del formulario
    const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data)
    return (
        <div className="max-w-[600px] w-full p-8 mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Nueva Declaración Jurada</CardTitle>
                    <CardDescription>
                        <CardTitle>Formulario para nueva declaración jurada.</CardTitle>
                    </CardDescription>
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
                                    <Select onValueChange={handleChange}>
                                        <SelectTrigger id="datosPersonales.tipoDocumento.tipo">
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
                                    <Input {...register("datosPersonales.tipoDocumento.numero", { required: true })} placeholder="Ej. 6789012 LP" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="expedido">Expedido</Label>
                                    <Select {...register("datosPersonales.tipoDocumento.expedido", { required: true })} onValueChange={value => setValue("datosPersonales.tipoDocumento.expedido", value)}>
                                        <SelectTrigger id="expedido">
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
                                <div className="space-y-2">
                                    <Label htmlFor="zona">Zona</Label>
                                    <Input {...register("datosPersonales.direccion.zona")} placeholder="Ej. Obrajes" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="avenida">Avenida</Label>
                                    <Input {...register("datosPersonales.direccion.avenida")} placeholder="Ej. Av. Hernando Siles" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="calle">Calle</Label>
                                    <Input {...register("datosPersonales.direccion.calle")} placeholder="Opcional" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="numeroDomicilio">Número Domicilio</Label>
                                    <Input {...register("datosPersonales.direccion.numeroDomicilio")} placeholder="Ej. 123" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="telefonoDomicilio">Teléfono Domicilio</Label>
                                    <Input {...register("datosPersonales.telefonoDomicilio")} placeholder="Opcional" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="celular">Número Celular</Label>
                                    <Input {...register("datosPersonales.celular")} placeholder="Ej. 61122334" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="correoElectronico">Correo Electrónico</Label>
                                    <Input {...register("datosPersonales.correoElectronico", { required: true })} type="email" placeholder="Ej. nombre@ejemplo.com" />
                                </div>
                            </div>
                        </div>

                        {/* Sección II: Actividad Docente y/o Administrativa en la UPEA */}
                        <div className="pt-8">
                            <h2 className="text-xl font-semibold mb-4">II. Actividad Docente y/o Administrativa en la UPEA</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="dependencia">Dependencia, Decanatura, Área</Label>
                                    <Input id="dependencia" name="dependencia" placeholder="Ej. Facultad de Medicina" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="carrera">Carrera, Instituto</Label>
                                    <Input id="carrera" name="carrera" placeholder="Ej. Medicina" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="materiaCargo">Materia, Sigla, Cargo</Label>
                                    <Input id="materiaCargo" name="materiaCargo" placeholder="Ej. Anatomía" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="categoria">Categoría</Label>
                                    <Input id="categoria" name="categoria" placeholder="Ej. Docente Titular" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cargaHoraria">Carga Horaria</Label>
                                    <Input id="cargaHoraria" name="cargaHoraria" placeholder="Ej. 25 Horas" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="dias">Días</Label>
                                    <Input id="dias" name="dias" placeholder="Ej. Lunes a Viernes" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="horasHorarios">Horas / Horarios</Label>
                                    <Input id="horasHorarios" name="horasHorarios" placeholder="Ej. 08:00 - 13:00" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="totalGanadoUpea">Total Ganado (Bs)</Label>
                                    <Input id="totalGanadoUpea" name="totalGanadoUpea" placeholder="Ej. 8200" />
                                </div>
                            </div>
                        </div>

                        {/* Sección III: Actividad Extra-Universitaria */}
                        <div className="pt-8">
                            <h2 className="text-xl font-semibold mb-4">III. Actividad Extra-Universitaria</h2>
                            <p className="text-sm text-gray-500 mb-4">
                                Llenar con la actividad que realiza fuera de la UPEA.
                            </p>
                            {/* Puedes replicar este bloque para cada actividad extra */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-md">
                                <div className="space-y-2">
                                    <Label htmlFor="institucionExtra">Nombre Institución</Label>
                                    <Input id="institucionExtra" name="institucionExtra" placeholder="Ej. Hospital Obrero" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nivelCargoExtra">Nivel o Cargo Ocupacional</Label>
                                    <Input id="nivelCargoExtra" name="nivelCargoExtra" placeholder="Ej. Médico General" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="actividadTipoExtra">Actividad Pública o Privada</Label>
                                    <Select>
                                        <SelectTrigger id="actividadTipoExtra">
                                            <SelectValue placeholder="Seleccione una opción" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="publica">Pública</SelectItem>
                                            <SelectItem value="privada">Privada</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="diasLaboralesExtra">Días Laborales</Label>
                                    <Input id="diasLaboralesExtra" name="diasLaboralesExtra" placeholder="Ej. Lunes a Sábado" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tiempoCargaHorariaExtra">Tiempo Completo / Carga Horaria</Label>
                                    <Input id="tiempoCargaHorariaExtra" name="tiempoCargaHorariaExtra" placeholder="Ej. 48 horas semanales" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="totalGanadoExtra">Total Ganado (Bs)</Label>
                                    <Input id="totalGanadoExtra" name="totalGanadoExtra" placeholder="Ej. 9000" />
                                </div>
                            </div>
                        </div>

                        {/* Sección IV: Actividad Administrativa en otras instituciones */}
                        <div className="pt-8">
                            <h2 className="text-xl font-semibold mb-4">IV. Actividad Administrativa en Otras Instituciones</h2>
                            <p className="text-sm text-gray-500 mb-4">
                                Llenar solo si aplica.
                            </p>
                            {/* Puedes replicar este bloque para cada actividad administrativa */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-md">
                                <div className="space-y-2">
                                    <Label htmlFor="institucionAdm">Nombre Institución</Label>
                                    <Input id="institucionAdm" name="institucionAdm" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nivelCargoAdm">Nivel o Cargo Ocupacional</Label>
                                    <Input id="nivelCargoAdm" name="nivelCargoAdm" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="actividadTipoAdm">Actividad Pública o Privada</Label>
                                    <Select>
                                        <SelectTrigger id="actividadTipoAdm">
                                            <SelectValue placeholder="Seleccione una opción" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="publica">Pública</SelectItem>
                                            <SelectItem value="privada">Privada</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="modalidadContrato">Modalidad de Contrato</Label>
                                    <Input id="modalidadContrato" name="modalidadContrato" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="diasHorarioAdm">Días y Horario de Funciones</Label>
                                    <Input id="diasHorarioAdm" name="diasHorarioAdm" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cargaHorariaAdm">Carga Horaria</Label>
                                    <Input id="cargaHorariaAdm" name="cargaHorariaAdm" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="totalGanadoAdm">Total Ganado</Label>
                                    <Input id="totalGanadoAdm" name="totalGanadoAdm" />
                                </div>
                            </div>
                        </div>

                        {/* Sección V: Profesional Jubilado y Otra Información */}
                        <div className="pt-8">
                            <h2 className="text-xl font-semibold mb-4">V. Profesional Jubilado y Otra Información</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="institucionJubilado">Nombre Institución</Label>
                                    <Input id="institucionJubilado" name="institucionJubilado" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nivelCargoJubilado">Nivel o Cargo</Label>
                                    <Input id="nivelCargoJubilado" name="nivelCargoJubilado" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="fechaJubilacion">Fecha de Jubilación</Label>
                                    <Input id="fechaJubilacion" name="fechaJubilacion" type="date" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="montoTitular">Monto Titular</Label>
                                    <Input id="montoTitular" name="montoTitular" />
                                </div>
                            </div>
                            <div className="mt-4 space-y-2">
                                <Label htmlFor="otraInformacion">Otra Información</Label>
                                <Textarea id="otraInformacion" name="otraInformacion" placeholder="Descripción de la adecuación salarial, descuentos, etc." />
                            </div>
                        </div>

                        {/* Fecha del Formulario */}
                        <div className="pt-8">
                            <h2 className="text-xl font-semibold mb-4">Información del Formulario</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fechaFormulario">Fecha de Llenado</Label>
                                    <Input id="fechaFormulario" name="fechaFormulario" type="date" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="usuario">Usuario</Label>
                                    <Input id="usuario" name="usuario" placeholder="Nombre de usuario" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <Button type="submit">Crear Declaración Jurada</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}