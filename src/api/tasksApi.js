import { apiUrl } from "../services/config.js";
import { fetchApi } from "../utils/fetchApi.js";

// ===== CAPA API - TAREAS =====
// Aquí se definen las peticiones HTTP contra el backend.
// url = "http://localhost:3000/api/tasks" (base del endpoint).
let url = `${apiUrl}/tasks`;

export const tasksApi = {
    get: async () => {
        // GET a /tasks -> obtiene todas las tareas.
        return await fetchApi(url);
    },
    getById: async (id) => {
        // GET a /tasks/{id} -> obtiene una tarea por su id.
        return await fetchApi(`${url}/${id}`);
    },
    create: async (taskData) => {
        // POST a /tasks -> crea una tarea enviando los datos en JSON.
        return await fetchApi(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(taskData),
        });
    },
    // ===== ACTUALIZAR TAREA (update) =====
    // Recibe dos parámetros:
    //   id       -> el id de la tarea que se va a actualizar.
    //   taskData -> el cuerpo con los datos actualizados de la tarea.
    // Hace una petición PATCH al endpoint /tasks/{id} y envía el
    // cuerpo como JSON (JSON.stringify convierte el objeto a texto).
    update: async (id, taskData) => {
        return await fetchApi(`${url}/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(taskData),
        });
        // AQUÍ TERMINA EL FRONTEND: el PATCH llega al backend y
        // el flujo de actualización lo explica el siguiente compañero.
    },
    delete: async (id) => {
        // DELETE a /tasks/{id} -> elimina una tarea por su id.
        return await fetchApi(`${url}/${id}`, {
            method: "DELETE",
        });
    },
};
