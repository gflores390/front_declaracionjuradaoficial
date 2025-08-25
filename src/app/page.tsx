import DeclaracionPrincipal from "@/components/declaracion-jurada/DeclaracionPrincipal"
import FeaturesDeclaracion from "@/components/declaracion-jurada/FeaturesDeclaracion"
import { Button } from "@/components/ui/button"
import { DeclaracionForm } from "@/components/declaracion-jurada/declaracion-form"

export default function Home() {
  return (
    <>
      <DeclaracionPrincipal />
      <FeaturesDeclaracion />
      {/* <DeclaracionForm /> */}
    </>
  )
}