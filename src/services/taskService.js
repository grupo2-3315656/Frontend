import { tasksApi } from "../api/tasksApi.js";
import { assignmentsApi } from "../api/assignments.js";

// Pequeño retardo para no saturar el servidor con peticiones seguidas.
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const createTask = async (taskData) => {
    // Delega la creación de la tarea a la capa API.
    return await tasksApi.create(taskData);
};

export const createTaskWithAssignments = async (taskData) => {
    // Separa los userIds (usuarios asignados) del resto de datos de la tarea.
    const { userIds, ...taskPayload } = taskData;
    // 1) Crea la tarea en el backend.
    const task = await tasksApi.create(taskPayload);

    // 2) Crea una asignación (relación tarea-usuario) por cada usuario,
    //    con una pequeña pausa de 1 segundo entre petición y petición.
    for (const userId of userIds) {
        await assignmentsApi.create({ taskId: task.id, userId });
        await delay(1000);
    }

    // Retorna la tarea ya creada.
    return task;
};

export const updateTask = async (taskId, taskData) => {
    // Actualiza solo los datos de la tarea (sin tocar asignaciones).
    return await tasksApi.update(taskId, taskData);
};

// ===== ACTUALIZAR TAREA CON SUS ASIGNACIONES =====
// Orquesta la actualización de la tarea y de los usuarios asignados.
// Recibe el taskId y el taskData (que trae userIds + el resto).
export const updateTaskWithAssignments = async (taskId, taskData) => {
    // SEPARA el id del resto del cuerpo del taskData:
    // userIds    -> lista de usuarios que deben quedar asignados.
    // taskPayload-> { title, description, status } (datos de la tarea).
    const { userIds, ...taskPayload } = taskData;

    // 1) Consulta todas las asignaciones existentes.
    const allAssignments = await assignmentsApi.get();
    // 2) Filtra solo las asignaciones de esta tarea.
    const currentAssignments = allAssignments.filter(a => a.taskId === taskId);
    // 3) Obtiene los usuarios que YA estaban asignados.
    const currentUserIds = currentAssignments.map(a => a.userId);

    // 4) Calcula diferencias:
    //    toAdd    -> usuarios nuevos que hay que asignar.
    //    toRemove -> asignaciones que ya no se quieren y hay que borrar.
    const toAdd = userIds.filter(id => !currentUserIds.includes(id));
    const toRemove = currentAssignments.filter(a => !userIds.includes(a.userId));

    // 5) Crea las asignaciones nuevas (una por usuario).
    for (const userId of toAdd) {
        await assignmentsApi.create({ taskId, userId });
        await delay(1000);
    }

    // 6) Elimina las asignaciones que ya no se necesitan.
    for (const assignment of toRemove) {
        await assignmentsApi.delete(assignment.id);
        await delay(1000);
    }

    // 7) Asignaciones listas: actualiza los datos de la tarea
    //    y devuelve la tarea actualizada (va a tasksApi.update).
    return await tasksApi.update(taskId, taskPayload);
};

export const deleteTask = async (taskId) => {
    // Delega la eliminación de la tarea a la capa API.
    return await tasksApi.delete(taskId);
};
