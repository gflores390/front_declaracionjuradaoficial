import { DeclaracionData, declaracionForm } from "./declaracion-jurada.interface";

// const { NEST_API_URL } = process.env;
const URL = process.env.NEXT_PUBLIC_API_URL;

export const getDeclaracionJurada = async (): Promise<DeclaracionData[]> => {
    try {
        const response = await fetch(`${URL}/declaracion-jurada`,
            { cache: "no-store" });
        // console.log("Fetching Declaracion Jurada from API:", response);
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

export const createDeclaracionJurada = async (declaracion: declaracionForm): Promise<DeclaracionData> => {
    console.log("POST URL:", URL + "/declaracion-jurada");
    console.log("Body:", declaracion);
    try {
        // const response = await fetch(`${URL}/declaracion-jurada`, {
        const response = await fetch(`http://localhost:3000/api/v1/declaracion-jurada`, {
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