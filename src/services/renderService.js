import { clearTasks, showEmptyTasks, addTaskToTable, tasksOrderBar, showErrorMessage } from "../ui/index.js";
import { filterTasksList } from "./filterService.js";
import { getAllTasksWithUsers } from "./adminService.js";
import { taskCount, userTasksSection } from "./config.js";

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