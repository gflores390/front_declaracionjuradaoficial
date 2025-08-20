import { Button } from "@/components/ui/button"
import { LucidePlusCircle } from "lucide-react"
import { DeclaracionData } from "./declaracion-jurada.interface";
import { DeclaracionCard } from "@/components/ui/declaracion-card";
import { getDeclaracionJurada } from "./declaracion-jurada.api";
import Link from "next/link";

export default async function DeclaracionJurada() {
    // const declaracionJurada: DeclaracionData[] = [{
    //     _id: "66c4a307e5c5f377c8e7e174",
    //     datosPersonales: {
    //         documentoIdentidad: {
    //             tipo: "C.I.",
    //             numero: "8521570",
    //             expedido: "LP"
    //         },
    //         nombres: "Barbara Nardy",
    //         paterno: "Arias",
    //         materno: "Mendieta",
    //         apellidoCasada: "",
    //         fechaNacimiento: new Date("1988-05-15T00:00:00.000Z"),
    //         direccion: {
    //             zona: "Villa Copacabana",
    //             urbanizacion: "Sin urbanización",
    //             avenida: "Av. La Paz",
    //             calle: "Calle 14 de Septiembre",
    //             numeroDomicilio: "456"
    //         },
    //         telefonoDomicilio: "2245678",
    //         celular: "77788990",
    //         correoElectronico: "barbara.arias@email.com"
    //     },
    //     actividadDocenteAdministrativa: [
    //         {
    //             data: {
    //                 dependenciaDecanaturaArea: "FACULTAD DE CIENCIAS ECONÓMICAS",
    //                 carreraInstituto: "CONTADURÍA PÚBLICA",
    //                 materiaCargo: "ANÁLISIS DE COSTOS",
    //                 categoriaDocenteAdministrativo: "DOCENTE TITULAR",
    //                 cargaHoraria: "12 HORAS",
    //                 dias: "MIÉRCOLES",
    //                 horasHorarios: "19:00-22:00",
    //                 totalGanadoBs: "3500"
    //             },
    //             bonoDeAntiguedad: "300",
    //             totalGanadoTotalBs: "3800"
    //         }
    //     ],
    //     actividadExtraUniversitaria: [
    //         {
    //             nombreInstitucion: "Consultoría Privada",
    //             nivelCargoOcupacional: "Asesora Financiera",
    //             actividadPublicaPrivada: "Privada",
    //             diasLaborales: "Martes y Jueves",
    //             tiempoCompletoCargaHoraria: "10 horas semanales",
    //             totalGanado: "1500"
    //         }
    //     ],
    //     actividadAdministrativa: [
    //         {
    //             nombreInstitucion: "Universidad Privada X",
    //             nivelCargoOcupacional: "Jefa de Planificación Académica",
    //             actividadPublicaPrivada: "Privada",
    //             modalidadContrato: "Indefinido",
    //             diasHorarioFunciones: "Lunes a Viernes",
    //             cargaHoraria: "40 horas",
    //             totalGanado: "8000"
    //         }
    //     ],
    //     profesionalJubilado: [],
    //     otraInformacion: [
    //         {
    //             descripcionAdecuacionSalarial: "Descuento por seguro de salud",
    //             institucion: "Caja Nacional de Salud",
    //             documentoRespaldo: "N/A",
    //             montoDescuento: "200"
    //         }
    //     ],
    //     formulario: {
    //         formulario: "Declaración Jurada de Actividades",
    //         usuario: "Barbara Nardy Arias Mendieta",
    //         fecha: new Date()
    //     },
    //     __v: 1
    // }];
    const declaracionJurada = await getDeclaracionJurada();
    return (
        <div className="max-w-screen-lg mx-auto p-8">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Declaración Jurada</h1>
                <Button asChild>
                    <Link href="/declaracion-jurada/nueva" >
                        Declarar <LucidePlusCircle />
                    </Link>
                </Button>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {
                    declaracionJurada.map((declaracion) => (
                        <DeclaracionCard key={declaracion._id} declaracion={declaracion} />
                    ))
                }
            </div>
        </div>
    )
}