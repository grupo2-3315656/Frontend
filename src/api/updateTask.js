import { apiTasks } from "../services/config.js";
import { fetchApi } from "../utils/fetchApi.js";

export const updateTask = async (taskId, taskData) => {
    return fetchApi(`${apiTasks}/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
    }, {
        404: "Tarea no encontrada",
        500: "Error interno del servidor",
    }, "Error al actualizar la tarea");
};
