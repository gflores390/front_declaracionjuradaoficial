import { obtenerSesion } from '@/lib/session';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const sesion = await obtenerSesion();
    
    if (!sesion) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({ 
      authenticated: true, 
      userId: sesion.userId,
      ci: sesion.ci 
    });
  } catch (error) {
    console.error('[API] Error getting session:', error);
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
