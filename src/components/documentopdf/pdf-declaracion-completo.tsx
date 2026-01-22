"use client";
import { useEffect, useState } from "react";

interface PdfDeclaracionProps {
    data: any;
}

export const PdfDeclaracion = ({ data }: PdfDeclaracionProps) => {
    const [hora, setHora] = useState("");

const formatFecha = (fecha: unknown): string | null => {
  if (!fecha) return null;

  // Si viene como string (ej: "1998-04-22" o "1998-04-22T00:00:00.000Z")
  if (typeof fecha === "string") {
    const [year, month, day] = fecha.split("T")[0].split("-");
    return `${day}-${month}-${year}`;
  }

  // Si viene como Date
  if (fecha instanceof Date) {
    const day = String(fecha.getDate()).padStart(2, "0");
    const month = String(fecha.getMonth() + 1).padStart(2, "0");
    const year = fecha.getFullYear();
    return `${day}-${month}-${year}`;
  }

  return null;
};



    const getMesDeclarado = () => {
        const ahora = new Date();
        const meses = [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];
        return `${meses[ahora.getMonth()]} / ${ahora.getFullYear()}`;
    };

    const tieneDatosSeccion = (seccion: any[]) => {
        return seccion && seccion.length > 0 && seccion.some(item => 
            Object.values(item).some(val => val && val !== '' && val !== 'NINGUNA')
        );
    };

    useEffect(() => {
        setHora(new Date().toLocaleTimeString("es-ES"));
    }, []);



    const NoAplica = () => (
        <div className="text-center py-3 text-gray-500 italic text-sm bg-sky-50 rounded">
            No aplica
        </div>
    );

    const renderHorariosPdfIII = (horarios: any[]) => {
    if (!Array.isArray(horarios) || horarios.length === 0) {
        return <span>-</span>
    }

    return (
        <div className="space-y-0.5 text-[10px] leading-tight">
        {horarios.map((h, i) => (
            <div key={i} className="whitespace-nowrap">
            <span className="font-semibold">{h.dia}:</span>{" "}
            {h.inicio && h.fin ? `${h.inicio} - ${h.fin}` : "-"}
            </div>
        ))}
        </div>
    )
    }

   const renderHorariosPdf = (horarios: any[]) => {
    if (!Array.isArray(horarios) || horarios.length === 0) {
        return <span>-</span>
    }

    return (
        <div className="space-y-0.5 text-[10px] leading-tight">
        {horarios.map((h, i) => (
            <div key={i} className="whitespace-nowrap">
            <span className="font-semibold">{h.dia}:</span>{" "}
            {h.inicio && h.fin ? `${h.inicio} - ${h.fin}` : "-"}
            </div>
        ))}
        </div>
    )
    }


    const TablaActividadDocente = ({ datos }: any) => {
         // Calcular totales
    const totalCargaHoraria = datos.reduce((sum: number, item: any) => 
        sum + (parseFloat(item.cargaHoraria) || 0), 0
    );
    
    const totalGanado = datos.reduce((sum: number, item: any) => 
        sum + (parseFloat(item.totalGanadoBs) || 0), 0
    );

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-[10px] border border-[#B7C8E7] leading-loose rounded-lg overflow-hidden">
                <thead className="bg-[#B7C8E7]">
                    <tr>
                        <th className="border border-[#B7C8E7] p-2 font-bold">DEPENDENCIA, DECANATURA, ÁREA O ADMINISTRATIVA</th>
                        <th className="border border-[#B7C8E7] p-2 font-bold">CARRERA O INSTITUTO</th>
                        <th className="border border-[#B7C8E7] p-2 font-bold">MATERIA/SIGLA O CARGO ADMINISTRATIVO</th>
                        <th className="border border-[#B7C8E7] p-2 font-bold">CATEGORÍA</th>
                        <th className="border border-[#B7C8E7] p-2 font-bold">CARGA HORARIA</th>
                        <th className="border border-[#B7C8E7] p-2 font-bold">DIAS</th>
                        <th className="border border-[#B7C8E7] p-2 font-bold">TOTAL GANADO (Bs)</th>
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {datos.map((item: any, index: number) => (
                        <tr key={index} className="hover:bg-gray-50">
                            <td className="border-2 border-dashed border-[#B7C8E7] p-2 uppercase">{item.dependenciaDecanaturaArea || '-'}</td>
                            <td className="border-2 border-dashed border-[#B7C8E7] p-2 uppercase">{item.carreraInstituto || '-'}</td>
                            <td className="border-2 border-dashed border-[#B7C8E7] p-2 uppercase">{item.materiaSigla || '-'}</td>
                            <td className="border-2 border-dashed border-[#B7C8E7] p-2 uppercase">{item.categoriaDocente || '-'}</td>
                            <td className="border-2 border-dashed border-[#B7C8E7] p-2 uppercase text-center">{item.cargaHoraria || '-'}</td>
                            <td className="border-2 border-dashed border-[#B7C8E7] p-2 uppercase align-top text-xs">{renderHorariosPdf(item.horarios)}</td>
                            <td className="border-2 border-dashed border-[#B7C8E7] p-2 uppercase text-right font-semibold">{item.totalGanadoBs || '0.00'}</td>
                        </tr>
                    ))}
                    {/* Fila de totales */}
                    <tr className="bg-white">
                        <td colSpan={4} className="border-2 border-dashed border-[#B7C8E7] p-2 text-right">TOTALES:</td>
                        <td className="border-2 border-dashed border-[#B7C8E7] p-2 text-center">{totalCargaHoraria.toFixed(0)}</td>
                        <td className="border-2 border-dashed border-[#B7C8E7] p-2"></td>
                        <td className="border-2 border-dashed border-[#B7C8E7] p-2 text-right">{totalGanado.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
        </div>);
    };

   const TablaActividadExtra = ({ datos }: any) => {
    // Calcular totales
    const totalCargaHoraria = datos.reduce((sum: number, item: any) => 
        sum + (parseFloat(item.cargaHoraria) || 0), 0
    );

    const totalGanado = datos.reduce((sum: number, item: any) => 
        sum + (parseFloat(item.totalGanado) || 0), 0
    );

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-[10px] border border-[#B7C8E7] leading-loose rounded-lg overflow-hidden">
                <thead className="bg-[#B7C8E7]">
                    <tr>
                        <th className="border border-[#B7C8E7] p-2 font-bold">NOMBRE DE LA INSTITUCIÓN PÚBLICA O PRIVADA</th>
                        <th className="border border-[#B7C8E7] p-2 font-bold">NIVEL O CARGO OCUPACIONAL</th>
                        <th className="border border-[#B7C8E7] p-2 font-bold">ACTIVIDAD PÚBLICA O PRIVADA</th>
                        <th className="border border-[#B7C8E7] p-2 font-bold">CARGA HORARIA</th>
                        <th className="border border-[#B7C8E7] p-2 font-bold">TIEMPO COMPLETO / MEDIO TIEMPO O CARGA HORARIA</th>
                        <th className="border border-[#B7C8E7] p-2 font-bold">TOTAL GANADO (Bs)</th>
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {datos.map((item: any, index: number) => (
                        <tr key={index} className="hover:bg-gray-50">
                            <td className="border-2 border-dashed border-[#B7C8E7] p-2 uppercase">{item.nombreInstitucion || '-'}</td>
                            <td className="border-2 border-dashed border-[#B7C8E7] p-2 uppercase">{item.nivelCargoOcupacional || '-'}</td>
                            <td className="border-2 border-dashed border-[#B7C8E7] p-2 uppercase">{item.actividadPublicaPrivada || '-'}</td>
                            <td className="border-2 border-dashed border-[#B7C8E7] p-2 uppercase text-center">{item.cargaHoraria || '-'}</td>
                            <td className="border-2 border-dashed border-[#B7C8E7] p-2 uppercase align-top text-xs">{renderHorariosPdf(item.horarios)}</td>
                            <td className="border-2 border-dashed border-[#B7C8E7] p-2 uppercase text-right font-semibold">{item.totalGanado || '0.00'}</td>
                        </tr>
                    ))}
                    {/* Fila de totales */}
                    <tr className="bg-white">
                        <td colSpan={3} className="border-2 border-dashed border-[#B7C8E7] p-2 text-right">TOTALES:</td>
                        <td className="border-2 border-dashed border-[#B7C8E7] p-2 text-center">{totalCargaHoraria.toFixed(0)}</td>
                        <td className="border-2 border-dashed border-[#B7C8E7] p-2"></td>
                        <td className="border-2 border-dashed border-[#B7C8E7] p-2 text-right">{totalGanado.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

const TablaActividadAdministrativa = ({ datos }: any) => {
    // Calcular totales
    const totalCargaHoraria = datos.reduce((sum: number, item: any) => 
        sum + (parseFloat(item.cargaHoraria) || 0), 0
    );

    const totalGanado = datos.reduce((sum: number, item: any) => 
        sum + (parseFloat(item.totalGanado) || 0), 0
    );

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-[10px] border border-[#B7C8E7] leading-loose rounded-lg overflow-hidden">
                <thead className="bg-[#B7C8E7]">
                    <tr>
                        <th className="border border-[#B7C8E7] p-2 font-bold">NOMBRE DE LA INSTITUCIÓN PÚBLICA O PRIVADA</th>
                        <th className="border border-[#B7C8E7] p-2 font-bold">NIVEL O CARGO OCUPACIONAL</th>
                        <th className="border border-[#B7C8E7] p-2 font-bold">ACTIVIDAD PÚBLICA O PRIVADA</th>
                        <th className="border border-[#B7C8E7] p-2 font-bold">DÍAS Y HORARIO DE FUNCIONES</th>
                        <th className="border border-[#B7C8E7] p-2 font-bold">CARGA HORARIA T/CM/T</th>
                        <th className="border border-[#B7C8E7] p-2 font-bold">TOTAL GANADO SOLO INST.PÚBLICAS(Bs)</th>
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {datos.map((item: any, index: number) => (
                        <tr key={index} className="hover:bg-gray-50">
                            <td className="border-2 border-dashed border-[#B7C8E7] p-2 uppercase">{item.nombreInstitucion || '-'}</td>
                            <td className="border-2 border-dashed border-[#B7C8E7] p-2 uppercase">{item.nivelCargoOcupacional || '-'}</td>
                            <td className="border-2 border-dashed border-[#B7C8E7] p-2 uppercase">{item.actividadPublicaPrivada || '-'}</td>
                            <td className="border-2 border-dashed border-[#B7C8E7] p-2 uppercase align-top text-xs">{renderHorariosPdf(item.horarios)}</td>
                            <td className="border-2 border-dashed border-[#B7C8E7] p-2 uppercase text-center">{item.cargaHoraria || '-'}</td>
                            <td className="border-2 border-dashed border-[#B7C8E7] p-2 uppercase text-right font-semibold">{item.totalGanado || '0.00'}</td>
                        </tr>
                    ))}
                    {/* Fila de totales */}
                    <tr className="bg-white">
                        <td colSpan={4} className="border-2 border-dashed border-[#B7C8E7] p-2 text-right">TOTALES:</td>
                        <td className="border-2 border-dashed border-[#B7C8E7] p-2 text-center">{totalCargaHoraria.toFixed(0)}</td>
                        <td className="border-2 border-dashed border-[#B7C8E7] p-2 text-right">{totalGanado.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

const TablaProfesionalJubilado = ({ datos }: any) => {
    // Calcular total del monto
    const totalMonto = datos.reduce((sum: number, item: any) => 
        sum + (parseFloat(item.montoTitular) || 0), 0
    );

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-[10px] border border-[#B7C8E7] leading-loose rounded-lg overflow-hidden">
                <thead className="bg-[#B7C8E7]">
                    <tr>
                        <th className="border border-[#B7C8E7] p-2 font-bold">NOMBRE DE LA INSTITUCIÓN PÚBLICA O PRIVADA</th>
                        <th className="border border-[#B7C8E7] p-2 font-bold">NIVEL / CARGO</th>
                        <th className="border border-[#B7C8E7] p-2 font-bold">FECHA DE JUBILACIÓN</th>
                        <th className="border border-[#B7C8E7] p-2 font-bold"> MONTO SOLO TITULAR SENASIR COMPENSACIÓN DE COTIZACIÓN CCM MENSUAL(Bs.) (Bs)</th>
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {datos.map((item: any, index: number) => (
                        <tr key={index} className="hover:bg-gray-50">
                            <td className="border-2 border-dashed border-[#B7C8E7] p-2 uppercase">{item.nombreInstitucion || '-'}</td>
                            <td className="border-2 border-dashed border-[#B7C8E7] p-2 uppercase">{item.nivelCargo || '-'}</td>
                            <td className="border-2 border-dashed border-[#B7C8E7] p-2 text-center">{formatFecha(item.fechaDeJubilacion)}</td>
                            <td className="border-2 border-dashed border-[#B7C8E7] p-2 text-right font-semibold">{item.montoTitular || '0.00'}</td>
                        </tr>
                    ))}
                    {/* Fila de totales */}
                    <tr className="bg-white">
                        <td colSpan={3} className="border-2 border-dashed border-[#B7C8E7] p-2 text-right">TOTAL:</td>
                        <td className="border-2 border-dashed border-[#B7C8E7] p-2 text-right">{totalMonto.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

const TablaOtraInformacion = ({ datos }: any) => {
    // Calcular total del monto de descuento
    const totalDescuento = datos.reduce((sum: number, item: any) => 
        sum + (parseFloat(item.montoDescuento) || 0), 0
    );

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-[10px] border border-[#B7C8E7] leading-loose rounded-lg overflow-hidden">
                <thead className="bg-[#B7C8E7]">
                    <tr>
                        <th className="border border-[#B7C8E7] p-2 font-bold">DESCRIPCIÓN DE LA FORMA DE ADECUACIÓN EFECTUADA U OTRA INFORMACIÓN DE LA PRESENTE DECLARACIÓN JURADA</th>
                        <th className="border border-[#B7C8E7] p-2 font-bold">INSTITUCIÓN</th>
                        <th className="border border-[#B7C8E7] p-2 font-bold"> DOCUMENTO DE RESPALDO DE LA ADECUACIÓN</th>
                        <th className="border border-[#B7C8E7] p-2 font-bold">MONTO DESCUENTO CUT(Bs.)</th>
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {datos.map((item: any, index: number) => (
                        <tr key={index} className="hover:bg-gray-50">
                            <td className="border-2 border-dashed border-[#B7C8E7] p-2 uppercase">{item.descripcionAdecuacion || '-'}</td>
                            <td className="border-2 border-dashed border-[#B7C8E7] p-2 uppercase">{item.institucion || '-'}</td>
                            <td className="border-2 border-dashed border-[#B7C8E7] p-2 uppercase">{item.documentoRespaldo || '-'}</td>
                            <td className="border-2 border-dashed border-[#B7C8E7] p-2 text-right font-semibold">{item.montoDescuento || '0.00'}</td>
                        </tr>
                    ))}
                    {/* Fila de totales */}
                    <tr className="bg-white">
                        <td colSpan={3} className="border-2 border-dashed border-[#B7C8E7] p-2 text-right">TOTAL:</td>
                        <td className="border-2 border-dashed border-[#B7C8E7] p-2 text-right">{totalDescuento.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

    return (
        <div id="pdf-content" className="bg-white shadow-2xl border-2 border-gray-300 w-full max-w-[210mm] mx-auto">
          
           {/* IMAGEN CABECERA */}
        <img
            src="/images/cabeza.png"
            alt="Cabecera"
            className="w-full h-auto block"
        />

            {/* ✅ DOCUMENTO CONTINUO SIN PAGINACIÓN */}
            <div className="pt-0 px-6 pb-6 text-sm">
                {/* ENCABEZADO */}
                <div className=" text-centers">
                    <div className="mb-2">
                         <div className="border-t border-b border-black py-2 text-center w-full">
                            <h1 className="text-xs font-bold uppercase text-gray-900 text-center leading-none">
                                DECLARACIÓN JURADA DE DOBLE PERCEPCIÓN, COMPATIBILIDAD DE HORARIOS Y REMUNERACIÓN MÁXIMA PERMITIDA
                            </h1>
                            <p className="text-xs font-bold text-gray-900 text-center mt-0">
                                MES DECLARADO: {getMesDeclarado().toUpperCase()}
                            </p>
                        </div>    
                    </div>
                </div>

                {/* II. DATOS PERSONALES */}
                <div className="mb-2">

                {/* TÍTULO */}
                <h3 className="  font-bold text-black text-[11px]  uppercase mb-1">
                    II. DATOS PERSONALES:
                </h3>

                {/* RECUADRO PRINCIPAL */}
                <div className="border border-dashed border-gray-400 rounded-lg px-6 py-0.5 text-[11px] text-gray-900">

                    {/* FILA 1 */}
                    <div className="grid grid-cols-[calc(12.5cm)_1fr] gap-4 mb-2 ">
                    <div>
                    <span className="font-semibold">NOMBRES Y APELLIDOS:</span>{' '}
                    <span className="italic">
                        {[
                        data.datosPersonales?.nombres?.toUpperCase(),
                        data.datosPersonales?.paterno?.toUpperCase(),
                        data.datosPersonales?.materno?.toUpperCase(),
                        data.datosPersonales?.apellidoCasada
                            ? `de ${data.datosPersonales.apellidoCasada.toUpperCase()}`
                            : null
                        ].filter(Boolean).join(' ')}
                    </span>
                    </div>
                    <div className="ml-[0.1cm]">
                        <span className="font-semibold">FECHA DE NACIMIENTO:</span>{' '}
                        <span className="uppercase italic">
                        {formatFecha(data.datosPersonales?.fechaNacimiento)}
                        </span>
                    </div>
                    </div>

                    {/* FILA 2 */}
                    <div className="grid grid-cols-[calc(12.5cm)_1fr] gap-4 mb-2">
                    <div>
                        <span className="font-semibold">TIPO DE DOCUMENTO:</span>{' '}
                        <span className="uppercase italic">
                        {data.datosPersonales?.documentoIdentidad?.tipo}
                        </span>
                    </div>
                    <div className="ml-[0.1cm]">
                        <span className="font-semibold">NÚMERO DE CI: </span>{' '}
                        <span className="uppercase italic">
                        {data.datosPersonales?.documentoIdentidad?.numero}
                        </span>
                    </div>
                    </div>

                    {/* FILA 3 */}
                    <div className="grid grid-cols-[calc(12.5cm)_1fr] gap-4 mb-2">
                    <div>
                        <span className="font-semibold">ZONA:</span>{' '}
                        <span className="uppercase italic">
                        {data.datosPersonales?.direccion?.zona}
                        </span>
                    </div>  
                    <div className="ml-[0.1cm]">
                        <span className="font-semibold">NÚMERO CELULAR:</span>{' '}
                        <span className="uppercase italic">
                        {data.datosPersonales?.celular}
                        </span>
                    </div>
                    </div>

                     {/* FILA 4 */}
                        <div className="grid grid-cols-[calc(12.5cm)_1fr] gap-4 mb-2">
                        <div>
                            <span className="font-semibold">CALLE/AVENIDA:</span>{' '}
                            <span className="uppercase italic">
                            {data.datosPersonales?.direccion?.calle}

                            {data.datosPersonales?.direccion?.avenida
                            ? `, ${data.datosPersonales.direccion.avenida}`
                            : ''}

                            {data.datosPersonales?.direccion?.numeroDomicilio
                            ? ` N° ${data.datosPersonales.direccion.numeroDomicilio}`
                            : ''}
                            </span>
                        </div>
                        {data.datosPersonales?.direccion?.urbanizacion && (
                        <div className="ml-[0.1cm]">
                            <span className="font-semibold">URBANIZACIÓN:</span>{' '}
                            <span className="uppercase italic">
                            {data.datosPersonales.direccion.urbanizacion}
                            </span>
                        </div>
                        )}

                        </div>

                   

                    {/* FILA 5 */}
                    <div>
                    <span className="font-semibold">
                        CORREO ELECTRÓNICO INSTITUCIONAL / PERSONAL:
                    </span>{' '}
                    <span className="uppercase italic">
                    {data.datosPersonales?.correoElectronico}
                    </span>
                    </div>

                </div>
                </div>


                {/* III. ACTIVIDAD DOCENTE */}
                <div >
                    <div>
                        <h3 className="  font-bold text-black text-[11px]  uppercase mb-1">
                            III. ACTIVIDAD DOCENTE Y/O ADMINISTRATIVA EN LA UPEA
                        </h3>
                    </div>
                    <div className="p-4 bg-white">
                        {tieneDatosSeccion(data.actividadDocente) ? (
                            <TablaActividadDocente datos={data.actividadDocente} />
                        ) : (
                            <NoAplica />
                        )}
                        <div className="text-xs mt-3 p-3  -ml-3 ">
                            <p>(*) Adjuntar boleta de pago</p>
                            <p>(*) Debe incluir cursos extracurriculares</p>
                        </div>
                    </div>
                </div>

                {/* IV. ACTIVIDAD EXTRA UNIVERSITARIA */}
                <div >
                    <div >
                        <h3 className="font-bold text-black text-[11px]  uppercase mb-1">
                            IV. ACTIVIDAD EXTRA UNIVERSITARIA
                        </h3>
                    </div>
                    <div className="p-4 bg-white">
                        {tieneDatosSeccion(data.actividadExtraUniversitaria) ? (
                            <TablaActividadExtra datos={data.actividadExtraUniversitaria} />
                        ) : (
                            <NoAplica />
                        )}
                        <div className="text-xs mt-3 p-3  -ml-3 ">
                            <p>(*) Adjuntar boleta de pago o certificación</p>
                            <p>(*) Adjuntar contrato o memorándum de designación</p>
                        </div>
                    </div>
                </div>

                {/* V. ACTIVIDAD ADMINISTRATIVA */}
                <div >
                    <div >
                        <h3 className="font-bold text-black text-[11px]  uppercase mb-1">
                            V. ACTIVIDAD ADMINISTRATIVA EN OTRAS INSTITUCIONES
                        </h3>
                    </div>
                    <div className="p-4 bg-white">
                        {tieneDatosSeccion(data.actividadAdministrativa) ? (
                            <TablaActividadAdministrativa datos={data.actividadAdministrativa} />
                        ) : (
                            <NoAplica />
                        )}
                        <div className="text-xs mt-3 p-3  -ml-3 ">
                            <p>(*) Adjuntar boleta de pago o certificación</p>
                            <p>(*) Adjuntar contrato o memorándum</p>
                        </div>
                    </div>
                </div>

                {/* VI. PROFESIONAL JUBILADO */}
                <div >
                    <div>
                        <h3 className="font-bold text-black text-[11px]  uppercase mb-1">
                            VI. PROFESIONAL JUBILADO
                        </h3>
                    </div>
                    <div className="p-4 bg-white">
                        {tieneDatosSeccion(data.profesionalJubilado) ? (
                            <TablaProfesionalJubilado datos={data.profesionalJubilado} />
                        ) : (
                            <NoAplica />
                        )}
                        <div className="text-xs mt-3 p-3  -ml-3 ">
                            <p>(*)Solo para docentes jubilados</p>
                            <p>(*)Adjuntar fotocopia de boleta de renta</p>
                        </div>
                    </div>
                </div>

                {/* VII. OTRA INFORMACIÓN */}
                <div >
                    <div >
                        <h3 className="font-bold text-black text-[11px]  uppercase mb-1">
                            VII. OTRA INFORMACIÓN
                        </h3>
                    </div>
                    <div className="p-4 bg-white">
                        {tieneDatosSeccion(data.otraInformacion) ? (
                            <TablaOtraInformacion datos={data.otraInformacion} />
                        ) : (
                            <NoAplica />
                        )}
                        <div className="text-xs mt-3 p-3  -ml-3 ">
                            <p>(*) Adjuntar documento de adecuación</p>
                            <p>(*) Adjuntar boleta de pago</p>
                        </div>
                    </div>
                </div>


                {/* FIRMAS */}
                <div className=" mt-8 pt-6">
                    <div className="text-center mb-6">
                        <p className="font-semibold text-[11px] italic text-right">
                            EL ALTO, {new Date().toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            }).toLowerCase()}
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-12">

                {/* IZQUIERDA */}
                <div className="text-left text-xs space-y-3">

                    {/* FIRMA */}
                    <div className="flex items-center gap-2">
                        <span className="italic w-[4cm]">Firma</span>
                        <span>:</span>
                        <span className="flex-[1.5] border-b border-dotted border-black"></span>
                    </div>

                    {/* NOMBRES */}
                    <div className="flex items-center gap-2">
                        <span className="italic w-[4cm]">Nombre(s) y Apellidos</span>
                        <span className="flex-1 items-center gap-2 italic">
                            : {data.datosPersonales?.nombres} {data.datosPersonales?.paterno} {data.datosPersonales?.materno}
                        </span>
                    </div>

                    {/* CI */}
                    <div className="flex items-center gap-2">
                        <span className="italic w-[4cm]">No. de Cédula de Identidad</span>
                        <span className="flex-1">
                            : {data.datosPersonales?.documentoIdentidad?.numero} {data.datosPersonales?.documentoIdentidad?.expedido}
                        </span>
                    </div>

                    {/* ESPACIO EN BLANCO 3 CM */}
                    <div className="h-[3cm]"></div>
                </div>

              
            </div>


                </div>
            </div>

        </div>
    );
};