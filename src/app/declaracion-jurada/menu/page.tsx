"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";

export default function MenuDeclaracion() {
  const router = useRouter();
  
  // useAuth() lee la sesión JWT de las cookies (creada por crearSesion() en OTP)
  // - isAuthenticated: true si existe sesión válida
  // - userInfo: { userId: 'new' o ID real, ci: CI del usuario }
  // - isLoading: true mientras se verifica la sesión
  const { isAuthenticated, userInfo, isLoading } = useAuth();
  
  // Estado local para manejar hidratación (cliente vs servidor)
  const [mounted, setMounted] = useState(false);

  // 1️⃣ Marcar que el componente ya está montado en cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  // 2️⃣ Proteger la ruta: si no hay sesión autenticada, redirigir a inicio
  useEffect(() => {
    // Si ya está montado Y se terminó de cargar Y no está autenticado
    if (mounted && !isLoading && !isAuthenticated) {
      // Redirigir a página principal (sin acceso)
      router.replace("/");
    }
  }, [isAuthenticated, isLoading, mounted, router]);

  // Mostrar loading mientras se verifica autenticación
  if (!mounted || isLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#01195F]/30 border-t-[#01195F] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Verificando tu sesión...</p>
        </div>
      </div>
    );
  }

  // 3️⃣ Detectar tipo de usuario basado en userId
  // - Si userId = 'new' → Usuario NUEVO (nunca antes visto)
  // - Si userId = ID real → Usuario ANTIGUO (existe en base de datos)
  const isNewUser = !userInfo?.userId || userInfo?.userId === "new";

  // 4️⃣ Manejar redirección según tipo de usuario
  const handleGoToForm = () => {
    if (isNewUser) {
      // Usuario NUEVO → Va a formulario vacío
      router.push(`/declaracion-jurada/nueva`);
    } else {
      // Usuario ANTIGUO → Va a editar su declaración con datos pre-llenados
      router.push(`/declaracion-jurada/${userInfo?.userId}/edit`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-slate-50 to-slate-100">
      <Card className="w-full max-w-md bg-white shadow-2xl border-2 border-[#01195F]/20">
        {/* Borde decorativo superior */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400"></div>

        <CardHeader className="space-y-4 pb-6 relative text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#01195F] to-[#013991] rounded-full blur-lg opacity-50"></div>
              <div className="relative bg-gradient-to-br from-[#01195F] to-[#013991] p-3 rounded-full">
                <FileText className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          
          {/* Mensaje de bienvenida dinámico */}
          {/* Cambiar según si es usuario nuevo o antiguo */}
          <div>
            <CardTitle className="text-2xl font-bold text-slate-900">
              {isNewUser ? "Bienvenido" : "Bienvenido de vuelta"}
            </CardTitle>
            <p className="text-sm text-slate-600 mt-2">
              {isNewUser
                ? "Completa tu declaración jurada"
                : "Actualiza tu declaración jurada"}
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Mostrar información del usuario verificado */}
          <div className="p-4 bg-gradient-to-br from-[#01195F]/5 to-[#013991]/5 rounded-xl border border-[#01195F]/20">
            {/* Mostrar tipo de usuario */}
            <p className="text-sm text-slate-700">
              <span className="font-semibold text-slate-900">Estado:</span>{" "}
              {isNewUser ? "Usuario nuevo" : "Usuario existente"}
            </p>
            
            {/* Mostrar CI del usuario autenticado */}
            {userInfo?.ci && (
              <p className="text-sm text-slate-700 mt-2">
                <span className="font-semibold text-slate-900">CI:</span> {userInfo.ci}
              </p>
            )}
          </div>

          {/* Botón principal para ir a formulario */}
          {/* El texto cambia según si es usuario nuevo o antiguo */}
          {/* Llama a handleGoToForm que redirige a la URL correcta */}
          <Button
            onClick={handleGoToForm}
            className="w-full h-12 bg-gradient-to-r from-[#01195F] to-[#013991] hover:from-[#01195F]/90 hover:to-[#013991]/90 text-white font-semibold rounded-xl shadow-lg shadow-[#01195F]/30 hover:shadow-xl hover:shadow-[#01195F]/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <FileText className="w-5 h-5 mr-2" />
            {isNewUser ? "Crear Declaración Jurada" : "Declaración Jurada"}
            <ArrowRight className="w-5 h-5 ml-auto" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
