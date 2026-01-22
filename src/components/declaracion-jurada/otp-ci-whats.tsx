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
import { AlertTriangle, FilePlus, Sparkles, Shield, Lock } from "lucide-react"

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
    <div className="flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/1 backdrop-blur-lg border-2 border-[#01195F]/20 shadow-2xl shadow-[#01195F]/10 relative overflow-hidden">
        {/* Borde brillante superior - amarillo */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400"></div>
        
        {/* Efecto de luz diagonal */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-[#01195F]/10 to-[#013991]/10 rounded-full blur-3xl"></div>

        <CardHeader className="space-y-1 pb-4 relative">
          <div className="flex items-center justify-center mb-2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#01195F] to-[#013991] rounded-full blur-lg opacity-50"></div>
              <div className="relative bg-gradient-to-br from-[#01195F] to-[#013991] p-3 rounded-full">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-[#ffffff] to-[#ffffff] bg-clip-text text-transparent">
            {step === "ci" && "Acceso Seguro"}
            {step === "confirm" && "Verificación"}
            {step === "otp" && "Autenticación"}
          </CardTitle>
          <p className="text-center text-sm text-white">
            {step === "ci" && "Ingresa tu Carnet de Identidad"}
            {step === "confirm" && "Confirma tu número de contacto"}
            {step === "otp" && "Ingresa el código de verificación"}
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {step === "ci" && (
            <>
              {!allowCreate ? (
                <div className="space-y-3">
                  <div className="relative group">
                    <Input
                      ref={inputRef}
                      type="text"
                      placeholder="Número de CI"
                      value={ci}
                      onChange={(e) => setCi(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="h-12 pl-4 pr-4 bg-white border-2 border-[#01195F]/30 rounded-xl text-slate-800 placeholder:text-slate-400 focus:border-[#01195F] focus:ring-4 focus:ring-[#01195F]/20 transition-all duration-300 text-base shadow-sm hover:shadow-md"
                      disabled={isLoading}
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#01195F]/0 via-[#013991]/0 to-[#01195F]/0 group-hover:from-[#01195F]/5 group-hover:via-[#013991]/5 group-hover:to-[#01195F]/5 pointer-events-none transition-all duration-300"></div>
                  </div>
                  {ciError && (
                    <Alert className="border-red-200 bg-red-50/80 backdrop-blur-sm">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <AlertTitle className="text-red-800 font-semibold">Error</AlertTitle>
                      <AlertDescription className="text-red-700">{ciError}</AlertDescription>
                    </Alert>
                  )}
                </div>
              ) : (
                <Alert className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 backdrop-blur-sm shadow-lg">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  <AlertTitle className="text-amber-900 font-semibold">Atención</AlertTitle>
                  <AlertDescription className="text-amber-800">
                    No se encontró un usuario con ese CI, puedes crear una nueva declaración.
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}

          {step === "confirm" && (
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-br from-[#01195F]/5 to-[#013991]/5 rounded-xl border border-[#01195F]/20 shadow-inner">
                <p className="text-sm text-white mb-1">Número encontrado:</p>
                <p className="text-lg font-semibold text-[#EEF1FA] tracking-wide">{maskedPhone}</p>
              </div>
              <div className="relative group">
                <Input
                  ref={phoneInputRef}
                  type="tel"
                  placeholder="Confirma tu número completo"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="h-12 pl-4 pr-4 bg-white border-2 border-[#01195F]/30 rounded-xl text-slate-800 placeholder:text-slate-400 focus:border-[#01195F] focus:ring-4 focus:ring-[#01195F]/20 transition-all duration-300 text-base shadow-sm hover:shadow-md"
                  disabled={isLoading}
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#01195F]/0 via-[#013991]/0 to-[#01195F]/0 group-hover:from-[#01195F]/5 group-hover:via-[#013991]/5 group-hover:to-[#01195F]/5 pointer-events-none transition-all duration-300"></div>
              </div>
            </div>
          )}

          {step === "otp" && (
            <div className="space-y-6">
              <div className="p-4 bg-gradient-to-br from-[#01195F]/5 to-[#013991]/5 rounded-xl border border-[#01195F]/20 shadow-inner">
                <p className="text-sm text-white text-center">
                  Código enviado a <span className="font-semibold text-[#ffffff]">{maskedPhone}</span>
                </p>
              </div>

              <div className="flex justify-center gap-1.5 sm:gap-2.5 px-4 sm:px-6">
                {otp.map((digit, index) => (
                  <div key={index} className="relative group flex-shrink-0">
                    <input
                      ref={(el) => {
                        otpRefs.current[index] = el
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onPaste={handleOtpPaste}
                      className="w-9 h-11 sm:w-11 sm:h-13 text-center text-lg sm:text-xl font-bold bg-white border-2 border-[#01195F]/30 text-slate-800 rounded-lg sm:rounded-xl focus:outline-none focus:border-[#01195F] focus:ring-4 focus:ring-[#01195F]/20 hover:border-[#013991]/50 hover:shadow-lg transition-all duration-200 shadow-md placeholder:text-slate-300"
                      placeholder="•"
                    />
                    <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-br from-[#01195F]/0 to-[#013991]/0 group-hover:from-[#01195F]/10 group-hover:to-[#013991]/10 pointer-events-none transition-all duration-300"></div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center gap-1.5 sm:gap-2.5 px-4 sm:px-6">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 flex-1 max-w-[2.25rem] sm:max-w-[2.75rem] rounded-full transition-all duration-300 ${
                      index < otp.filter((d) => d !== "").length
                        ? "bg-gradient-to-r from-[#C07601] to-[#FFE59D] shadow-md shadow-[#01195F]/30"
                        : "bg-slate-200"
                    }`}
                  />
                ))}
              </div>

              {autoVerifyTimer > 0 && (
                <div className="flex items-center justify-center gap-2 text-sm text-[#01195F] animate-pulse">
                  <Sparkles className="w-4 h-4" />
                  <span>Verificando automáticamente en {autoVerifyTimer}s...</span>
                </div>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-3 pt-2">
          {step === "ci" && (
            <>
              {!allowCreate ? (
                <Button
                  className="w-full h-12 bg-gradient-to-r from-[#01195F] to-[#013991] hover:from-[#01195F]/90 hover:to-[#013991]/90 text-white font-semibold rounded-xl shadow-lg shadow-[#01195F]/30 hover:shadow-xl hover:shadow-[#01195F]/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  disabled={isLoading || ci.trim().length < 5}
                  onClick={() => handleSearch({ ci })}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Buscando...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Buscar
                    </span>
                  )}
                </Button>
              ) : (
                <div className="w-full flex gap-2">
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="flex-1 h-12 border-2 border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={() => router.push(`/declaracion-jurada/nueva`)}
                    className="flex-1 h-12 bg-gradient-to-r from-[#01195F] to-[#013991] hover:from-[#01195F]/90 hover:to-[#013991]/90 text-white font-semibold rounded-xl shadow-lg shadow-[#01195F]/30 hover:shadow-xl hover:shadow-[#01195F]/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <FilePlus className="w-5 h-5 mr-2" />
                    Crear
                  </Button>
                </div>
              )}
            </>
          )}

          {step === "confirm" && (
            <Button
              className="w-full h-12 bg-gradient-to-r from-[#01195F] to-[#013991] hover:from-[#01195F]/90 hover:to-[#013991]/90 text-white font-semibold rounded-xl shadow-lg shadow-[#01195F]/30 hover:shadow-xl hover:shadow-[#01195F]/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              disabled={!phone.trim() || isLoading}
              onClick={sendOtp}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Enviando...
                </span>
              ) : (
                "Enviar Código a WhatsApp"
              )}
            </Button>
          )}

          {step === "otp" && (
            <>
              <div className="w-full text-center text-sm">
                {timer > 0 ? (
                  <p className="text-slate-600 text-white">
                    Reenviar código en <span className="font-semibold text-[#ffffff]">{timer}s</span>
                  </p>
                ) : (
                  <p className="text-slate-600 text-white">
                    ¿No recibiste el código?{" "}
                    <button
                      onClick={handleResend}
                      className="text-[#FFBC29] hover:text-[#013991] font-semibold underline underline-offset-2 hover:underline-offset-4 transition-all"
                    >
                      Reenviar código
                    </button>
                  </p>
                )}
              </div>

              <Button
                className={`w-full h-12 font-semibold rounded-xl transition-all duration-300 ${
                  otp.every((d) => d !== "")
                    ? "bg-gradient-to-r from-[#01195F] to-[#013991] hover:from-[#01195F]/90 hover:to-[#013991]/90 text-white shadow-lg shadow-[#01195F]/30 hover:shadow-xl hover:shadow-[#01195F]/40 hover:scale-[1.02] active:scale-[0.98]"
                    : "bg-slate-200 text-slate-500 cursor-not-allowed"
                } ${isLoading ? "animate-pulse" : ""}`}
                disabled={!otp.every((d) => d !== "") || isLoading}
                onClick={() => handleVerifyOtp()}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Verificando...
                  </span>
                ) : otp.every((d) => d !== "") ? (
                  <span className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Verificar Código
                  </span>
                ) : (
                  `Ingresa ${6 - otp.filter((d) => d !== "").length} dígito${
                    6 - otp.filter((d) => d !== "").length !== 1 ? "s" : ""
                  } más`
                )}
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}