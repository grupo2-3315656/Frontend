import { clearTasks, showEmptyTasks, addTaskToTable, tasksOrderBar, showErrorMessage } from "../ui/index.js";
import { filterTasksList } from "./filterService.js";
import { getAllTasksWithUsers } from "./adminService.js";
import { taskCount, userTasksSection } from "./config.js";

// ===== RENDERIZAR TAREAS FILTRADAS =====
// Limpia la tabla, aplica los filtros activos (título/estado)
// y dibuja cada tarea como una tarjeta en la tabla.
export const renderFilteredTasks = (tasksToRender) => {
    clearTasks();

    if (!tasksToRender.length) {
        showEmptyTasks();
        return;
    }

    const filteredTasks = filterTasksList(tasksToRender);

    if (!filteredTasks.length) {
        showEmptyTasks();
        return;
    }

    tasksOrderBar();
    filteredTasks.forEach(addTaskToTable);
};

// ===== CARGAR TODAS LAS TAREAS =====
// Busca todas las tareas junto con sus usuarios asignados,
// actualiza el contador y vuelve a renderizar la tabla.
// Se llama al final del crear/actualizar para refrescar la vista.
export const loadAllTasks = async () => {
    try {
        const tasks = await getAllTasksWithUsers();
        const tasksArray = Array.isArray(tasks) ? tasks : [];
        taskCount.textContent = `${tasksArray.length} Tareas`;
        userTasksSection.style.display = "";

        if (tasksArray.length > 0) {
            renderFilteredTasks(tasks);
        } else {
            clearTasks();
            showEmptyTasks();
        }

        return tasks;
    } catch (error) {
        showErrorMessage(error.message);
        return [];
    }
};