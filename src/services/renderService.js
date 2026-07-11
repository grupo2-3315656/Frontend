import { clearTasks, showEmptyTasks, addTaskToTable, tasksOrderBar } from "../ui/index.js";
import { filterTasksList } from "./filterService.js";

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