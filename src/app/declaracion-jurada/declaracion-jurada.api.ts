import axios from "axios";

const URL = process.env.NEXT_PUBLIC_API_URL;

if (!URL) {
  throw new Error("NEXT_PUBLIC_API_URL no está definida");
}


const api = axios.create({
  baseURL: URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ========= VERIFICAR CI ========= */
export const verificacionCi = async (ci: string) => {
  const response = await api.get(`/persona/codigo/${ci}`);
  return response.data;
};

/* ========= ENVIAR OTP ========= */
export const sendOtpApi = (data: {
  celular: string;
  personaCi: string;
}) => {
  return api.post(`/persona/codigo/enviar`, data);
};

/* ========= VERIFICAR OTP ========= */
export const verifyOtpApi = (data: {
  personaCi: string;
  codigo: string;
}) => {
   return axios.post(
    `${URL}/persona/codigo/verificar`,
    data,
    {
      withCredentials: true, 
    }
  );
};

// declaracion-jurada.api.ts

/* ========= OBTENER DECLARACION POR CI/MES/AÑO ========= */
export const getDeclaracionCiMesAnio = async (
  ci: string,
  mes: string,
  anio: number
) => {
  const response = await api.get(
    `/persona/declaracion-jurada/${ci}/${mes}/${anio}`
  );
  return response.data.data.declaracion;
};

/* ========= UPDATE DECLARACION ANTIGUA ========= */
export const updateDeclaracionAntigua = async (payload: any) => {
  const response = await api.put(`/declaracion-jurada`, payload);
  return response.data;
};

export const deleteDeclaracion = async (id: string) => {
  console.log('funcionalidad en desarrollo');
  
}