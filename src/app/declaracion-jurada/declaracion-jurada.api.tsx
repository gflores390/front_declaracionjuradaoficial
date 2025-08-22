import { DeclaracionData, declaracionForm } from "./declaracion-jurada.interface";

// const { NEST_API_URL } = process.env;
const URL = process.env.NEXT_PUBLIC_API_URL;

export const getDeclaracionJurada = async (): Promise<DeclaracionData[]> => {
    try {
        const response = await fetch(`${URL}/declaracion-jurada`,
            { cache: "no-store" });
        const data = await response.json();
        return data;
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