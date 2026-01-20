"use client";
import { useState, useEffect, useRef } from "react"
import type React from "react"

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { sendOtpApi, verificacionCi, verifyOtpApi } from "../../app/declaracion-jurada/declaracion-jurada.api"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, FilePlus } from "lucide-react"

export default function OtpComponent() {
  const router = useRouter()

  const [ci, setCi] = useState("")
  const [step, setStep] = useState<"ci" | "confirm" | "otp">("ci")
  const [maskedPhone, setMaskedPhone] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [timer, setTimer] = useState(0)
  const [userId, setUserId] = useState("")
  const [allowCreate, setAllowCreate] = useState(false)
  const [ciError, setCiError] = useState("")
  const [phone, setPhone] = useState("")
  const [persona, setPersona] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [autoVerifyTimer, setAutoVerifyTimer] = useState(0)
  const [otpValid, setOtpValid] = useState(false)
  const verifyingRef = useRef(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const phoneInputRef = useRef<HTMLInputElement>(null)
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    const isComplete = otp.every((d) => d !== "")
    if (isComplete && !isLoading) {
      const timeout = setTimeout(() => {
        handleVerifyOtp()
      }, 500)
      return () => clearTimeout(timeout)
    }
  }, [otp, isLoading])

  useEffect(() => {
    if (step === "ci" && inputRef.current) {
      inputRef.current.focus()
    } else if (step === "confirm" && phoneInputRef.current) {
      phoneInputRef.current.focus()
    } else if (step === "otp" && otpRefs.current[0]) {
      otpRefs.current[0]?.focus()
    }
  }, [step])

  const handleSearch = async ({ ci }: { ci: string }) => {
    setCiError("")
    setIsLoading(true)

    if (!ci.trim()) {
      setCiError("Por favor ingresa tu CI")
      setIsLoading(false)
      return
    }

    if (ci.trim().length < 5) {
      setCiError("El CI debe tener al menos 5 dígitos")
      setIsLoading(false)
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
        if (data.telefono) {
          setPhone(data.telefono)
        }
      } else {
        setAllowCreate(true)
      }
    } catch (error: unknown) {
      setAllowCreate(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (step === "ci" && !isLoading && ci.trim().length >= 5) {
        handleSearch({ ci })
      } else if (step === "confirm" && phone.trim() && !isLoading) {
        sendOtp()
      }
    }
  }

  const sendOtp = async () => {
    setIsLoading(true)
    try {
      if (!phone.trim()) {
        toast.error("Por favor ingresa tu número de celular")
        return
      }
      const data = await sendOtpApi(phone, persona)
      setTimer(data.otpInfo.duracionSegundos)
      setStep("otp")
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error al enviar código"
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    } else if (e.key === "ArrowLeft" && index > 0) {
      otpRefs.current[index - 1]?.focus()
    } else if (e.key === "ArrowRight" && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "")
    if (pasteData.length >= 6) {
      const digits = pasteData.slice(0, 6).split("")
      setOtp(digits)
    }
  }

  const handleVerifyOtp = async () => {
    if (verifyingRef.current) {
      return
    }
    verifyingRef.current = true
    const otpToVerify = otp.join("")
    setIsLoading(true)

    try {
      const data = await verifyOtpApi(otpToVerify)
      if (!data.valido) {
        toast.error(data.message || "Código inválido, vuelve a intentarlo")
        return
      }
      const sessionModule = await import('@/lib/session')
      const { crearSesion } = sessionModule
      await crearSesion(userId, ci)
      await new Promise(resolve => setTimeout(resolve, 500))
      toast.success("¡Acceso concedido!")
      if (userId) {
        router.push(`/declaracion-jurada/${userId}/edit`)
      } else {
        router.push(`/declaracion-jurada/nueva`)
      }
      router.refresh()
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error al verificar código"
      toast.error(errorMessage)
      setOtpValid(false)
      setOtp(["", "", "", "", "", ""])
      setAutoVerifyTimer(0)
      setTimeout(() => {
        otpRefs.current[0]?.focus()
      }, 100)
    } finally {
      setIsLoading(false)
      verifyingRef.current = false
    }
  }

  useEffect(() => {
    if (timer <= 0) return
    const interval = setInterval(() => {
      setTimer((t) => t - 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [timer])

  const handleResend = () => sendOtp()

  const handleCancel = () => {
    setCi("")
    setAllowCreate(false)
    setCiError("")
    setPhone("")
    setPersona("")
    setMaskedPhone("")
    setOtp(["", "", "", "", "", ""])
    setTimer(0)
    setStep("ci")
  }

  return (
    <div className="w-full px-4 sm:px-0">
      <Card
        className="w-full max-w-[400px] mx-auto mt-4 sm:mt-10 shadow-lg transition-colors duration-300 
                           bg-white/80 dark:bg-blue-900/40 
                           dark:shadow-blue-800/50 border border-blue-200 dark:border-blue-700"
      >
      {step === "ci" && (
        <>
          <CardHeader
              className="
                text-center rounded-t-lg
                bg-transparent
                dark:bg-gradient-to-r 
                px-4 sm:px-6
              "
            >
            <CardTitle className="text-lg sm:text-xl font-semibold 
            text-blue-700
            dark:text-white">
              Buscar mi Carnet de Identidad
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 px-4 sm:px-6">
            {!allowCreate ? (
              <>
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="Ingresa tu CI"
                  value={ci}
                  onChange={(e) => setCi(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="bg-white dark:bg-blue-950 text-gray-900 dark:text-white 
                                         border-2 border-blue-300 dark:border-blue-600 transition-colors duration-300
                                         focus:border-blue-600 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800
                                         text-base"
                  disabled={isLoading}
                />
                {ciError && (
                  <Alert className="border-red-400 bg-red-50 dark:bg-red-900/40 text-red-800 dark:text-red-200 dark:border-red-600">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription className="text-sm">{ciError}</AlertDescription>
                  </Alert>
                )}
              </>
            ) : (
              <Alert className="border-yellow-400 bg-yellow-50 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200 dark:border-yellow-600">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Atención</AlertTitle>
                <AlertDescription className="text-sm">
                  No se encontró un usuario con ese CI, puedes crear una nueva declaración.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>

          <CardFooter className="flex gap-2 px-4 sm:px-6">
            {!allowCreate ? (
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700
                                         text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg text-base sm:text-lg transition-colors duration-300 font-semibold"
                disabled={ci.trim().length < 5 || isLoading}
                onClick={() => handleSearch({ ci })}
              >
                {isLoading ? "Buscando..." : "Buscar"}
              </Button>
            ) : (
              <>
                <Button
                  className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 
                                             text-gray-800 dark:text-gray-200 font-medium px-2 sm:px-3 py-2 rounded-lg text-sm 
                                             transition-colors duration-300"
                  onClick={handleCancel}
                >
                  Cancelar
                </Button>
                <Button
                  className="flex-1 px-2 sm:px-3 py-2 text-white text-sm rounded-lg transition-colors duration-300 
                                             bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 font-semibold
                                             flex items-center justify-center gap-1"
                  onClick={() => router.push(`/declaracion-jurada/nueva`)}
                >
                  <span className="truncate">Crear</span>
                  <FilePlus className="h-4 w-4 text-white flex-shrink-0" />
                </Button>
              </>
            )}
          </CardFooter>
        </>
      )}

      {step === "confirm" && (
        <>
          <CardHeader
              className="
                text-center text-lg sm:text-xl font-semibold
                text-blue-700
                dark:text-white
                px-4 sm:px-6
              "
            >
            <CardTitle className="text-lg sm:text-xl font-semibold
      text-blue-700
      dark:text-white">
              Confirmar número
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col items-center gap-4 px-4 sm:px-6">
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 transition-colors duration-300 text-center">
              Número encontrado: <b className="text-blue-600 dark:text-blue-400 break-all">{maskedPhone}</b>
            </p>

            <Input
              ref={phoneInputRef}
              type="tel"
              placeholder="Ingresa tu número de celular"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onKeyPress={handleKeyPress}
              className="bg-white dark:bg-blue-950 text-gray-900 dark:text-white 
                                     border-2 border-blue-300 dark:border-blue-600 transition-colors duration-300
                                     focus:border-blue-600 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800
                                     text-base"
              disabled={isLoading}
            />
          </CardContent>

          <CardFooter className="px-4 sm:px-6">
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700
                                     text-white transition-colors duration-300 font-semibold py-2.5 sm:py-3 text-sm sm:text-base"
              onClick={sendOtp}
              disabled={!phone.trim() || isLoading}
            >
              {isLoading ? "Enviando..." : "Enviar Código a WhatsApp"}
            </Button>
          </CardFooter>
        </>
      )}

      {step === "otp" && (
        <>
          <CardHeader
              className="
                text-center rounded-t-lg
                bg-transparent
                dark:bg-gradient-to-r 
                px-4 sm:px-6
              "
            >
            <CardTitle className="text-lg sm:text-xl font-semibold 
            text-blue-700
            dark:text-white">Ingresa el Código</CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col items-center gap-4 transition-colors duration-300 rounded-md px-4 sm:px-6">
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 text-center transition-colors duration-300">
              Código enviado a <span className="font-semibold text-blue-600 dark:text-blue-400 break-all">{maskedPhone}</span>
            </p>

            <div className="w-full flex justify-center px-2">
              <div className="flex gap-1 sm:gap-2">
                {otp.map((digit, index) => (
                  <div key={index} className="relative">
                    <input
                      ref={(el) => { otpRefs.current[index] = el }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onPaste={handleOtpPaste}
                      className="w-9 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-semibold
                                                   bg-white dark:bg-blue-950
                                                   border-2 border-blue-300 dark:border-blue-600
                                                   text-gray-900 dark:text-white shadow-sm
                                                   rounded-lg
                                                   focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800
                                                   hover:border-blue-400 hover:shadow-md
                                                   transition-all duration-200 ease-out
                                                   placeholder:text-gray-400"
                      placeholder="•"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-1 mb-2">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className={`h-1 w-5 sm:w-6 rounded-full transition-colors duration-300 ${
                    index < otp.filter((d) => d !== "").length ? "bg-blue-600 dark:bg-blue-400" : "bg-gray-300 dark:bg-gray-600"
                  }`}
                />
              ))}
            </div>

            {autoVerifyTimer > 0 && (
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                <p className="text-xs sm:text-sm text-amber-600 dark:text-amber-400 font-semibold text-center">
                  Verificando automáticamente en {autoVerifyTimer}s...
                </p>
              </div>
            )}

            <div className="text-center">
              {timer > 0 ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Reenviar código en <span className="font-bold text-amber-600 dark:text-amber-400">{timer}s</span>
                  </p>
                </div>
              ) : (
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  ¿No recibiste el código?{" "}
                  <Button
                    variant="link"
                    size="sm"
                    onClick={handleResend}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 
                                                 p-0 h-auto font-semibold underline-offset-4 hover:underline text-xs sm:text-sm"
                    disabled={isLoading}
                  >
                    Reenviar código
                  </Button>
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="px-4 sm:px-6">
            <Button
              className={`w-full h-11 sm:h-12 font-semibold text-sm sm:text-base rounded-lg transition-all duration-300 ${
                otp.every((d) => d !== "")
                  ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white shadow-lg transform hover:scale-[1.02]"
                  : "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed"
              } ${isLoading ? "animate-pulse" : ""}`}
              disabled={!otp.every((d) => d !== "") || isLoading}
              onClick={() => handleVerifyOtp()}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Verificando...
                </div>
              ) : otp.every((d) => d !== "") ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Verificar Código
                </div>
              ) : (
                `Ingresa ${6 - otp.filter((d) => d !== "").length} dígito${6 - otp.filter((d) => d !== "").length !== 1 ? "s" : ""} más`
              )}
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
    </div>
  )
}