import { apiTasks } from "../services/config.js";
import { fetchApi } from "../utils/fetchApi.js";

export const deleteTask = async (taskId) => {
    return fetchApi(`${apiTasks}/${taskId}`, {
        method: "DELETE",
    }, {
        404: "Tarea no encontrada",
        500: "Error interno del servidor",
    }, "Error al eliminar la tarea");
};
