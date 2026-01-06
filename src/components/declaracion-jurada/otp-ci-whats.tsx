"use client"
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

  // === ESTADOS PRINCIPALES ===
  const [ci, setCi] = useState("") // CI ingresado por el usuario
  const [step, setStep] = useState<"ci" | "confirm" | "otp">("ci") // Paso actual del flujo
  const [maskedPhone, setMaskedPhone] = useState("") // Teléfono enmascarado mostrado al usuario
  const [otp, setOtp] = useState(["", "", "", "", "", ""]) // Array para cada dígito del OTP
  const [timer, setTimer] = useState(0) // Contador para reenvío de OTP
  const [userId, setUserId] = useState("") // ID del usuario encontrado
  const [allowCreate, setAllowCreate] = useState(false) // Permite crear nueva declaración
  const [ciError, setCiError] = useState("") // Error de validación del CI
  const [phone, setPhone] = useState("") // Teléfono completo del usuario
  const [persona, setPersona] = useState("") // Datos de la persona
  const [isLoading, setIsLoading] = useState(false) // Estado de carga global
  const [autoVerifyTimer, setAutoVerifyTimer] = useState(0) // 👈 AGREGA ESTO
  const [otpValid, setOtpValid] = useState(false) 
  const verifyingRef = useRef(false)

  // === REFERENCIAS PARA AUTOFOCUS ===
  const inputRef = useRef<HTMLInputElement>(null) // Referencia al input del CI
  const phoneInputRef = useRef<HTMLInputElement>(null) // Referencia al input del teléfono
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]) // Referencias para inputs OTP

  // === EFECTO: AUTO-VERIFICAR OTP DESPUÉS DE 3 SEGUNDOS ===
useEffect(() => {
  // Verificar si todos los dígitos están completos
  const isComplete = otp.every((d) => d !== "")
  
  if (isComplete && !isLoading) {
    const timeout = setTimeout(() => {
      handleVerifyOtp()
    }, 500) // 3 segundos

    return () => clearTimeout(timeout)
  }
}, [otp, isLoading])

  // === EFECTO: AUTO-FOCUS EN INPUTS ===
  useEffect(() => {
    if (step === "ci" && inputRef.current) {
      inputRef.current.focus()
    } else if (step === "confirm" && phoneInputRef.current) {
      phoneInputRef.current.focus()
    } else if (step === "otp" && otpRefs.current[0]) {
      otpRefs.current[0]?.focus()
    }
  }, [step])

  // === FUNCIÓN: BUSCAR USUARIO POR CI ===
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

  // === FUNCIÓN: MANEJAR TECLA ENTER ===
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (step === "ci" && !isLoading && ci.trim().length >= 5) {
        handleSearch({ ci })
      } else if (step === "confirm" && phone.trim() && !isLoading) {
        sendOtp()
      }
    }
  }

  // === FUNCIÓN: ENVIAR OTP ===
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

  // === FUNCIÓN: MANEJAR CAMBIO EN OTP ===
  const handleOtpChange = (index: number, value: string) => {
    // Solo permitir números
    if (value && !/^\d$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value

    setOtp(newOtp)

    // Auto-focus al siguiente input si se ingresó un dígito
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  // === FUNCIÓN: MANEJAR TECLAS EN OTP ===
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Si está vacío y presiona backspace, ir al anterior
      otpRefs.current[index - 1]?.focus()
    } else if (e.key === "ArrowLeft" && index > 0) {
      otpRefs.current[index - 1]?.focus()
    } else if (e.key === "ArrowRight" && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  // === FUNCIÓN: MANEJAR PEGADO EN OTP ===
  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "")

    if (pasteData.length >= 6) {
      const digits = pasteData.slice(0, 6).split("")
      setOtp(digits)
    }
  }

  // === FUNCIÓN: VERIFICAR OTP ===
// En OtpComponent.tsx - función handleVerifyOtp

