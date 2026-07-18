import { usersApi } from "../api/usersApi.js";
import { taskUsers, selectedUsersContainer } from "../services/config.js";

export const loadUsers = async () => {
    try {
        const users = await usersApi.get();
        taskUsers.innerHTML = users.map(u =>
            `<option value="${u.id}">${u.name}</option>`
        ).join("");
    } catch {
        taskUsers.innerHTML = "<option value=\"\">Error al cargar usuarios</option>";
    }
};

const updateSelectedUsers = () => {
    const selected = Array.from(taskUsers.selectedOptions).map(o => ({
        id: o.value,
        name: o.textContent,
    }));
    selectedUsersContainer.innerHTML = selected.map(u =>
        `<span class="user-chip" data-initial="${u.name.charAt(0).toUpperCase()}">${u.name}</span>`
    ).join("");
};

taskUsers.addEventListener("change", updateSelectedUsers);
