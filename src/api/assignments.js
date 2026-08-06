import { apiUrl } from "../services/config.js";
import { fetchApi } from "../utils/fetchApi.js";

// ===== CAPA API - ASIGNACIONES =====
// Las asignaciones son la relación "tarea <-> usuario".
// url        = /api/assignments  (todas las asignaciones).
// urlTasks   = /api/tasks  -> para pedir los usuarios de una tarea.
// urlUsers   = /api/users  -> para pedir las tareas de un usuario.
let url = `${apiUrl}/assignments`;
let urlTasks = `${apiUrl}/tasks`;
let urlUsers = `${apiUrl}/users`;

export const assignmentsApi = {
    get: async () => {
        // GET a /assignments -> todas las asignaciones.
        // Se usa en updateTaskWithAssignments para calcular qué
        // asignaciones agregar o quitar.
        return await fetchApi(url);
    },
    getById: async (id) => {
        // GET a /assignments/{id} -> una asignación por su id.
        return await fetchApi(`${url}/${id}`);
    },
    getByTaskId: async (id) => {
        // GET a /tasks/{id}/users -> usuarios asignados a una tarea.
        // Se usa cuando se pulsa "Actualizar" para precargar chips.
        return await fetchApi(`${urlTasks}/${id}/users`);
    },
    getByUserId: async (id) => {
        // GET a /users/{id}/tasks -> tareas de un usuario.
        return await fetchApi(`${urlUsers}/${id}/tasks`);
    },
    create: async (assignmentData) => {
        // POST a /assignments -> crea una asignación tarea-usuario.
        return await fetchApi(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(assignmentData),
        });
    },
    delete: async (id) => {
        // DELETE a /assignments/{id} -> elimina una asignación.
        return await fetchApi(`${url}/${id}`, {
            method: "DELETE",
        });
    },
};
