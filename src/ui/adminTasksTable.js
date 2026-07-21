import { setInnerHtml } from "./index.js";
import { getStatusLabel } from "../utils/index.js";

export const renderAdminTasks = (tasks, container) => {
    const tasksArray = Array.isArray(tasks) ? tasks : [];

    if (!tasksArray.length) {
        setInnerHtml(
            container,
            `
            <div class="messages-empty">
                <div class="messages-empty__icon">📋</div>
                <p class="messages-empty__text">No hay tareas registradas</p>
                <p class="messages-empty__subtext">No se encontraron tareas en el sistema.</p>
            </div>
        `,
        );
        return;
    }

    const html = tasksArray
        .map((task) => {
            const statusText = getStatusLabel(task.status);
            const usersList = (task.assignedUsers || [])
                .map((u) => u.name)
                .join(", ");
            const usersDisplay = usersList || "Sin asignar";
            const userInitial = usersList ? usersList.charAt(0).toUpperCase() : "?";

            return `
            <div class="message-card admin-task-card" data-task-id="${task.id}">
                <div class="message-card__header">
                    <div class="message-card__user">
                        <div class="message-card__avatar">${userInitial}</div>
                        <div>
                            <div class="message-card__username">${task.title}</div>
                            <div class="message-card__title">Asignado: ${usersDisplay}</div>
                        </div>
                    </div>
                    <span class="task-badge task-badge--${task.status}">
                        ${statusText}
                    </span>
                </div>
                <div class="message-card__body">
                    <div class="message-card__content">
                        ${task.description || "Sin descripción"}
                    </div>
                </div>
            </div>
        `;
        })
        .join("");

    setInnerHtml(container, html);
};
