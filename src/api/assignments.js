import { apiUrl } from "../services/config.js";
import { fetchApi } from "../utils/fetchApi.js";

// Las asignaciones son la relación "una tarea se le asigna a un usuario".
// url      -> /api/assignments (todas las asignaciones).
// urlTasks -> /api/tasks (para pedir los usuarios de una tarea).
// urlUsers -> /api/users (para pedir las tareas de un usuario).
let url = `${apiUrl}/assignments`;
let urlTasks = `${apiUrl}/tasks`;
let urlUsers = `${apiUrl}/users`;

export const assignmentsApi = {
    get: async () => {
        // Trae todas las asignaciones. La usa el flujo de actualizar
        // para comparar qué asignaciones hay que agregar o quitar.
        return await fetchApi(url);
    },
    getById: async (id) => {
        // Trae una asignación por su id.
        return await fetchApi(`${url}/${id}`);
    },
    getByTaskId: async (id) => {
        // Trae los usuarios asignados a una tarea. Se usa al pulsar
        // "Actualizar" para precargar los chips de los asignados.
        return await fetchApi(`${urlTasks}/${id}/users`);
    },
    getByUserId: async (id) => {
        // Trae las tareas de un usuario.
        return await fetchApi(`${urlUsers}/${id}/tasks`);
    },
    create: async (assignmentData) => {
        // Crea una asignación (le asigna una tarea a un usuario).
        return await fetchApi(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(assignmentData),
        });
    },
    delete: async (id) => {
        // Elimina una asignación.
        return await fetchApi(`${url}/${id}`, {
            method: "DELETE",
        });
    },
};
