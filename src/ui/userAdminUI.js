export const renderUserCard = (user) => {
    const initial = user.name ? user.name.charAt(0).toUpperCase() : "?";
    return `
        <div class="user-card" data-user-id="${user.id}">
            <div class="user-card__header">
                <div class="user-card__avatar">${initial}</div>
                <div class="user-card__info">
                    <h4 class="user-card__name">${user.name}</h4>
                    <p class="user-card__email">${user.email}</p>
                    <p class="user-card__doc">Doc: ${user.id}</p>
                </div>
            </div>
            <div class="user-card__actions">
                <button class="btn btn--primary btn--sm btn-admin-update" data-id="${user.id}" data-name="${user.name}" data-email="${user.email}">
                    ✏️ Actualizar
                </button>
                <button class="btn btn--danger btn--sm btn-admin-delete" data-id="${user.id}">
                    🗑️ Eliminar
                </button>
            </div>
        </div>
    `;
};

export const renderUsersList = (users, container) => {
    if (!users || users.length === 0) {
        container.innerHTML = `
            <div class="messages-empty">
                <div class="messages-empty__icon">👥</div>
                <p class="messages-empty__text">No hay usuarios registrados</p>
            </div>
        `;
        return;
    }
    container.innerHTML = users.map(renderUserCard).join("");
};

export const renderSingleUser = (user, container) => {
    container.innerHTML = renderUserCard(user);
};

export const toggleAdminPanel = (panel, arrow) => {
    const isHidden = panel.classList.contains("hidden");
    if (isHidden) {
        panel.classList.remove("hidden");
        arrow.textContent = "▲";
    } else {
        panel.classList.add("hidden");
        arrow.textContent = "▼";
    }
};
