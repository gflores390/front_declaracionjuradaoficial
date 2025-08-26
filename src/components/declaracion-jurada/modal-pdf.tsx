"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "../ui/button";

interface ModalPDFProps {
    open: boolean;
    onClose: () => void;
    pdfUrl: string;
}

export default function ModalPDF({ open, onClose, pdfUrl }: ModalPDFProps) {
    return (
        <Dialog.Root open={open} onOpenChange={onClose}>
            <Dialog.Portal>
                {/* overlay oscuro también soporta modo */}
                <Dialog.Overlay className="fixed inset-0 bg-black/50 dark:bg-black/70" />

                <Dialog.Content
                    className="
            fixed inset-0 m-auto 
            w-[90vw] h-[90vh] 
            rounded shadow-lg p-4 flex flex-col 
            bg-white text-gray-900 
            dark:bg-gray-900 dark:text-gray-100
          "
                >
                    <div className="flex justify-between items-center mb-4">
                        <Dialog.Title className="text-lg font-bold">
                            Vista de la Declaración
                        </Dialog.Title>
                        <Button onClick={onClose} size="sm" variant="outline">
                            Cerrar
                        </Button>
                    </div>

                    <iframe
                        src={pdfUrl}
                        className="w-full h-full border rounded bg-white dark:bg-gray-800"
                        frameBorder={0}
                    />
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
