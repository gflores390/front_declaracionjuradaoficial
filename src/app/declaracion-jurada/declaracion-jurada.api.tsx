import { DeclaracionData } from "./declaracion-jurada.interface";

const { NEST_API_URL } = process.env;

export const getDeclaracionJurada = async (): Promise<DeclaracionData[]> => {
    try {
        const response = await fetch(`${NEST_API_URL}declaracion-jurada`,
            { cache: "no-store" });
        console.log("Fetching Declaracion Jurada from API:", response);
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}