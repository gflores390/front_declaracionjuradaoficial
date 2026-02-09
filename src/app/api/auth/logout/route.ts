import { cerrarSesion } from '@/lib/session';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    await cerrarSesion();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] Error logging out:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
