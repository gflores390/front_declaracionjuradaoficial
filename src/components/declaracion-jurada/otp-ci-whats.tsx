"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Shield, Lock, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import {
  sendOtpApi,
  verificacionCi,
  verifyOtpApi,
} from "@/app/declaracion-jurada/declaracion-jurada.api";

type Step = "ci" | "celular" | "otp" | "ok";

export default function OtpCiWhats() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("ci");
  const [ci, setCi] = useState("");
  const [celular, setCelular] = useState("");
  const [maskedPhone, setMaskedPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [ciError, setCiError] = useState("");
  const [celularError, setCelularError] = useState("");
  const [intentos, setIntentos] = useState(0);
  const [maxIntentos, setMaxIntentos] = useState(3);
  
  const ciInputRef = useRef<HTMLInputElement>(null);
  const celularInputRef = useRef<HTMLInputElement>(null);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const verifyingRef = useRef(false);

  /* ================= AUTO FOCUS ================= */
  useEffect(() => {
    if (step === "ci" && ciInputRef.current) {
      ciInputRef.current.focus();
    } else if (step === "celular" && celularInputRef.current) {
      celularInputRef.current.focus();
    } else if (step === "otp" && otpRefs.current[0]) {
      otpRefs.current[0]?.focus();
    }
  }, [step]);

  /* ================= TIMER ================= */
  useEffect(() => {
    if (timer <= 0) return;
    const i = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(i);
  }, [timer]);

  /* ================= AUTO VERIFY OTP ================= */
  useEffect(() => {
    const isComplete = otp.every((d) => d !== "");
    if (isComplete && !loading && step === "otp") {
      const timeout = setTimeout(() => {
        handleVerifyOtp();
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [otp, loading, step]);

  /* ================= PASO 1: VERIFICAR CI ================= */
  const handleVerifyCi = async () => {
    setCiError("");
    
    if (!ci.trim()) {
      setCiError("Por favor ingresa tu CI");
      return;
    }
    
    if (ci.trim().length < 5) {
      setCiError("El CI debe tener al menos 5 dígitos");
      return;
    }

    setLoading(true);
    try {
      const res = await verificacionCi(ci);
      
      if (res.status === "success") {
        // Si el backend retorna un número enmascarado, usarlo
        if (res.numero) {
          setMaskedPhone(res.numero);
        }
        toast.success("CI verificado correctamente");
        setStep("celular");
      } else {
        setCiError("CI no registrado en el sistema");
        toast.error("CI no encontrado");
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Error al verificar CI";
      setCiError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  /* ================= PASO 2: ENVIAR OTP ================= */
  const handleSendOtp = async () => {
    setCelularError("");
    
    if (!celular.trim()) {
      setCelularError("Por favor ingresa tu número de celular");
      return;
    }

    if (!/^\d+$/.test(celular)) {
      setCelularError("El número de celular solo debe contener números");
      return;
    }

    setLoading(true);
    try {
      const response = await sendOtpApi({ 
        celular: celular.trim(), 
        personaCi: ci.trim() 
      });
      
      // Capturar información de intentos si el backend la envía
      // Acceder a response.data ya que sendOtpApi retorna AxiosResponse
      const data = response.data || response;
      
      if (data.intentos !== undefined) {
        setIntentos(data.intentos);
      }
      if (data.maxIntentos !== undefined) {
        setMaxIntentos(data.maxIntentos);
      }
      
      // Mostrar advertencia según intentos
      if (data.intentos === 1) {
        toast.warning("Primer intento de verificación", {
          description: "Tienes 2 intentos restantes"
        });
      } else if (data.intentos === 2) {
        toast.error("Segundo intento de verificación", {
          description: "¡Último intento disponible!"
        });
      }
      
      setTimer(data.otpInfo?.duracionSegundos || 180);
      toast.success("Código enviado a WhatsApp");
      setStep("otp");
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Error al enviar OTP";
      setCelularError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  /* ================= PASO 3: VERIFICAR OTP ================= */
 // Reemplaza la sección donde guardas en localStorage:

// ❌ ELIMINA ESTO:
// localStorage.setItem("dj_autorizado", "true");
// localStorage.setItem("dj_ci", ci);

// ✅ REEMPLAZA con:
const handleVerifyOtp = async () => {
  try {
    const codigoCompleto = otp.join("");

    if (codigoCompleto.length !== 6) {
      toast.error("El código debe tener 6 dígitos");
      return;
    }

    setLoading(true);

    const response = await verifyOtpApi({
      personaCi: ci.trim(),
      codigo: codigoCompleto,
    });

    const data = response.data;

    if (data.status === "success") {
      const token = data.data.token;

      await fetch("/api/auth/crear-sesion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      toast.success("¡Verificación exitosa!");
      router.push("/declaracion-jurada/menu");
    } else {
      toast.error("Código incorrecto");
    }
  } catch (error: any) {
    toast.error(
      error.response?.data?.message || "Código incorrecto"
    );
  } finally {
    setLoading(false);
  }
};

  /* ================= MANEJO DE OTP INPUTS ================= */
  const handleOtpChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      otpRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "");
    if (pasteData.length >= 6) {
      const digits = pasteData.slice(0, 6).split("");
      setOtp(digits);
    }
  };

  /* ================= MANEJO DE ENTER ================= */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      if (step === "ci" && ci.trim().length >= 5) {
        handleVerifyCi();
      } else if (step === "celular" && celular.trim()) {
        handleSendOtp();
      }
    }
  };

  /* ================= REENVIAR CÓDIGO ================= */
  const handleResend = () => {
    setOtp(["", "", "", "", "", ""]);
    handleSendOtp();
  };

  /* ================= RENDER ================= */
  return (
    <div className="flex items-center justify-center  ">
      <Card className="
  w-full max-w-md
  bg-white/20       /* más transparente */
  backdrop-blur-lg  /* efecto borroso */
  border border-white/30  /* opcional, borde sutil */
  shadow-2xl shadow-[#01195F]/10
  relative overflow-hidden
">

        {/* Borde brillante superior */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400"></div>
        
        {/* Efecto de luz diagonal */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-[#01195F]/10 to-[#013991]/10 rounded-full blur-3xl"></div>

        <CardHeader className="space-y-1 pb-4 relative">
          <div className="flex items-center justify-center mb-2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#01195F] to-[#013991] rounded-full blur-lg opacity-50"></div>
              <div className="relative bg-gradient-to-br from-[#01195F] to-[#013991] p-3 rounded-full">
                {step === "ok" ? (
                  <CheckCircle2 className="w-8 h-8 text-white" />
                ) : (
                  <Shield className="w-8 h-8 text-white" />
                )}
              </div>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-[#01195F] to-[#013991] bg-clip-text text-transparent">
            {step === "ci" && "Acceso Seguro"}
            {step === "celular" && "Verificación"}
            {step === "otp" && "Autenticación"}
            {step === "ok" && "¡Acceso Concedido!"}
          </CardTitle>
          <p className="text-center text-sm text-slate-600">
            {step === "ci" && "Ingresa tu Carnet de Identidad"}
            {step === "celular" && "Confirma tu número de contacto"}
            {step === "otp" && "Ingresa el código de verificación"}
            {step === "ok" && "Redirigiendo al menú..."}
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* ============ PASO: CI ============ */}
          {step === "ci" && (
            <div className="space-y-3">
              <div className="relative group">
                <Input
                  ref={ciInputRef}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={ci}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!/^\d*$/.test(value)) {
                      setCiError("El CI solo debe contener números");
                      return;
                    }
                    setCiError("");
                    setCi(value);
                  }}
                  placeholder="Ingresa tu CI"
                  onKeyPress={handleKeyPress}
                  className="h-12 pl-4 pr-4 bg-white border-2 border-[#01195F]/30 rounded-xl text-slate-800 placeholder:text-slate-400 focus:border-[#01195F] focus:ring-4 focus:ring-[#01195F]/20 transition-all duration-300 text-base shadow-sm hover:shadow-md"
                  disabled={loading}
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
          )}

          {/* ============ PASO: CELULAR ============ */}
          {step === "celular" && (
            <div className="space-y-4">
              {maskedPhone && (
                <div className="p-4 bg-gradient-to-br from-[#01195F]/5 to-[#013991]/5 rounded-xl border border-[#01195F]/20 shadow-inner">
                  <p className="text-sm text-slate-600 mb-1">Número encontrado:</p>
                  <p className="text-lg font-semibold text-[#01195F] tracking-wide">{maskedPhone}</p>
                </div>
              )}
              
              <div className="relative group">
                <Input
                  ref={celularInputRef}
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={celular}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!/^\d*$/.test(value)) {
                      setCelularError("El número de celular solo debe contener números");
                      return;
                    }
                    setCelularError("");
                    setCelular(value);
                  }}
                  placeholder="Confirma o ingresa tu número de celular"
                  onKeyPress={handleKeyPress}
                  className="h-12 pl-4 pr-4 bg-white border-2 border-[#01195F]/30 rounded-xl text-slate-800 placeholder:text-slate-400 focus:border-[#01195F] focus:ring-4 focus:ring-[#01195F]/20 transition-all duration-300 text-base shadow-sm hover:shadow-md"
                  disabled={loading}
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#01195F]/0 via-[#013991]/0 to-[#01195F]/0 group-hover:from-[#01195F]/5 group-hover:via-[#013991]/5 group-hover:to-[#01195F]/5 pointer-events-none transition-all duration-300"></div>
              </div>

              {celularError && (
                <Alert className="border-red-200 bg-red-50/80 backdrop-blur-sm">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertTitle className="text-red-800 font-semibold">Error</AlertTitle>
                  <AlertDescription className="text-red-700">{celularError}</AlertDescription>
                </Alert>
              )}

              {/* Mostrar advertencia de intentos */}
              {intentos > 0 && (
                <Alert className={`border-2 ${
                  intentos === 1 ? "border-yellow-200 bg-yellow-50/80" : 
                  intentos === 2 ? "border-orange-200 bg-orange-50/80" : 
                  "border-red-200 bg-red-50/80"
                } backdrop-blur-sm`}>
                  <AlertTriangle className={`h-4 w-4 ${
                    intentos === 1 ? "text-yellow-600" : 
                    intentos === 2 ? "text-orange-600" : 
                    "text-red-600"
                  }`} />
                  <AlertTitle className={`font-semibold ${
                    intentos === 1 ? "text-yellow-800" : 
                    intentos === 2 ? "text-orange-800" : 
                    "text-red-800"
                  }`}>
                    {intentos === 1 && "Primer intento de verificación"}
                    {intentos === 2 && "Segundo intento - ¡Cuidado!"}
                    {intentos >= 3 && "Último intento"}
                  </AlertTitle>
                  <AlertDescription className={
                    intentos === 1 ? "text-yellow-700" : 
                    intentos === 2 ? "text-orange-700" : 
                    "text-red-700"
                  }>
                    {intentos === 1 && `Tienes ${maxIntentos - intentos} intentos restantes`}
                    {intentos === 2 && "¡Este es tu último intento disponible!"}
                    {intentos >= 3 && "Has agotado tus intentos"}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* ============ PASO: OTP ============ */}
          {step === "otp" && (
            <div className="space-y-6">
              <div className="p-4 bg-gradient-to-br from-[#01195F]/5 to-[#013991]/5 rounded-xl border border-[#01195F]/20 shadow-inner">
                <p className="text-sm text-slate-600 text-center">
                  Código enviado a <span className="font-semibold text-[#01195F]">{celular}</span>
                </p>
              </div>

              {/* Inputs de OTP con padding para evitar cortes */}
              <div className="flex justify-center gap-2 px-2">
                {otp.map((digit, index) => (
                  <div key={index} className="relative group">
                    <input
                      ref={(el) => {
                        otpRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onPaste={handleOtpPaste}
                      className="w-12 h-14 text-center text-xl font-bold bg-white border-2 border-[#01195F]/30 text-slate-800 rounded-xl focus:outline-none focus:border-[#01195F] focus:ring-4 focus:ring-[#01195F]/20 hover:border-[#013991]/50 hover:shadow-lg transition-all duration-200 shadow-md placeholder:text-slate-300"
                      placeholder="•"
                      disabled={loading}
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#01195F]/0 to-[#013991]/0 group-hover:from-[#01195F]/10 group-hover:to-[#013991]/10 pointer-events-none transition-all duration-300"></div>
                  </div>
                ))}
              </div>

              {/* Indicador de progreso */}
              <div className="flex justify-center gap-2 mt-2">
                {otp.map((digit, index) => (
                  <div
                    key={index}
                    className={`w-10 h-1 rounded-full transition-all ${
                      digit ? "bg-[#01195F]" : "bg-[#01195F]/20"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ============ PASO: OK ============ */}
          {step === "ok" && (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full blur-lg opacity-50 animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-green-500 to-emerald-500 p-4 rounded-full">
                    <CheckCircle2 className="w-12 h-12 text-white" />
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-green-700 mb-2">¡Verificación exitosa!</h3>
              <p className="text-slate-600">Redirigiendo al menú principal...</p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-3 pt-2">
          {/* ============ BOTÓN: CI ============ */}
          {step === "ci" && (
            <Button
              className="w-full h-12 bg-gradient-to-r from-[#01195F] to-[#013991] hover:from-[#01195F]/90 hover:to-[#013991]/90 text-white font-semibold rounded-xl shadow-lg shadow-[#01195F]/30 hover:shadow-xl hover:shadow-[#01195F]/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              disabled={loading || ci.trim().length < 5}
              onClick={handleVerifyCi}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Verificando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Verificar CI
                </span>
              )}
            </Button>
          )}

          {/* ============ BOTÓN: CELULAR ============ */}
          {step === "celular" && (
            <Button
              className="w-full h-12 bg-gradient-to-r from-[#01195F] to-[#013991] hover:from-[#01195F]/90 hover:to-[#013991]/90 text-white font-semibold rounded-xl shadow-lg shadow-[#01195F]/30 hover:shadow-xl hover:shadow-[#01195F]/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              disabled={!celular.trim() || loading}
              onClick={handleSendOtp}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Enviando...
                </span>
              ) : (
                "Enviar Código a WhatsApp"
              )}
            </Button>
          )}

          {/* ============ BOTÓN: OTP ============ */}
          {step === "otp" && (
            <>
              <div className="w-full text-center text-sm">
                {timer > 0 ? (
                  <p className="text-slate-600">
                    Reenviar código en <span className="font-semibold text-[#01195F]">{timer}s</span>
                  </p>
                ) : (
                  <p className="text-slate-600">
                    ¿No recibiste el código?{" "}
                    <button
                      onClick={handleResend}
                      className="text-[#01195F] hover:text-[#013991] font-semibold underline underline-offset-2 hover:underline-offset-4 transition-all"
                      disabled={loading}
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
                } ${loading ? "animate-pulse" : ""}`}
                disabled={!otp.every((d) => d !== "") || loading}
                onClick={handleVerifyOtp}
              >
                {loading ? (
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
  );
}