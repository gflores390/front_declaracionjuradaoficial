"use client";
import { useEffect, useState } from "react";

interface PdfDeclaracionProps {
    data: any;
}

export const PdfDeclaracion = ({ data }: PdfDeclaracionProps) => {
    const [hora, setHora] = useState("");

    const formatFecha = (fechaStr: string) => {
        if (!fechaStr) return '';
        try {
            const fecha = new Date(fechaStr);
            return fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
        } catch {
            return fechaStr;
        }
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

    // COMPONENTES AUXILIARES
    const CampoPdf = ({ label, valor }: any) => {
        if (!valor || valor === "" || valor === "NINGUNA") return null;
        return (
            <div className="flex border-b border-gray-200 pb-2 mb-2">
                <span className="font-semibold text-gray-700 text-xs w-2/5">{label}:</span>
                <span className="text-gray-900 text-xs flex-1">{valor}</span>
            </div>
        );
    };

    const NoAplica = () => (
        <div className="text-center py-3 text-gray-500 italic text-sm bg-gray-50 rounded">
            No aplica
        </div>
    );

    const InstruccionesPdf = ({ children }: any) => (
        <div className="text-xs mt-3 p-3 bg-blue-50 rounded border-l-4 border-blue-400">
            <p className="font-semibold text-blue-900">(*) Documentos requeridos:</p>
            <ul className="list-disc list-inside space-y-1 mt-1 text-blue-800">
                {children}
            </ul>
        </div>
    );

    const TablaActividadDocente = ({ datos }: any) => (
        <div className="overflow-x-auto">
            <table className="w-full text-[10px] border border-gray-300">
                <thead className="bg-blue-50">
                    <tr>
                        <th className="border border-gray-300 p-2 font-bold">DEPENDENCIA</th>
                        <th className="border border-gray-300 p-2 font-bold">CARRERA/INSTITUTO</th>
                        <th className="border border-gray-300 p-2 font-bold">MATERIA/CARGO</th>
                        <th className="border border-gray-300 p-2 font-bold">CATEGORÍA</th>
                        <th className="border border-gray-300 p-2 font-bold">CARGA HORARIA</th>
                        <th className="border border-gray-300 p-2 font-bold">TOTAL (Bs)</th>
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {datos.map((item: any, index: number) => (
                        <tr key={index} className="hover:bg-gray-50">
                            <td className="border border-gray-300 p-2">{item.dependencia || '-'}</td>
                            <td className="border border-gray-300 p-2">{item.carreraInstituto || '-'}</td>
                            <td className="border border-gray-300 p-2">{item.materiaSigla || '-'}</td>
                            <td className="border border-gray-300 p-2">{item.categoriaDocente || '-'}</td>
                            <td className="border border-gray-300 p-2 text-center">{item.cargaHoraria || '-'}</td>
                            <td className="border border-gray-300 p-2 text-right font-semibold">{item.totalGanadoBs || '0.00'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const TablaActividadExtra = ({ datos }: any) => (
        <div className="overflow-x-auto">
            <table className="w-full text-[10px] border border-gray-300">
                <thead className="bg-green-50">
                    <tr>
                        <th className="border border-gray-300 p-2 font-bold">INSTITUCIÓN</th>
                        <th className="border border-gray-300 p-2 font-bold">CARGO</th>
                        <th className="border border-gray-300 p-2 font-bold">TIPO</th>
                        <th className="border border-gray-300 p-2 font-bold">HORAS</th>
                        <th className="border border-gray-300 p-2 font-bold">TOTAL (Bs)</th>
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {datos.map((item: any, index: number) => (
                        <tr key={index} className="hover:bg-gray-50">
                            <td className="border border-gray-300 p-2">{item.nombreInstitucion || '-'}</td>
                            <td className="border border-gray-300 p-2">{item.nivelCargoOcupacional || '-'}</td>
                            <td className="border border-gray-300 p-2">{item.actividadPublicaPrivada || '-'}</td>
                            <td className="border border-gray-300 p-2 text-center">{item.cargaHoraria || '-'}</td>
                            <td className="border border-gray-300 p-2 text-right font-semibold">{item.totalGanado || '0.00'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const TablaActividadAdministrativa = ({ datos }: any) => (
        <div className="overflow-x-auto">
            <table className="w-full text-[10px] border border-gray-300">
                <thead className="bg-purple-50">
                    <tr>
                        <th className="border border-gray-300 p-2 font-bold">INSTITUCIÓN</th>
                        <th className="border border-gray-300 p-2 font-bold">CARGO</th>
                        <th className="border border-gray-300 p-2 font-bold">TIPO</th>
                        <th className="border border-gray-300 p-2 font-bold">HORAS</th>
                        <th className="border border-gray-300 p-2 font-bold">TOTAL (Bs)</th>
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {datos.map((item: any, index: number) => (
                        <tr key={index} className="hover:bg-gray-50">
                            <td className="border border-gray-300 p-2">{item.nombreInstitucion || '-'}</td>
                            <td className="border border-gray-300 p-2">{item.nivelCargoOcupacional || '-'}</td>
                            <td className="border border-gray-300 p-2">{item.actividadPublicaPrivada || '-'}</td>
                            <td className="border border-gray-300 p-2 text-center">{item.cargaHoraria || '-'}</td>
                            <td className="border border-gray-300 p-2 text-right font-semibold">{item.totalGanado || '0.00'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const TablaProfesionalJubilado = ({ datos }: any) => (
        <div className="overflow-x-auto">
            <table className="w-full text-[10px] border border-gray-300">
                <thead className="bg-orange-50">
                    <tr>
                        <th className="border border-gray-300 p-2 font-bold">INSTITUCIÓN</th>
                        <th className="border border-gray-300 p-2 font-bold">CARGO</th>
                        <th className="border border-gray-300 p-2 font-bold">FECHA JUBILACIÓN</th>
                        <th className="border border-gray-300 p-2 font-bold">MONTO (Bs)</th>
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {datos.map((item: any, index: number) => (
                        <tr key={index} className="hover:bg-gray-50">
                            <td className="border border-gray-300 p-2">{item.nombreInstitucion || '-'}</td>
                            <td className="border border-gray-300 p-2">{item.nivelCargo || '-'}</td>
                            <td className="border border-gray-300 p-2 text-center">{formatFecha(item.fechaJubilacion)}</td>
                            <td className="border border-gray-300 p-2 text-right font-semibold">{item.montoMensual || '0.00'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const TablaOtraInformacion = ({ datos }: any) => (
        <div className="overflow-x-auto">
            <table className="w-full text-[10px] border border-gray-300">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="border border-gray-300 p-2 font-bold">DESCRIPCIÓN</th>
                        <th className="border border-gray-300 p-2 font-bold">INSTITUCIÓN</th>
                        <th className="border border-gray-300 p-2 font-bold">DOCUMENTO</th>
                        <th className="border border-gray-300 p-2 font-bold">MONTO (Bs)</th>
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {datos.map((item: any, index: number) => (
                        <tr key={index} className="hover:bg-gray-50">
                            <td className="border border-gray-300 p-2">{item.descripcion || '-'}</td>
                            <td className="border border-gray-300 p-2">{item.institucion || '-'}</td>
                            <td className="border border-gray-300 p-2">{item.documentoRespaldo || '-'}</td>
                            <td className="border border-gray-300 p-2 text-right font-semibold">{item.montoDescuento || '0.00'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div id="pdf-content" className="bg-white shadow-2xl border-2 border-gray-300 w-full max-w-[210mm] mx-auto">
          
           {/* IMAGEN CABECERA */}
        <img
            src="/images/cabeza.png"
            alt="Cabecera"
            className="w-full h-auto block"
        />

            {/* ✅ DOCUMENTO CONTINUO SIN PAGINACIÓN */}
            <div className="p-6 space-y-4 text-sm">
                {/* ENCABEZADO */}
                <div className="border-b-4 border-black pb-4 mb-6">
                    <div className="flex justify-between items-start mb-2">
                        <div className="text-left text-xs">
                            <p className="font-semibold">Posgrado</p>
                            <p>{new Date().toLocaleDateString("es-ES")}</p>
                            <p>Hrs: {hora}</p>
                        </div>
                        <div className="text-center flex-1 px-4">
                            <h1 className="text-xl font-black uppercase text-gray-900 leading-tight">
                                DECLARACIÓN JURADA DE DOBLE PERCEPCIÓN, COMPATIBILIDAD DE HORARIOS Y REMUNERACIÓN MÁXIMA PERMITIDA
                            </h1>
                            <p className="text-base font-bold text-blue-700 mt-2">
                                MES DECLARADO: {getMesDeclarado()}
                            </p>
                        </div>
                        <div className="text-right text-xs">
                            <p className="font-semibold">@PSG</p>
                        </div>
                    </div>
                </div>

                {/* I. MARCO LEGAL */}
                <div className="border-2 border-gray-300 rounded-lg overflow-hidden mb-6">
                    <div className="px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700">
                        <h3 className="font-black text-white text-sm uppercase tracking-wide">
                            I. MARCO LEGAL
                        </h3>
                    </div>
                    <div className="p-4 text-xs text-justify space-y-3 bg-gray-50">
                        <p className="leading-relaxed">
                            <strong className="text-blue-900">De conformidad al Decreto Supremo N° 5301, mediante ley 1613 del 01 de enero de 2025,</strong> aprueba el Presupuesto General del Estado, para su vigilancia durante la Gestión Fiscal del 1 de Enero al 31 de Diciembre de 2025 y que conforme se establece lo siguiente:
                        </p>
                        
                        <div className="pl-4 space-y-3">
                            <div className="bg-white p-3 rounded border-l-4 border-blue-500">
                                <strong className="text-blue-900">Artículo 38. (Remuneración máxima en el sector público):</strong>
                                <div className="pl-4 mt-2 space-y-2">
                                    <p><strong>I.</strong> Si los ingresos son similares o exceden a la remuneración máxima permitida, las áreas administrativas-financieras de las entidades contratantes verificarán la adecuación de las remuneraciones percibidas hasta el límite fijado por Ley.</p>
                                    <p><strong>II.</strong> Los montos excedentarios a la remuneración máxima establecida para el sector público, constituyen deudas imprescriptibles por daño económico al Estado.</p>
                                </div>
                            </div>
                            
                            <div className="bg-white p-3 rounded border-l-4 border-red-500">
                                <strong className="text-red-900">Artículo 39. (Doble Percepción):</strong>
                                <div className="pl-4 mt-2 space-y-2">
                                    <p><strong>I.</strong> Se prohíbe la doble percepción de remuneraciones por concepto de ingresos como servidor público o consultor de línea.</p>
                                    <p><strong>II.</strong> Las entidades públicas deberán contar con una nota escrita de sus servidores que certifique la no percepción de otras remuneraciones con recursos públicos.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* II. DATOS PERSONALES */}
                <div className="border-2 border-gray-300 rounded-lg overflow-hidden mb-6">
                    <div className="px-4 py-3 bg-gradient-to-r from-green-600 to-green-700">
                        <h3 className="font-black text-white text-sm uppercase tracking-wide">
                            II. DATOS PERSONALES
                        </h3>
                    </div>
                    <div className="p-4 space-y-3 bg-white">
                        <div className="grid grid-cols-2 gap-4">
                            <CampoPdf 
                                label="NOMBRES Y APELLIDOS" 
                                valor={`${data.datosPersonales?.nombres || ''} ${data.datosPersonales?.paterno || ''} ${data.datosPersonales?.materno || ''}`.trim()}
                            />
                            <CampoPdf 
                                label="FECHA DE NACIMIENTO" 
                                valor={formatFecha(data.datosPersonales?.fechaNacimiento)} 
                            />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <CampoPdf label="TIPO DE DOCUMENTO" valor={data.datosPersonales?.documentoIdentidad?.tipo} />
                            <CampoPdf label="NÚMERO" valor={data.datosPersonales?.documentoIdentidad?.numero} />
                        </div>

                        <div className="grid grid-cols-4 gap-4">
                            <CampoPdf label="ZONA" valor={data.datosPersonales?.direccion?.zona} />
                            <CampoPdf label="AVENIDA" valor={data.datosPersonales?.direccion?.avenida} />
                            <CampoPdf label="CALLE" valor={data.datosPersonales?.direccion?.calle} />
                            <CampoPdf label="NÚMERO" valor={data.datosPersonales?.direccion?.numeroDomicilio} />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <CampoPdf label="TELÉFONO" valor={data.datosPersonales?.telefonoDomicilio} />
                            <CampoPdf label="CELULAR" valor={data.datosPersonales?.celular} />
                            <CampoPdf label="CORREO ELECTRÓNICO" valor={data.datosPersonales?.correoElectronico} />
                        </div>
                    </div>
                </div>

                {/* III. ACTIVIDAD DOCENTE */}
                <div className="border-2 border-gray-300 rounded-lg overflow-hidden mb-6">
                    <div className="px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700">
                        <h3 className="font-black text-white text-sm uppercase tracking-wide">
                            III. ACTIVIDAD DOCENTE Y/O ADMINISTRATIVA EN LA UPEA
                        </h3>
                    </div>
                    <div className="p-4 bg-white">
                        {tieneDatosSeccion(data.actividadDocente) ? (
                            <TablaActividadDocente datos={data.actividadDocente} />
                        ) : (
                            <NoAplica />
                        )}
                        <InstruccionesPdf>
                            <li>Adjuntar boleta de pago</li>
                            <li>Debe incluir cursos extracurriculares</li>
                        </InstruccionesPdf>
                    </div>
                </div>

                {/* IV. ACTIVIDAD EXTRA UNIVERSITARIA */}
                <div className="border-2 border-gray-300 rounded-lg overflow-hidden mb-6">
                    <div className="px-4 py-3 bg-gradient-to-r from-orange-600 to-orange-700">
                        <h3 className="font-black text-white text-sm uppercase tracking-wide">
                            IV. ACTIVIDAD EXTRA UNIVERSITARIA
                        </h3>
                    </div>
                    <div className="p-4 bg-white">
                        {tieneDatosSeccion(data.actividadExtraUniversitaria) ? (
                            <TablaActividadExtra datos={data.actividadExtraUniversitaria} />
                        ) : (
                            <NoAplica />
                        )}
                        <InstruccionesPdf>
                            <li>Adjuntar boleta de pago o certificación</li>
                            <li>Adjuntar contrato o memorándum de designación</li>
                        </InstruccionesPdf>
                    </div>
                </div>

                {/* V. ACTIVIDAD ADMINISTRATIVA */}
                <div className="border-2 border-gray-300 rounded-lg overflow-hidden mb-6">
                    <div className="px-4 py-3 bg-gradient-to-r from-pink-600 to-pink-700">
                        <h3 className="font-black text-white text-sm uppercase tracking-wide">
                            V. ACTIVIDAD ADMINISTRATIVA EN OTRAS INSTITUCIONES
                        </h3>
                    </div>
                    <div className="p-4 bg-white">
                        {tieneDatosSeccion(data.actividadAdministrativa) ? (
                            <TablaActividadAdministrativa datos={data.actividadAdministrativa} />
                        ) : (
                            <NoAplica />
                        )}
                        <InstruccionesPdf>
                            <li>Adjuntar boleta de pago o certificación</li>
                            <li>Adjuntar contrato o memorándum</li>
                        </InstruccionesPdf>
                    </div>
                </div>

                {/* VI. PROFESIONAL JUBILADO */}
                <div className="border-2 border-gray-300 rounded-lg overflow-hidden mb-6">
                    <div className="px-4 py-3 bg-gradient-to-r from-teal-600 to-teal-700">
                        <h3 className="font-black text-white text-sm uppercase tracking-wide">
                            VI. PROFESIONAL JUBILADO
                        </h3>
                    </div>
                    <div className="p-4 bg-white">
                        {tieneDatosSeccion(data.profesionalJubilado) ? (
                            <TablaProfesionalJubilado datos={data.profesionalJubilado} />
                        ) : (
                            <NoAplica />
                        )}
                        <InstruccionesPdf>
                            <li>Solo para docentes jubilados</li>
                            <li>Adjuntar fotocopia de boleta de renta</li>
                        </InstruccionesPdf>
                    </div>
                </div>

                {/* VII. OTRA INFORMACIÓN */}
                <div className="border-2 border-gray-300 rounded-lg overflow-hidden mb-6">
                    <div className="px-4 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700">
                        <h3 className="font-black text-white text-sm uppercase tracking-wide">
                            VII. OTRA INFORMACIÓN
                        </h3>
                    </div>
                    <div className="p-4 bg-white">
                        {tieneDatosSeccion(data.otraInformacion) ? (
                            <TablaOtraInformacion datos={data.otraInformacion} />
                        ) : (
                            <NoAplica />
                        )}
                        <InstruccionesPdf>
                            <li>Adjuntar documento de adecuación</li>
                            <li>Adjuntar boleta de pago</li>
                        </InstruccionesPdf>
                    </div>
                </div>

                {/* VIII. COMPATIBILIDAD Y SUMATORIA */}
                <div className="border-2 border-gray-300 rounded-lg overflow-hidden mb-6">
                    <div className="px-4 py-3 bg-gradient-to-r from-red-600 to-red-700">
                        <h3 className="font-black text-white text-sm uppercase tracking-wide">
                            VIII. COMPATIBILIDAD Y SUMATORIA
                        </h3>
                    </div>
                    
                    <div className="p-4 bg-white">
                        <div className="grid grid-cols-2 gap-6 mb-4">
                            <div className="space-y-3">
                                <CampoPdf label="COMPATIBILIDAD DE HORARIOS" valor="✓ NO TENER COLISIÓN DE HORARIOS" />
                                <CampoPdf label="COMPATIBILIDAD DE CARGA HORARIA" valor="✓ NO SUPERO EL TIEMPO ESTABLECIDO" />
                            </div>
                            <div className="space-y-3">
                                <CampoPdf label="COMPATIBILIDAD SALARIAL" valor="✓ NO SUPERO LA REMUNERACIÓN MÁXIMA" />
                                <CampoPdf label="SUMATORIA TOTAL (Bs.)" valor="Bs 0,00" />
                            </div>
                        </div>
                        
                        <div className="text-xs p-3 bg-yellow-50 rounded border-l-4 border-yellow-500">
                            <p className="font-semibold text-yellow-900">⚠️ IMPORTANTE:</p>
                            <p className="text-yellow-800 mt-1">Si acaso incurriere en incompatibilidad funcionaria comprobada, autorizo expresamente el descuento de lo percibido en demasía, incluido los aportes patronales.</p>
                        </div>

                        <div className="mt-4 space-y-3 text-xs">
                            <p className="font-semibold">De igual manera con referencia a los ingresos percibidos con recursos públicos:</p>
                            
                            <div className="flex items-center gap-4 bg-gray-50 p-3 rounded">
                                <span>¿Son iguales o superiores al del Presidente del Estado?</span>
                                <div className="flex gap-3">
                                    <span className="border-2 border-gray-300 px-3 py-1 rounded">SI [ ]</span>
                                    <span className="border-2 border-gray-300 px-3 py-1 rounded">NO [ ]</span>
                                </div>
                            </div>

                            <p className="text-justify leading-relaxed p-3 bg-blue-50 rounded">
                                <strong>DECLARACIÓN:</strong> Por la descripción que antecede expreso juramento formal sobre la información otorgada, por lo que no me hallo comprendido en incompatibilidad de trabajo con otra institución PÚBLICA O PRIVADA en colisión de horarios u otro obstáculo que impida el eficiente desarrollo de mis actividades.
                            </p>

                            <p className="text-justify leading-relaxed p-3 bg-green-50 rounded">
                                <strong>COMPROMISO:</strong> Declaro que la información proporcionada es fidedigna, pudiendo el Área de Recursos Humanos verificar la misma en cualquier momento. Me comprometo a realizar la actualización de los datos en 48 horas de producido cualquier cambio.
                            </p>
                        </div>
                    </div>
                </div>

                {/* FIRMAS */}
                <div className="border-t-4 border-black mt-8 pt-6">
                    <div className="text-center mb-6">
                        <p className="font-bold text-lg">
                            EL ALTO, {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()}
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-12">
                        <div className="text-center">
                            <div className="h-24 border-b-2 border-black mb-3"></div>
                            <p className="text-sm font-black uppercase">FIRMA DEL DECLARANTE</p>
                            <p className="text-xs mt-2 font-semibold">
                                {data.datosPersonales?.nombres} {data.datosPersonales?.paterno} {data.datosPersonales?.materno}
                            </p>
                            <p className="text-xs text-gray-600">
                                C.I.: {data.datosPersonales?.documentoIdentidad?.numero} {data.datosPersonales?.documentoIdentidad?.expedido}
                            </p>
                        </div>
                        
                        <div className="text-center">
                            <div className="h-24 border-b-2 border-black mb-3"></div>
                            <p className="text-sm font-black uppercase">SELLO Y FIRMA</p>
                            <p className="text-xs mt-2 text-gray-600">ÁREA DE RECURSOS HUMANOS</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};