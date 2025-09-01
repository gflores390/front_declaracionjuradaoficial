
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DeclaracionData, Inputs } from "../declaracion-jurada.interface";
import { getDeclaracion } from "../declaracion-jurada.api";
import { DeclaracionForm } from "@/components/declaracion-jurada/declaracion-form";

interface Params {
    params: Promise<{
        id: string;
    }>;
}

export default async function NuevaDeclaracionJurada({ params }: Params) {
    const id = (await params)?.id;
    let data: DeclaracionData | undefined;
    if (id) {
        data = await getDeclaracion(id);
    }
    return (
        <div className="max-w-[1100px] w-full p-6 mx-auto">
            {/* <Card> */}
            {/* <CardHeader>
                    <CardTitle>Nueva Declaración Jurada</CardTitle>
                    <CardDescription>Complete el siguiente formulario para crear una nueva declaración jurada.</CardDescription>
                </CardHeader> */}
            {/* <CardContent> */}
            <DeclaracionForm declaracion={data} />
            {/* </CardContent> */}
            {/* </Card> */}
        </div >
    );
}
