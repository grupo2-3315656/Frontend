import { tasksTable } from "../services/config.js";

let textHtml = `
<div class="card__order-bar">
                    <label for="status-order" class="form__label"
                        >Ordenar Tareas:</label
                    >
                    <select
                        id="status-order"
                        class="form__input form__input--filter"
                    >
                        <option value="">Seleccione orden</option>
                        <option value="date">Fecha de creación</option>
                        <option value="name">Nombre de la tarea</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="en-progreso">En Progreso</option>
                        <option value="completada">Completada</option>
                    </select>
                </div>
`;

export const tasksOrderBar = async () => {
    const existing = document.querySelector(".card__order-bar");
    if (existing) existing.remove();
    tasksTable.insertAdjacentHTML("beforebegin", textHtml);
};
