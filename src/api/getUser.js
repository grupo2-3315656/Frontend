import { apiUrl } from "../services/config.js";
import { fetchApi } from "../utils/fetchApi.js";

export const getUserByDocument = async (documentValue) => {
    return fetchApi(`${apiUrl}/${documentValue}`, {}, {
        400: "Petición incorrecta",
        401: "No autorizado",
        403: "Acceso denegado",
        404: "Recurso no encontrado",
        500: "Error interno del servidor",
    }, "Error al buscar usuario");
};
