import { DeclaracionData, declaracionForm } from "./declaracion-jurada.interface";

// const { NEST_API_URL } = process.env;
const URL = process.env.NEXT_PUBLIC_API_URL;

export const getDeclaracionJurada = async (
    { offset, limit }: { offset: number; limit: number }
): Promise<{
    declaracionJurada: DeclaracionData[];
    totalPages: number;
}> => {
    try {
        const response = await fetch(`${URL}/declaracion-jurada?limit=${limit}&offset=${offset}`,
            { cache: "no-store" });
        const data = await response.json();
        return {
            declaracionJurada: data.declaracion || [],
            totalPages: data.totalPages,
        };
    } catch (error) {
        throw error;
    }
}

export const createDeclaracionJurada = async (declaracion: declaracionForm): Promise<DeclaracionData> => {
    try {
        const response = await fetch(`${URL}/declaracion-jurada`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(declaracion),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Error al crear la Declaracion Jurada");
        return data;
    } catch (error) {
        throw error;
    }
};

export const deleteDeclaracion = async (id: string): Promise<{ message: string }> => {
    try {
        const response = await fetch(`${URL}/declaracion-jurada/${id}`, {
            method: "DELETE",
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Error al eliminar la Declaracion Jurada");
        return data;
    } catch (error) {
        throw error;
    }
}

export const getDeclaracion = async (id: string): Promise<DeclaracionData> => {
    try {
        const response = await fetch(`${URL}/declaracion-jurada/${id}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Error al obtener la Declaracion Jurada");
        return data;
    } catch (error) {
        throw error;
    }
}


export const updateDeclaracion = async (id: string, declaracion: declaracionForm): Promise<DeclaracionData> => {
    try {
        const response = await fetch(`${URL}/declaracion-jurada/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(declaracion),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Error al actualizar la Declaracion Jurada");
        return data;
    } catch (error) {
        throw error;
    }
}

// Buscar usuario por CI
export const verificacionCi = async (ci: string) => {
    try {
        const res = await fetch(`${URL}/declaracion-jurada/existe/${ci}`, {
            cache: "no-store",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Error al buscar usuario");
        return data;
    } catch (error) {
        throw error;
    }
};

// Buscar usuario por CI
export const searchUserByCI = async (ci: string) => {
    try {
        const res = await fetch(`${URL}/declaracion-jurada/persona/${ci}`, {
            cache: "no-store",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Error al buscar usuario");
        return data;
    } catch (error) {
        throw error;
    }
};


// Enviar OTP
export const sendOtpApi = async (celular: string, persona: string) => {
    try {
        const response = await fetch(`${URL}/declaracion-jurada/otp/enviar`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                celular, persona
            }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Error al enviar OTP");
        return data;
    } catch (error) {
        throw error;
    }
};

// Verificar OTP
export const verifyOtpApi = async (codigo: string) => {
    try {
        const response = await fetch(`${URL}/declaracion-jurada/otp/verificar`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ codigo }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Error al verificar OTP");
        return data;
    } catch (error) {
        throw error;
    }
};