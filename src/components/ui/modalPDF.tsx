"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "./button";

interface ModalPDFProps {
    open: boolean;
    onClose: () => void;
    pdfUrl: string;
}

export default function ModalPDF({ open, onClose, pdfUrl }: ModalPDFProps) {
    return (
        <Dialog.Root open={open} onOpenChange={onClose}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                <Dialog.Content className="fixed inset-0 m-auto w-[90vw] h-[90vh] bg-white rounded shadow-lg p-4 flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <Dialog.Title className="text-lg font-bold">Vista del PDF</Dialog.Title>
                        <Button onClick={onClose} size="sm" variant="ghost">Cerrar</Button>
                    </div>
                    <iframe
                        src={pdfUrl}
                        className="w-full h-full border rounded"
                        frameBorder={0}
                    />
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
