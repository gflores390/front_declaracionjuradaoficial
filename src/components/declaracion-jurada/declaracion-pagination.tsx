"use client";

import { LucideChevronLeft, LucideChevronRight } from "lucide-react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Button } from "../ui/button";

interface Props {
    offset: number;
    limit: number;
    totalPages: number;
}

export const DeclaracionPagination = ({ offset, totalPages, limit }: Props) => {
    const searchParams = useSearchParams();
    const pathName = usePathname();
    const router = useRouter();

    useEffect(() => {
        handlePage(offset);
    }, []);

    const handlePage = (offset: number) => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("offset", offset.toString());
        newSearchParams.set("limit", limit.toString());
        router.replace(`${pathName}/?${newSearchParams.toString()}`);
    };

    return (
        <div className="flex justify-center items-center gap-8">
            <Button
                variant="ghost"
                disabled={offset === 1}
                onClick={() => handlePage(offset - 1)}
            >
                <LucideChevronLeft />
            </Button>
            <span className="font-bold">
                Página {offset} de {totalPages}
            </span>

            <Button
                variant="ghost"
                disabled={offset === totalPages}
                onClick={() => handlePage(offset + 1)}
            >
                <LucideChevronRight />
            </Button>
        </div>
    );
};