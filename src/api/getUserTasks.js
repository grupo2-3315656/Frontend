import { apiUrl } from "../services/config.js";
import { fetchApi } from "../utils/fetchApi.js";

export const getUserTasks = async (userId) => {
    const data = await fetchApi(`${apiUrl}/${userId}?_embed=tasks`, {}, {
        500: "Error interno del servidor al obtener tareas",
    }, "Error al obtener las tareas");

    return data.tasks || [];
};
