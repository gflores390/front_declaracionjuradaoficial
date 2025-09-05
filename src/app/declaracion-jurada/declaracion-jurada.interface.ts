
interface DocumentoIdentidad {
    tipo: string;
    numero: string;
    expedido?: string;
}
interface Direccion {
    zona?: string;
    urbanizacion?: string;
    avenida?: string;
    calle?: string;
    numeroDomicilio?: string;
}
interface DatosPersonales {
    documentoIdentidad: DocumentoIdentidad;
    nombres: string;
    paterno?: string;
    materno?: string;
    apellidoCasada?: string;
    fechaNacimiento: Date;
    direccion: Direccion;
    telefonoDomicilio?: string;
    celular: string;
    correoElectronico: string;
}

interface Horarios {
    dia?: string;
    inicio?: string;
    fin?: string;
    orden?: number;
}

interface ActividadDocente {
    dependenciaDecanaturaArea?: string;
    carreraInstituto?: string;
    materiaSigla?: string;
    categoriaDocente?: string;
    cargo?: string;
    cargaHoraria?: number;
    horarios?: Horarios[];
    totalGanadoBs?: number;
}

interface ActividadExtraUniversitaria {
    nombreInstitucion?: string;
    nivelCargoOcupacional?: string;
    actividadPublicaPrivada?: string;
    horarios?: Horarios[];
    cargaHoraria?: number;
    totalGanado?: number;
}

interface ActividadAdministrativa {
    nombreInstitucion?: string;
    nivelCargoOcupacional?: string;
    actividadPublicaPrivada?: string;
    modalidadContrato?: string;
    horarios?: Horarios[];
    cargaHoraria?: number;
    totalGanado?: number;
}

interface ProfesionalJubilado {
    nombreInstitucion?: string;
    nivelCargo?: string;
    fechaDeJubilacion?: Date;
    montoTitular?: number;
}
interface OtraInformacion {
    descripcionAdecuacion?: string;
    institucion?: string;
    documentoRespaldo?: string;
    montoDescuento?: number;
}

interface CompatibilidadSumatoria {
    compatibilidadHorario?: string;
    compatibilidadCargaHorario?: string;
    compatibilidadSalarial?: string;
    sumatoriaTotal?: number;
}


interface DatosFormularioDeclaracion {
    fechaDeclarada?: Date;
    remuneracionSector?: number;
}
export interface DeclaracionData {
    _id: string;
    datosPersonales: DatosPersonales;
    actividadDocente: ActividadDocente[];
    actividadExtraUniversitaria: ActividadExtraUniversitaria[];
    actividadAdministrativa: ActividadAdministrativa[];
    profesionalJubilado: ProfesionalJubilado[];
    otraInformacion: OtraInformacion[];
    compatibilidadSumatoria?: CompatibilidadSumatoria;
    datosFormulario?: DatosFormularioDeclaracion;
    __v: number;
}
export interface Inputs {
    _id: string;
    datosPersonales: DatosPersonales;
    actividadDocente: ActividadDocente[];
    actividadExtraUniversitaria: ActividadExtraUniversitaria[];
    actividadAdministrativa: ActividadAdministrativa[];
    profesionalJubilado: ProfesionalJubilado[];
    otraInformacion: OtraInformacion[];
    compatibilidadSumatoria?: CompatibilidadSumatoria;
    datosFormulario?: DatosFormularioDeclaracion;
    __v: number;
}

export type declaracionForm = Omit<DeclaracionData, '_id' | '__v'>;



