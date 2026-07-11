import { handleApiError } from "./handleApiError.js";

export const fetchApi = async (url, options = {}, statusMap = {}, defaultMessage = "Error en la petición") => {
    let response;
    try {
        response = await fetch(url, options);
    } catch {
        throw new Error("Servicio no disponible");
    }
    return handleApiError(response, defaultMessage, statusMap);
};
