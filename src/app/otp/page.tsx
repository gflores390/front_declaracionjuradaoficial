"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { OtpInput } from "@/components/declaracion-jurada/otp-input"
const URL = process.env.NEXT_PUBLIC_API_URL;
const WHAT = process.env.NEXT_PUBLIC_API_URL_WHAT;

export default function OtpPage() {
    const [ci, setCi] = useState("")
    const [step, setStep] = useState<"ci" | "confirm" | "otp">("ci")
    const [maskedPhone, setMaskedPhone] = useState("")
    const [otp, setOtp] = useState("")

    // Paso 1: Buscar usuario por CI
    const handleSearch = async ({ ci }: { ci: string }) => {
        const res = await fetch(`${URL}/declaracion-jurada/persona/${ci}`, {
            cache: "no-store"
        })
        console.log(res);
        const data = await res.json()
        if (data.celular) {
            setMaskedPhone(data.celular)
            setStep("confirm")
        } else {
            alert("No se encontró usuario con ese CI")
        }
    }

    // Paso 2: Confirmar y enviar OTP a WhatsApp
    const handleSendOtp = async () => {
        await fetch(`${WHAT}/declaracion-jurada/persona/${ci}`, {
            method: "POST",
            body: JSON.stringify({ ci }),
        })
        setStep("otp")
    }

    // Paso 3: Verificar OTP
    const handleVerifyOtp = async () => {
        const res = await fetch("/api/verify-otp", {
            method: "POST",
            body: JSON.stringify({ ci, otp }),
        })
        const data = await res.json()
        if (data.valid) alert("✅ Acceso concedido")
        else alert(data.error)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Card className="w-[400px] shadow-lg">
                {step === "ci" && (
                    <>
                        <CardHeader>
                            <CardTitle className="text-center text-xl">Buscar usuario</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <Input
                                type="number"
                                placeholder="Ingresa tu CI"
                                value={ci}
                                onChange={(e) => setCi(e.target.value)}
                            />
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" onClick={() => handleSearch({ ci })}>
                                Buscar
                            </Button>
                        </CardFooter>
                    </>
                )}

                {step === "confirm" && (
                    <>
                        <CardHeader>
                            <CardTitle className="text-center text-xl">Confirmar número</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center gap-4">
                            <p className="text-gray-600">Número encontrado: <b>{maskedPhone.replace(/^(\d{2})\d+(\d{2})$/, "$1XXXX$2")}</b></p>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" onClick={handleSendOtp}>
                                Enviar OTP a WhatsApp
                            </Button>
                        </CardFooter>
                    </>
                )}

                {step === "otp" && (
                    <>
                        <CardHeader>
                            <CardTitle className="text-center text-xl">Ingresa el OTP</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center gap-4">
                            <p className="text-gray-600 text-center">Código enviado a {maskedPhone.replace(/^(\d{2})\d+(\d{2})$/, "$1XXXX$2")}</p>
                            <OtpInput length={6} onChange={setOtp} />
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
