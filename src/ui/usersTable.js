import { setInnerHtml, setTextContent } from "./index.js";

export const renderUsersTable = (users, container, { onEdit, onDelete }) => {
    const usersArray = Array.isArray(users) ? users : [];

    if (!usersArray.length) {
        setInnerHtml(
            container,
            `
            <div class="messages-empty">
                <div class="messages-empty__icon">👥</div>
                <p class="messages-empty__text">No hay usuarios registrados</p>
                <p class="messages-empty__subtext">Registre un nuevo usuario para comenzar.</p>
            </div>
        `,
        );
        return;
    }

    const html = usersArray
        .map((user) => {
            const initial = user.name ? user.name.charAt(0).toUpperCase() : "?";
            return `
            <div class="message-card user-card" data-user-id="${user.id}">
                <div class="message-card__header">
                    <div class="message-card__user">
                        <div class="message-card__avatar">${initial}</div>
                        <div>
                            <div class="message-card__username">${user.name}</div>
                            <div class="message-card__title">${user.email || "Sin email"}</div>
                        </div>
                    </div>
                    <span class="user-card__date">
                        ${user.date ? new Date(user.date).toLocaleDateString("es-CO") : ""}
                    </span>
                </div>
                <div class="message-card__body">
                    <div class="message-card__content">
                        ID: ${user.id}
                    </div>
                    <button type="button" class="btn btn--secondary btn--sm btn-edit-user" data-id="${user.id}">
                        Editar
                    </button>
                    <button type="button" class="btn btn--secondary btn--sm btn-delete-user" data-id="${user.id}">
                        Eliminar
                    </button>
                </div>
            </div>
        `;
        })
        .join("");

    setInnerHtml(container, html);

    container.querySelectorAll(".btn-edit-user").forEach((btn) => {
        btn.addEventListener("click", () => {
            const userId = btn.getAttribute("data-id");
            const user = usersArray.find((u) => u.id == userId);
            if (user) onEdit(user);
        });
    });

    container.querySelectorAll(".btn-delete-user").forEach((btn) => {
        btn.addEventListener("click", () => {
            const userId = btn.getAttribute("data-id");
            onDelete(userId);
        });
    });
};
