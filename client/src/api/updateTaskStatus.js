import { apiTasks } from "../services/config.js";
import { fetchApi } from "../utils/fetchApi.js";

export const updateTaskStatus = async (taskId, status) => {
    return fetchApi(`${apiTasks}/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
    }, {
        404: "Tarea no encontrada",
        500: "Error interno del servidor",
    }, "Error al actualizar el estado de la tarea");
};
