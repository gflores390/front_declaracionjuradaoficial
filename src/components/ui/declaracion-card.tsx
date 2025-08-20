import { DeclaracionData } from "@/app/declaracion-jurada/declaracion-jurada.interface";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "./badge";

export function DeclaracionCard({ declaracion }: { declaracion: DeclaracionData }) {
    const fechaFormulario = declaracion.formulario.fecha
        ? new Intl.DateTimeFormat('es-ES', { weekday: 'long', month: 'long', year: 'numeric' })
            .format(new Date(declaracion.formulario.fecha))
        : "-";

    return (<Card>
        <CardHeader>
            <CardTitle>Datos Personales</CardTitle>
            <CardDescription>Descripcion de la Persona</CardDescription>
            <CardAction>{fechaFormulario}</CardAction>
        </CardHeader>
        <CardContent>
            <p>{declaracion.datosPersonales.nombres} {declaracion.datosPersonales.paterno} {declaracion.datosPersonales.materno}</p>
            <p>{declaracion.datosPersonales.documentoIdentidad.numero}</p>
            <p>{declaracion.datosPersonales.documentoIdentidad.expedido}</p>
            <p>{fechaFormulario}</p>
            <p>{declaracion.datosPersonales.direccion.zona}</p>
            <p>{declaracion.datosPersonales.direccion.urbanizacion}</p>
            <p>{declaracion.datosPersonales.direccion.avenida}</p>
            <p>{declaracion.datosPersonales.direccion.calle}</p>
            <p>{declaracion.datosPersonales.direccion.numeroDomicilio}</p>
            <p>{declaracion.datosPersonales.telefonoDomicilio}</p>
            <p>{declaracion.datosPersonales.celular}</p>
            <p>{declaracion.datosPersonales.correoElectronico}</p>
            <p>Casada: </p> <Badge  >{declaracion.datosPersonales.documentoIdentidad.expedido}</Badge>
        </CardContent>
        <CardFooter>
            <p className="text-sm text-muted-foreground">Usuario: {declaracion.formulario.usuario}</p>
        </CardFooter>
    </Card>);
};