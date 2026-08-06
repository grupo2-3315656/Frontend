import { tasksApi } from "../api/tasksApi.js";
import { assignmentsApi } from "../api/assignments.js";

// Una pausa de 1 segundo entre petición y petición, para no
// saturar el backend cuando se hacen varias seguidas.
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const createTask = async (taskData) => {
    // Esta función solo le pasa la creación a la capa de API.
    return await tasksApi.create(taskData);
};

export const createTaskWithAssignments = async (taskData) => {
    // Separamos los userIds (los usuarios a asignar) del resto de datos.
    const { userIds, ...taskPayload } = taskData;
    // 1) Primero creamos la tarea en el backend.
    const task = await tasksApi.create(taskPayload);

    // 2) Por cada usuario creamos la asignación (la relación entre
    //    la tarea y ese usuario), con su pausa de 1 segundo entre una y otra.
    for (const userId of userIds) {
        await assignmentsApi.create({ taskId: task.id, userId });
        await delay(1000);
    }

    // Devolvemos la tarea que quedó creada.
    return task;
};

export const updateTask = async (taskId, taskData) => {
    // Actualiza solo los datos de la tarea, sin tocar asignaciones.
    // Por ejemplo, la usa el botón de "Completar tarea".
    return await tasksApi.update(taskId, taskData);
};

// Esta es la función clave del flujo de actualizar tarea: recibe el id
// de la tarea y el taskData, que trae los userIds además de los datos.
export const updateTaskWithAssignments = async (taskId, taskData) => {
    // Sacamos el id de la tarea aparte del resto del cuerpo:
    // - userIds     -> los usuarios que deben quedar asignados.
    // - taskPayload -> { title, description, status }, los datos de la tarea.
    const { userIds, ...taskPayload } = taskData;

    // 1) Traemos todas las asignaciones que existen.
    const allAssignments = await assignmentsApi.get();
    // 2) De ahí filtramos solo las de esta tarea.
    const currentAssignments = allAssignments.filter(a => a.taskId === taskId);
    // 3) Nos quedamos con los ids de los usuarios que ya estaban asignados.
    const currentUserIds = currentAssignments.map(a => a.userId);

    // 4) Comparamos lo que había contra lo que quedó:
    //    - toAdd    -> usuarios que no estaban y ahora se agregaron.
    //    - toRemove -> asignaciones viejas que ya no se quieren.
    const toAdd = userIds.filter(id => !currentUserIds.includes(id));
    const toRemove = currentAssignments.filter(a => !userIds.includes(a.userId));

    // 5) Creamos la asignación nueva para cada usuario agregado.
    for (const userId of toAdd) {
        await assignmentsApi.create({ taskId, userId });
        await delay(1000);
    }

    // 6) Borramos las asignaciones que ya no se necesitan.
    for (const assignment of toRemove) {
        await assignmentsApi.delete(assignment.id);
        await delay(1000);
    }

    // 7) Asignaciones al día. Ahora sí se actualizan los datos de la tarea
    //    llamando a tasksApi.update y se devuelve lo que respondió.
    return await tasksApi.update(taskId, taskPayload);
};

export const deleteTask = async (taskId) => {
    // Le delega la eliminación a la capa de API.
    return await tasksApi.delete(taskId);
};