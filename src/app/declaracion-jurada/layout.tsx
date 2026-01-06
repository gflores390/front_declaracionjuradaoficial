import { redirect } from 'next/navigation'
import { obtenerSesion } from '@/lib/session'
import { ReactNode } from 'react'
import { headers } from 'next/headers'

export const dynamic = 'force-dynamic' 

export default async function DeclaracionLayout({
  children,
}: {
  children: ReactNode
}) {

  return <>{children}</>
}