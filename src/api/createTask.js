import { apiTasks } from "../services/config.js";
import { fetchApi } from "../utils/fetchApi.js";

export const createTask = async (taskData) => {
    return fetchApi(apiTasks, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
    }, {
        400: "Datos de tarea inválidos",
        500: "Error interno del servidor",
    }, "Error al registrar la tarea");
};
