import { apiUrl } from "../services/config.js";
import { fetchApi } from "../utils/fetchApi.js";

// Estas son las peticiones HTTP que le mandamos al backend para las
// tareas. url queda como "http://localhost:3000/api/tasks" y a partir
// de ahí armamos cada endpoint.
let url = `${apiUrl}/tasks`;

export const tasksApi = {
    get: async () => {
        // Pide todas las tareas (GET a /tasks).
        return await fetchApi(url);
    },
    getById: async (id) => {
        // Pide una sola tarea por su id (GET a /tasks/{id}).
        return await fetchApi(`${url}/${id}`);
    },
    create: async (taskData) => {
        // Crea una tarea nueva: POST a /tasks y le manda los datos
        // como JSON en el cuerpo de la petición.
        return await fetchApi(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(taskData),
        });
    },
    // Actualizar una tarea. Recibe dos cosas:
    // - id: el id de la tarea que se quiere tocar.
    // - taskData: el cuerpo con los datos ya actualizados.
    // Y haca una petición PATCH al endpoint /tasks/{id} mandándole
    // el cuerpo convertido a JSON. Hasta acá llega el frontend:
    // el PATCH pasa al backend y ese flujo lo explica otro compañero.
    update: async (id, taskData) => {
        return await fetchApi(`${url}/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(taskData),
        });
    },
    delete: async (id) => {
        // Borra una tarea (DELETE a /tasks/{id}).
        return await fetchApi(`${url}/${id}`, {
            method: "DELETE",
        });
    },
};
