import { Button } from "@/components/ui/button"
import { LucidePlusCircle } from "lucide-react"
import { DeclaracionData } from "./declaracion-jurada.interface";
import { DeclaracionCard } from "@/components/ui/declaracion-card";
import { getDeclaracionJurada } from "./declaracion-jurada.api";
import Link from "next/link";
import { DeclaracionPagination } from "@/components/ui/declaracion-pagination";

interface Params {
    searchParams?: Promise<{
        offset: number;
        limit: number;
    }>
}

export default async function DeclaracionJurada({ searchParams }: Params) {
    const offset = Number((await searchParams)?.offset || 1);
    const limit = Number((await searchParams)?.limit || 10);
    console.log({ offset, limit });
    const { declaracionJurada, totalPages } = await getDeclaracionJurada({ offset, limit });
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

            <div>
                <DeclaracionPagination offset={offset} limit={limit} totalPages={totalPages} />
            </div>
        </div>
    )
}