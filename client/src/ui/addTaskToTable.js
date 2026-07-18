import {
    tasksTable,
    taskCount,
    getCurrentUser,
    incrementTotalTasks,
    getTotalTasks,
} from "../services/config.js";
import { getStatusLabel } from "../utils/index.js";

// ============================================
// AGREGAR TAREA A LA TABLA
// ============================================

export const addTaskToTable = (task) => {
    const emptyMessage = document.querySelector(".messages-empty");

    if (emptyMessage) {
        emptyMessage.remove();
    }

    const taskCard = document.createElement("div");
    taskCard.classList.add("message-card");
    if (task.id) {
        taskCard.id = `${task.id}`;
    }
    if (task.date) {
        taskCard.dataset.date = task.date;
    }

    const currentUser = getCurrentUser();

    const statuses = [
        { value: "pendiente", label: "Pendiente" },
        { value: "en-progreso", label: "En Progreso" },
        { value: "completada", label: "Completada" },
    ];

    const statusText = getStatusLabel(task.status);

    taskCard.innerHTML = `
        <div class="message-card__header">
            <div class="message-card__user">
                <div class="message-card__avatar">
                    ${currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                    <div class="message-card__username">
                        ${currentUser.name}
                    </div>
                    <div class="message-card__title">
                        ${task.title}
                    </div>
                </div>
            </div>
            <span class="task-badge task-badge--${task.status}">${statusText}</span>
        </div>
        <div class="message-card__body">
            <div class="message-card__content">
                ${task.description || "Sin descripción"}
            </div>
        </div>
        <div class="status-buttons">
            ${statuses.map(s => `
                <button type="button"
                    class="btn-status${task.status === s.value ? ' active' : ''}"
                    data-id="${task.id}"
                    data-status="${s.value}">
                    ${s.label}
                </button>
            `).join('')}
            <button type="button" class="btn btn--sm btnUpdate" data-id="${task.id}">
                Actualizar
            </button>
            <button type="button" class="btn btn--sm btnDelete" data-id="${task.id}">
                Eliminar
            </button>
        </div>
    `;

    tasksTable.prepend(taskCard);

    incrementTotalTasks();
    taskCount.textContent = `${getTotalTasks()} Tareas`;
};

export const renderUserTasks = (tasks, container) => {
    container.innerHTML = "";

    if (!tasks.length) {
        container.innerHTML = `
            <div class="messages-empty">
                <div class="messages-empty__icon">📋</div>
                <p class="messages-empty__text">No hay tareas registradas</p>
                <p class="messages-empty__subtext">Este usuario no tiene tareas asignadas.</p>
            </div>
        `;
        return;
    }

    tasks.forEach((task) => {
        const card = document.createElement("div");
        card.classList.add("message-card");
        if (task.id) card.id = `${task.id}`;
        if (task.date) card.dataset.date = task.date;

        const currentUser = getCurrentUser();
        const statusText = getStatusLabel(task.status);

        card.innerHTML = `
            <div class="message-card__header">
                <div class="message-card__user">
                    <div class="message-card__avatar">
                        ${currentUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div class="message-card__username">${currentUser.name}</div>
                        <div class="message-card__title">${task.title}</div>
                    </div>
                </div>
                <span class="task-badge task-badge--${task.status}">${statusText}</span>
            </div>
            <div class="message-card__body">
                <div class="message-card__content">${task.description || "Sin descripción"}</div>
            </div>
        `;

        container.appendChild(card);
    });
};
