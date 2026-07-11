import { tasksTable } from "../services/config.js";

const removeOrderBar = () => {
    const orderBar = document.querySelector(".card__order-bar");
    if (orderBar) orderBar.remove();
};

export const showEmptyTasks = () => {
    removeOrderBar();
    tasksTable.innerHTML = `
        <div class="messages-empty">
            <div class="messages-empty__icon">📋</div>
            <p class="messages-empty__text">El usuario no tiene tareas</p>
            <p class="messages-empty__subtext">Registre una nueva tarea.</p>
        </div>
    `;
};
