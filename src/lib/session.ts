'use server'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'clave-por-defecto-segura-cambiar'
)
const COOKIE_NAME = 'auth_token'

export async function crearSesion(userId: string, ci: string) {
  console.log('🟢 [SESSION] Creando sesión para CI:', ci)
  
  try {
    const token = await new SignJWT({ userId, ci })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(SECRET)
    
    const cookieStore = await cookies()
    
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 horas
      path: '/',
    })
    
    console.log('✅ [SESSION] Sesión creada exitosamente')
    return { success: true }
    
  } catch (error) {
    console.error('❌ [SESSION] Error al crear sesión:', error)
    return { success: false, error: 'Error al crear sesión' }
  }
}

export async function cerrarSesion() {
  console.log('🔴 [SESSION] Cerrando sesión...')
  
  try {
    const cookieStore = await cookies()
    
    // Eliminar cookie
    cookieStore.delete({
      name: COOKIE_NAME,
      path: '/',
    })
    
    console.log('✅ [SESSION] Sesión cerrada exitosamente')
    return { success: true }
    
  } catch (error) {
    console.error('❌ [SESSION] Error al cerrar sesión:', error)
    return { success: false, error: 'Error al cerrar sesión' }
  }
}

export async function obtenerSesion() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value
    
    if (!token) {
      return { authenticated: false }
    }
    
    const { payload } = await jwtVerify(token, SECRET)
    
    return {
      authenticated: true,
      userId: payload.userId as string,
      ci: payload.ci as string,
    }
    
  } catch (error) {
    console.log('❌ [SESSION] Token inválido o expirado')
    return { authenticated: false }
  }
}