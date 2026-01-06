import { DeclaracionData } from "../declaracion-jurada.interface";
import { getDeclaracion } from "../declaracion-jurada.api";
import { DeclaracionForm } from "@/components/declaracion-jurada/declaracion-form";
import { obtenerSesion } from "@/lib/session";
import { redirect } from 'next/navigation'

interface Params {
    params: Promise<{
        id: string;
    }>;
}

export default async function NuevaDeclaracionJurada({ params }: Params) {
    const id = (await params)?.id;

    // ✅ SI HAY ID, ES EDICIÓN -> VERIFICAR SESIÓN
    if (id && id !== 'null') {
        const session = await obtenerSesion()
        
        if (!session) {
            redirect('/')
        }
    }

    let data: DeclaracionData | undefined = undefined;

    if (id && id !== 'null') {
        try {
            data = await getDeclaracion(id);
        } catch (error: any) {
            console.warn("No se pudo obtener la declaración:", error.message);
            data = undefined;
        }
    }

    // ✅ RETORNAR DIRECTAMENTE EL COMPONENTE SIN WRAPPERS
    return <DeclaracionForm declaracion={data} />;
}

// ✅ CONFIGURACIÓN PARA REVALIDACIÓN
export const dynamic = 'force-dynamic';
export const revalidate = 0;