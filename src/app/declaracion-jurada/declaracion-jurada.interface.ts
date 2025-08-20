interface DocumentoIdentidad {
    tipo: string;
    numero: string;
    expedido: string;
}
interface Direccion {
    zona: string;
    urbanizacion: string;
    avenida: string;
    calle: string;
    numeroDomicilio: string;
}
interface DatosPersonales {
    documentoIdentidad: DocumentoIdentidad;
    nombres: string;
    paterno: string;
    materno: string;
    apellidoCasada: string;
    fechaNacimiento: Date;
    direccion: Direccion;
    telefonoDomicilio: string;
    celular: string;
    correoElectronico: string;
}
interface ActividadDocenteAdministrativaData {
    dependenciaDecanaturaArea: string;
    carreraInstituto: string;
    materiaCargo: string;
    categoriaDocenteAdministrativo: string;
    cargaHoraria: string;
    dias: string;
    horasHorarios: string;
    totalGanadoBs: string;
}
interface ActividadDocenteAdministrativa {
    data: ActividadDocenteAdministrativaData;
    bonoDeAntiguedad: string;
    totalGanadoTotalBs: string;
}
interface ActividadExtraUniversitaria {
    nombreInstitucion: string;
    nivelCargoOcupacional?: string;
    actividadPublicaPrivada: string;
    diasLaborales: string;
    tiempoCompletoCargaHoraria: string;
    totalGanado: string;
}
interface ActividadAdministrativa {
    nombreInstitucion: string;
    nivelCargoOcupacional: string;
    actividadPublicaPrivada: string;
    modalidadContrato: string;
    diasHorarioFunciones: string;
    cargaHoraria: string;
    totalGanado: string;
}
interface ProfesionalJubilado {
    nombreInstitucion: string;
    nivelCargo: string;
    fechaDeJubilacion: Date;
    montoTitular: string;
}
interface OtraInformacion {
    descripcionAdecuacionSalarial: string;
    institucion: string;
    documentoRespaldo: string;
    montoDescuento: string;
}
interface Formulario {
    formulario: string;
    usuario: string;
    fecha: Date;
}

export interface DeclaracionData {
    _id: string;
    datosPersonales: DatosPersonales;
    actividadDocenteAdministrativa: ActividadDocenteAdministrativa[];
    actividadExtraUniversitaria: ActividadExtraUniversitaria[];
    actividadAdministrativa: ActividadAdministrativa[];
    profesionalJubilado: ProfesionalJubilado[];
    otraInformacion: OtraInformacion[];
    formulario: Formulario;
    __v: number;
}

export interface Inputs {
    _id: string;
    datosPersonales: DatosPersonales;
    actividadDocenteAdministrativa: ActividadDocenteAdministrativa[];
    actividadExtraUniversitaria: ActividadExtraUniversitaria[];
    actividadAdministrativa: ActividadAdministrativa[];
    profesionalJubilado: ProfesionalJubilado[];
    otraInformacion: OtraInformacion[];
    formulario: Formulario;
    __v: number;
}