const handleVerifyOtp = async () => {
  if (verifyingRef.current) {
    console.log("⚠️ handleVerifyOtp ya está en ejecución, se cancela la llamada duplicada.")
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

    // ✅ IMPORTANTE: Crear sesión Y ESPERAR
    const sessionModule = await import('@/lib/session')
    const { crearSesion } = sessionModule
    await crearSesion(userId, ci)
    
    // ✅ ESPERAR 500ms para asegurar que la sesión esté persistida
    await new Promise(resolve => setTimeout(resolve, 500))
    
    toast.success("¡Acceso concedido!")
    
    // ✅ Redirigir DESPUÉS de que la sesión esté lista
    if (userId) {
      router.push(`/declaracion-jurada/${userId}/edit`)
    } else {
      router.push(`/declaracion-jurada/nueva`)
    }
    
    // ✅ Refresh para revalidar datos del servidor
    router.refresh()
    
  } catch (error: unknown) {
    console.error('❌ ERROR GENERAL en handleVerifyOtp:', error)
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




  // === EFECTO: CRONÓMETRO PARA REENVÍO ===
  useEffect(() => {
    if (timer <= 0) return

    const interval = setInterval(() => {
      setTimer((t) => t - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [timer])

  // === FUNCIÓN: REENVIAR OTP ===
  const handleResend = () => sendOtp()

  // === FUNCIÓN: CANCELAR Y RESETEAR ===
  const handleCancel = () => {
    setCi("")
    setAllowCreate(false)
    setCiError("")
    setPhone("")
    setPersona("")
    setMaskedPhone("")
    setOtp(["", "", "", "", "", ""]) // Resetear array de OTP
    setTimer(0)
    setStep("ci")
  }

  // === RENDER PRINCIPAL ===
  return (
    <Card
      className="w-[400px] mx-auto mt-10 shadow-lg transition-colors duration-300 
                         bg-[rgba(255,255,255,0.63)] dark:bg-[rgba(167,182,255,0.4)] 
                         dark:shadow-gray-700"
    >
      {/* === PASO 1: BUSCAR POR CI === */}
      {step === "ci" && (
        <>
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Buscar mi Carnet de Identidad
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {!allowCreate ? (
              <>
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="Ingresa tu CI"
                  value={ci}
                  onChange={(e) => setCi(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                                         border-gray-200 dark:border-gray-600 transition-colors duration-300
                                         focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
                  disabled={isLoading}
                />
                {ciError && (
                  <Alert className="border-red-400 bg-red-50 text-red-800 dark:bg-red-900/40 dark:text-red-200 dark:border-red-600">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{ciError}</AlertDescription>
                  </Alert>
                )}
              </>
            ) : (
              <Alert className="border-yellow-400 bg-yellow-50 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200 dark:border-yellow-600">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Atención</AlertTitle>
                <AlertDescription>
                  No se encontró un usuario con ese CI, puedes crear una nueva declaración.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>

          <CardFooter className="flex gap-2">
            {!allowCreate ? (
              <Button
                className="w-full bg-blue-700 hover:bg-blue-500 dark:bg-blue-600 dark:hover:bg-blue-500 
                                         text-white px-6 py-3 rounded-lg text-lg transition-colors duration-300"
                disabled={ci.trim().length < 5 || isLoading}
                onClick={() => handleSearch({ ci })}
              >
                {isLoading ? "Buscando..." : "Buscar"}
              </Button>
            ) : (
              <>
                <Button
                  className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 
                                             text-gray-700 dark:text-gray-300 font-medium px-3 py-2 rounded-lg text-sm 
                                             transition-colors duration-300 min-w-0"
                  onClick={handleCancel}
                >
                  Cancelar
                </Button>
                <Button
                  className="flex-1 px-3 py-2 text-white text-sm rounded-lg transition-colors duration-300 
                                             bg-[#0097E8] hover:bg-[#007FCC] dark:bg-[#131A41] dark:hover:bg-[#101538]
                                             min-w-0"
                  onClick={() => router.push(`/declaracion-jurada/nueva`)}
                >
                  <span className="truncate">Crear</span>
                  <FilePlus className="h-4 w-4 ml-1 text-white flex-shrink-0" />
                </Button>
              </>
            )}
          </CardFooter>
        </>
      )}

      {/* === PASO 2: CONFIRMAR TELÉFONO === */}
      {step === "confirm" && (
        <>
          <CardHeader>
            <CardTitle className="text-center text-xl text-gray-900 dark:text-gray-100 transition-colors duration-300">
              Confirmar número
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col items-center gap-4">
            <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
              Número encontrado: <b className="text-gray-800 dark:text-gray-100">{maskedPhone}</b>
            </p>

            <Input
              ref={phoneInputRef}
              type="tel"
              placeholder="Ingresa tu número de celular"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onKeyPress={handleKeyPress}
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                                     border-gray-200 dark:border-gray-600 transition-colors duration-300
                                     focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
              disabled={isLoading}
            />
          </CardContent>

          <CardFooter>
            <Button
              className="w-full bg-blue-700 hover:bg-blue-500 dark:bg-blue-600 dark:hover:bg-blue-500 
                                     text-white transition-colors duration-300"
              onClick={sendOtp}
              disabled={!phone.trim() || isLoading}
            >
              {isLoading ? "Enviando..." : "Enviar Código a WhatsApp"}
            </Button>
          </CardFooter>
        </>
      )}

      {/* === PASO 3: VERIFICAR OTP === */}
      {step === "otp" && (
        <>
          <CardHeader>
            <CardTitle className="text-center text-xl text-black dark:text-white">Ingresa el Código</CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col items-center gap-4 transition-colors duration-300 rounded-md">
            <p className="text-gray-600 dark:text-gray-300 text-center transition-colors duration-300">
              Código enviado a <span className="font-semibold text-gray-800 dark:text-white">{maskedPhone}</span>
            </p>

            {/* === INPUTS DE OTP MEJORADOS === */}
            <div className="flex justify-center gap-2 p-4">
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
                    className="w-12 h-14 text-center text-xl font-semibold
                                                 bg-white dark:bg-gray-800
                                                 border-2 border-gray-200 dark:border-gray-600
                                                 text-gray-900 dark:text-gray-100 shadow-sm
                                                 rounded-lg
                                                 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100
                                                 hover:border-gray-300 hover:shadow-md
                                                 transition-all duration-200 ease-out
                                                 placeholder:text-gray-400"
                    placeholder="•"
                  />
                </div>
              ))}
            </div>

           {/* Indicador visual de progreso */}
            <div className="flex gap-1 mb-2">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className={`h-1 w-6 rounded-full transition-colors duration-300 ${
                    index < otp.filter((d) => d !== "").length ? "bg-blue-400" : "bg-gray-200 dark:bg-gray-600"
                  }`}
                />
              ))}
            </div>

            {/* Contador de verificación automática */}
            {autoVerifyTimer > 0 && (
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <p className="text-sm text-green-600 dark:text-green-400 font-semibold">
                  Verificando automáticamente en {autoVerifyTimer}s...
                </p>
              </div>
            )}



            {/* === TIMER Y REENVÍO === */}
            <div className="text-center">
              {timer > 0 ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Reenviar código en <span className="font-bold text-orange-600">{timer}s</span>
                  </p>
                </div>
              ) : (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  ¿No recibiste el código?{" "}
                  <Button
                    variant="link"
                    size="sm"
                    onClick={handleResend}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 
                                                 p-0 h-auto font-semibold underline-offset-4 hover:underline"
                    disabled={isLoading}
                  >
                    Reenviar código
                  </Button>
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter>
            <Button
              className={`w-full h-12 font-semibold text-base rounded-lg transition-all duration-300 ${
                otp.every((d) => d !== "")
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg transform hover:scale-[1.02]"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              } ${isLoading ? "animate-pulse" : ""}`}
              disabled={!otp.every((d) => d !== "") || isLoading}
              onClick={() => handleVerifyOtp()}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Verificando...
                </div>
              ) : otp.every((d) => d !== "") ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  )
}
