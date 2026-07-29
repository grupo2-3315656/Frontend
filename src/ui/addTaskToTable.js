import { tasksTable, taskCount, incrementTotalTasks, getTotalTasks } from "../services/config.js";
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

    const statusText = getStatusLabel(task.status);
    const assignedUsers = task.assignedUsers || [];
    const usersList = assignedUsers.map((u) => u.name).join(", ");
    const userInitial = assignedUsers.length > 0 ? usersList.charAt(0).toUpperCase() : task.title.charAt(0).toUpperCase();

    taskCard.innerHTML = `
    
        <div class="message-card__header">

            <div class="message-card__user">
                <div class="message-card__avatar">
                    ${userInitial}
                </div>

                <div>
                    <div class="message-card__username">
                        ${task.title}
                    </div>
                    
                    ${assignedUsers.length > 0 ? `<div class="message-card__title">Asignado: ${usersList}</div>` : ""}
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
            ${
                task.status !== "completada"
                    ? `<button type="button" class="btn btn--success btnComplete" data-id="${task.id}">
                        Completar
                    </button>`
                    : ""
            }
            <button type="button" class="btn btn--secondary btnUpdate" data-id="${task.id}">
                Actualizar
            </button>
            <button type="button" class="btn btn--secondary btnDelete" data-id="${task.id}">
                Eliminar
            </button>
        </div>
    `;

    tasksTable.prepend(taskCard);

    incrementTotalTasks();
    taskCount.textContent = `${getTotalTasks()} Tareas`;
};
