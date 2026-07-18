import { apiUrl } from "../services/config.js";
import { fetchApi } from "../utils/fetchApi.js";

export const getUserTasksList = async (userId) => {
    return fetchApi(`${apiUrl}/${userId}/tasks`, {}, {
        404: "No se encontraron tareas para el usuario",
        500: "Error interno del servidor al obtener tareas",
    }, "Error al obtener las tareas del usuario");
};
