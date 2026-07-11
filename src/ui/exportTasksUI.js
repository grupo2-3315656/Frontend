import { tasksTable } from "../services/config.js";
import { showInfoMessage, showErrorMessage } from "./notifications.js";
import { downloadAsJson } from "../utils/exportTasks.js";

const STATUS_PREFIX = "task-badge--";

const extractStatusFromClass = (badge) => {
    const classes = badge.className.split(" ");
    for (const cls of classes) {
        if (cls.startsWith(STATUS_PREFIX)) {
            return cls.slice(STATUS_PREFIX.length);
        }
    }
    return "sin-estado";
};

const getVisibleTasks = () => {
    const taskCards = tasksTable.querySelectorAll(".message-card");
    if (!taskCards.length) return [];

    return Array.from(taskCards).map((card) => {
        const title = card.querySelector(".message-card__title")?.textContent.trim() || "";
        const description = card.querySelector(".message-card__content")?.textContent.trim() || "";
        const badge = card.querySelector(".task-badge");
        const status = badge ? extractStatusFromClass(badge) : "sin-estado";

        return { id: card.id, title, description, status };
    });
};

export const handleExportTasks = () => {
    const tasks = getVisibleTasks();

    if (!tasks.length) {
        showInfoMessage("No hay tareas visibles para exportar");
        return;
    }

    downloadAsJson(tasks, "tareas.json");
};
