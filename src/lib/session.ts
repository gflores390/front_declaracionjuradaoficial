'use server'

import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'clave-por-defecto-segura-cambiar'
)

const COOKIE_NAME = 'auth_token'

export async function crearSesion(userId: string, ci: string) {
  console.log('🟢 [SESSION] Función crearSesion llamada')
  console.log('🟢 [SESSION] userId:', userId)
  console.log('🟢 [SESSION] ci:', ci)
  
  try {
    console.log('🟢 [SESSION] Creando JWT...')
    const token = await new SignJWT({ userId, ci })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(SECRET)
    
    console.log('🟢 [SESSION] JWT creado:', token.substring(0, 30) + '...')

    console.log('🟢 [SESSION] Obteniendo cookieStore...')
    const cookieStore = await cookies()
    
    console.log('🟢 [SESSION] Guardando cookie...')
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24,
      path: '/',
    })
    
    console.log('✅ [SESSION] Sesión creada exitosamente')
    return true
    
  } catch (error) {
    console.error('❌ [SESSION] Error al crear sesión:', error)
    throw error
  }
}

export async function cerrarSesion() {
  console.log('🔴 [SESSION] Cerrando sesión...')
  try {
    const cookieStore = await cookies()
    cookieStore.delete(COOKIE_NAME)
    console.log('✅ [SESSION] Cookie eliminada')
    return true
  } catch (error) {
    console.error('❌ [SESSION] Error al cerrar sesión:', error)
    throw error
  }
}

export async function obtenerSesion() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value

    if (!token) {
      console.log('ℹ️ [SESSION] No hay token')
      return null
    }

    const { payload } = await jwtVerify(token, SECRET)
    console.log('✅ [SESSION] Sesión válida:', payload.userId)
    return { userId: payload.userId as string, ci: payload.ci as string }
  } catch (error) {
    console.log('❌ [SESSION] Token inválido')
    return null
  }
}
