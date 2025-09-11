"use client"
import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { OtpInput } from "@/components/declaracion-jurada/otp-input"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { searchUserByCI, sendOtpApi, verificacionCi, verifyOtpApi } from "../../app/declaracion-jurada/declaracion-jurada.api"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, FilePlus } from "lucide-react"
import { set } from "react-hook-form"

export default function OtpComponent() {
    const router = useRouter()

    const [ci, setCi] = useState("")
    const [step, setStep] = useState<"ci" | "confirm" | "otp">("ci")
    const [maskedPhone, setMaskedPhone] = useState("")
    const [otp, setOtp] = useState("")
    const [timer, setTimer] = useState(0)
    const [userId, setUserId] = useState("")
    const [allowCreate, setAllowCreate] = useState(false)
    const [ciError, setCiError] = useState("")
    // Nuevo estado para celular ingresado por el usuario
    const [phone, setPhone] = useState("")
    const [persona, setPersona] = useState("")

    // ---- Paso 1: Buscar usuario por CI ----
    const handleSearch = async ({ ci }: { ci: string }) => {
        setCiError("")

        if (!ci.trim()) {
            setCiError("Por favor ingresa tu CI")
            return
        }

        if (ci.trim().length < 5) {
            setCiError("El CI debe tener al menos 5 dígitos")
            return
        }

        try {
            const data = await verificacionCi(ci)
            if (data.numero) {
                setMaskedPhone(data.numero)
                setUserId(data.declaracion)
                setPersona(data.persona)
                setStep("confirm")
                setAllowCreate(false)
            } else {
                setAllowCreate(true)
            }
        } catch (error: any) {
            setAllowCreate(true)
        }
    }

    // ---- Paso 2: Enviar OTP ----
    const sendOtp = async () => {
        try {
            if (!phone.trim()) {
                return toast.error("Por favor ingresa tu número de celular")
            }
            const data = await sendOtpApi(phone, persona)
            setTimer(data.otpInfo.duracionSegundos)
            setStep("otp")
        } catch (error: any) {
            toast.error(error.message || "Error al enviar OTP")
        }
    }

    // ---- Paso 3: Verificar OTP ----
    const handleVerifyOtp = async (code?: string) => {
        const otpToVerify = code ?? otp; // si no se pasa, usamos el estado
        try {
            const data = await verifyOtpApi(otpToVerify)
            if (!data.valido) {
                return toast.error(data.message || "OTP inválido, vuelva a enviar")
            }
            toast.success("Acceso concedido")
            router.push(`/declaracion-jurada/${userId}/edit`)
        } catch (error: any) {
            toast.error(error.message || "Error inesperado al verificar OTP")
        }
    }


    // ---- Cronómetro ----
    useEffect(() => {
        if (timer <= 0) return
        const interval = setInterval(() => setTimer((t) => t - 1), 1000)
        return () => clearInterval(interval)
    }, [timer])

    const handleResend = () => sendOtp()
    const handleCancel = () => {
        setCi("")
        setAllowCreate(false)
        setCiError("")
    }

    // ---- Render ----
    return (
        <Card className="w-[400px] shadow-lg dark:shadow-gray-700 transition-colors duration-300 align-middle mx-auto mt-10">
            {/* Paso CI */}
            {step === "ci" && (
                <>
                    <CardHeader>
                        <CardTitle className="text-center text-xl text-gray-900 dark:text-gray-100 transition-colors duration-300">
                            Buscar mi Carnet de Identidad
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        {!allowCreate ? (
                            <>
                                <Input
                                    type="text"
                                    placeholder="Ingresa tu CI"
                                    value={ci}
                                    onChange={(e) => setCi(e.target.value)}
                                    className="bg-gray-100 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 transition-colors duration-300"
                                />
                                {ciError && (
                                    <Alert className="border-red-400 bg-red-50 text-red-800 dark:bg-red-900/40 dark:text-red-200">
                                        <AlertTriangle className="h-4 w-4" />
                                        <AlertTitle>Error</AlertTitle>
                                        <AlertDescription>{ciError}</AlertDescription>
                                    </Alert>
                                )}
                            </>
                        ) : (
                            <Alert
                                className="border-yellow-400 bg-yellow-50 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200"
                            >
                                <AlertTriangle className="h-4 w-4" />
                                <AlertTitle>Atención</AlertTitle>
                                <AlertDescription>
                                    No se encontró un usuario con ese CI, puedes crear una nueva declaración.
                                </AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                    <CardFooter className="flex gap-3">
                        {!allowCreate ? (
                            <Button
                                className="bg-blue-700 hover:bg-blue-500 text-white px-6 py-3 rounded-lg text-lg w-full"
                                disabled={ci.trim().length < 5}
                                onClick={() => handleSearch({ ci })}
                            >
                                Buscar
                            </Button>
                        ) : (
                            <>
                                <Button
                                    className="w-1/2 bg-rose-100 hover:bg-rose-200 text-rose-700 font-medium px-4 py-2 rounded-lg text-sm transition-colors duration-300"
                                    onClick={handleCancel}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    className="w-1/2 bg-blue-700 hover:bg-blue-600 text-white font-semibold px-6 py-4 text-lg rounded-xl flex items-center justify-center gap-2 shadow-md transition-transform transform hover:scale-105"
                                    onClick={() => router.push(`/declaracion-jurada/nueva`)}
                                >
                                    Crear
                                    <FilePlus className="h-5 w-5 text-white transition-transform transform hover:scale-110" />
                                </Button>
                            </>
                        )}
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
                            Número encontrado: <b>{maskedPhone}</b>
                        </p>

                        <Input
                            type="tel"
                            placeholder="Ingresa tu número de celular"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="bg-gray-100 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 transition-colors duration-300"
                        />
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" onClick={sendOtp}>
                            Enviar Código a WhatsApp
                        </Button>
                    </CardFooter>
                </>
            )}

            {/* Paso OTP */}
            {step === "otp" && (
                <>
                    <CardHeader>
                        <CardTitle className="text-center text-xl text-gray-900 dark:text-gray-100 transition-colors duration-300">
                            Ingresa el Código
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-4">
                        <p className="text-gray-600 dark:text-gray-300 text-center transition-colors duration-300">
                            Código enviado a {maskedPhone}
                        </p>
                        <OtpInput
                            length={6}
                            onChange={(val) => {
                                setOtp(val)
                                if (val.length === 6) {
                                    handleVerifyOtp(val) // pasamos directamente el valor completo
                                }
                            }}
                        />

                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 transition-colors duration-300">
                            {timer > 0 ? `Reenviar el Código en ${timer}s` : "No recibiste el Código? "}
                            {timer <= 0 && (
                                <Button variant="link" size="sm" onClick={handleResend}>
                                    Reenviar
                                </Button>
                            )}
                        </p>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" disabled={otp.length < 6} onClick={() => handleVerifyOtp()}>
                            Verificar
                        </Button>
                    </CardFooter>
                </>
            )}
        </Card>
    )
}
