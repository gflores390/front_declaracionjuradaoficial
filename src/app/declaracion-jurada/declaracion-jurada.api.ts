import axios from "axios";

const URL = process.env.NEXT_PUBLIC_API_URL;

/* ========= VERIFICAR CI ========= */
export const verificacionCi = async (ci: string) => {
  const res = await fetch(`${URL}/persona/codigo/${ci}`, {
    cache: "no-store",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

/* ========= ENVIAR OTP ========= */
export const sendOtpApi = (data: {
  celular: string;
  personaCi: string;
}) => {
  return axios.post(`${URL}/persona/codigo/enviar`, data);
};

/* ========= VERIFICAR OTP ========= */
export const verifyOtpApi = (data: {
  persona_ci: string;
  codigo: string;
}) => {
  return axios.post(`${URL}/declaracion-jurada/otp/verificar`, data);
};
// declaracion-jurada.api.ts

// Agregar nueva función para obtener declaración por CI
export const getDeclaracionPorCi = async (ci: string) => {
  const response = await axios.get(`${URL}/declaracion-jurada/existe/${ci}`);
  return response.data.data.declaracion;
};

// Actualizar la función de update para usuarios antiguos
export const updateDeclaracionAntigua = async (payload: any) => {
  const response = await axios.put(`${URL}/declaracion-jurada`, payload);
  return response.data;
};