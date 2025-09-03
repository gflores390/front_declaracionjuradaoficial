"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { OtpInput } from "@/components/declaracion-jurada/otp-input"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const URL = process.env.NEXT_PUBLIC_API_URL


export default function OtpPage() {
    const router = useRouter()

    const [ci, setCi] = useState("")
    const [step, setStep] = useState<"ci" | "confirm" | "otp">("ci")
    const [maskedPhone, setMaskedPhone] = useState("")
    const [otp, setOtp] = useState("")
    const [timer, setTimer] = useState(0)
    const [userId, setUserId] = useState("") // Para guardar el ID del usuario
    const [allowCreate, setAllowCreate] = useState(false)

    // ---- Paso 1: Buscar usuario por CI ----
    const handleSearch = async ({ ci }: { ci: string }) => {
        try {
            const res = await fetch(`${URL}/declaracion-jurada/persona/${ci}`,
                { cache: "no-store" });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.message || "Ocurrió un error en el servidor");
                setAllowCreate(true);
                return;
            }
            if (data.datosPersonales?.celular) {
                setMaskedPhone(data.datosPersonales.celular);
                setUserId(data._id);
                setStep("confirm");
                setAllowCreate(false);
            } else {
                toast.error("No se encontró usuario con ese numero");
            }
        } catch (error: any) {
            toast.error(error.message || "Error al buscar usuario por CI");
        }
    };

    // ---- Paso 2: Enviar OTP ----
    const sendOtp = async () => {
        try {
            const response = await fetch(`${URL}/declaracion-jurada/otp/enviar`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ celular: maskedPhone }),
            });
            const data = await response.json();
            if (!response.ok) {
                toast.error(data.message || "Error al enviar OTP");
                return;
            }
            setTimer(data.otpInfo.duracionSegundos)
            setStep("otp");
        } catch (error) {

        }

    }

    // ---- Paso 3: Verificar OTP ----
    const handleVerifyOtp = async () => {
        try {
            const response = await fetch(`${URL}/declaracion-jurada/otp/verificar`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ codigo: otp }),
            });

            const data = await response.json();

            if (!response.ok || !data.valido) {
                return toast.error(data.message || "OTP inválido, vuelva a enviar");
            }

            toast.success("Acceso concedido");
            router.push(`/declaracion-jurada/${userId}/edit`);
        } catch (error: any) {
            toast.error(error.message || "Error inesperado al verificar OTP");
        }
    };

    // ---- Cronómetro ----
    useEffect(() => {
        if (timer <= 0) return
        const interval = setInterval(() => setTimer((t) => t - 1), 1000)
        return () => clearInterval(interval)
    }, [timer])

    const handleResend = () => sendOtp()

    // ---- Render ----
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Card className="w-[400px] shadow-lg dark:shadow-gray-700 bg-white dark:bg-gray-800 transition-colors duration-300">
                {/* Paso CI */}
                {step === "ci" && (
                    <>
                        <CardHeader>
                            <CardTitle className="text-center text-xl text-gray-900 dark:text-gray-100 transition-colors duration-300">
                                Buscar usuario
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <Input
                                type="number"
                                placeholder="Ingresa tu CI"
                                value={ci}
                                onChange={(e) => setCi(e.target.value)}
                                className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 transition-colors duration-300"
                            />
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full"
                                onClick={() =>
                                    allowCreate
                                        ? router.push(`/declaracion-jurada/nueva`)
                                        : handleSearch({ ci })
                                }
                            >
                                {allowCreate ? "Crear declaración" : "Buscar"}
                            </Button>
                        </CardFooter>
                    </>
                )}

                {/* Paso Confirmar */}
                {step === "confirm" && (
                    <>
                        <CardHeader>
                            <CardTitle className="text-center text-xl text-gray-900 dark:text-gray-100 transition-colors duration-300">
                                Confirmar número
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center gap-4">
                            <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                                Número encontrado:{" "}
                                <b>{maskedPhone.replace(/^(\d{2})\d+(\d{2})$/, "$1XXXX$2")}</b>
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" onClick={sendOtp}>
                                Enviar OTP a WhatsApp
                            </Button>
                        </CardFooter>
                    </>
                )}

                {/* Paso OTP */}
                {step === "otp" && (
                    <>
                        <CardHeader>
                            <CardTitle className="text-center text-xl text-gray-900 dark:text-gray-100 transition-colors duration-300">
                                Ingresa el OTP
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center gap-4">
                            <p className="text-gray-600 dark:text-gray-300 text-center transition-colors duration-300">
                                Código enviado a {maskedPhone.replace(/^(\d{2})\d+(\d{2})$/, "$1XXXX$2")}
                            </p>
                            <OtpInput length={6} onChange={setOtp} />
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 transition-colors duration-300">
                                {timer > 0 ? `Reenviar OTP en ${timer}s` : "No recibiste el código? "}
                                {timer <= 0 && (
                                    <Button variant="link" size="sm" onClick={handleResend}>
                                        Reenviar
                                    </Button>
                                )}
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" disabled={otp.length < 6} onClick={handleVerifyOtp}>
                                Verificar
                            </Button>
                        </CardFooter>
                    </>
                )}
            </Card>
        </div>
    )
}
