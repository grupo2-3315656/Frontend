import { clearTasks, showEmptyTasks, addTaskToTable, tasksOrderBar, showErrorMessage } from "../ui/index.js";
import { filterTasksList } from "./filterService.js";
import { getAllTasksWithUsers } from "./adminService.js";
import { taskCount, userTasksSection } from "./config.js";

// Esta función se encarga de pintar las tareas en la tabla:
// primero la limpia, aplica los filtros que estén activos
// (título y estado) y dibuja cada tarea como una tarjeta.
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

// Recarga todas las tareas (junto con sus usuarios asignados),
// actualiza el contador y vuelve a pintar la tabla. Es la que se
// llama al final de crear/actualizar para ver el cambio al instante.
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