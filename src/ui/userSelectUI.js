import { usersApi } from "../api/usersApi.js";
import { taskUsers, selectedUsersContainer } from "../services/config.js";

let selectedUsers = [];
let loaded = false;

const loadUsers = async () => {
    if (loaded) return;
    loaded = true;
    try {
        const users = await usersApi.get();
        taskUsers.innerHTML = `<option value="">Asignar a usuarios</option>` +
            users.map(u =>
                `<option value="${u.id}">${u.name}</option>`
            ).join("");
    } catch {
        taskUsers.innerHTML = "<option value=\"\">Error al cargar usuarios</option>";
    }
};

export const getSelectedUserIds = () => selectedUsers.map(u => u.id);

export const clearSelectedUsers = () => {
    selectedUsers = [];
    updateSelectedUsers();
};

export const setSelectedUsers = (users) => {
    selectedUsers = users.map(u => ({ id: u.id, name: u.name }));
    updateSelectedUsers();
};

const updateSelectedUsers = () => {
    selectedUsersContainer.innerHTML = selectedUsers.map(u =>
        `<span class="user-chip" data-initial="${u.name.charAt(0).toUpperCase()}">
            ${u.name}
            <button type="button" class="user-chip__remove" data-value="${u.id}">&times;</button>
        </span>`
    ).join("");
};

taskUsers.addEventListener("focus", loadUsers);

taskUsers.addEventListener("change", () => {
    const option = taskUsers.selectedOptions[0];
    if (!option || !option.value) return;

    const alreadySelected = selectedUsers.some(u => u.id === option.value);
    if (!alreadySelected) {
        selectedUsers.push({ id: option.value, name: option.textContent });
    }
    taskUsers.value = "";
    updateSelectedUsers();
});

selectedUsersContainer.addEventListener("click", (e) => {
    const btn = e.target.closest(".user-chip__remove");
    if (!btn) return;

    selectedUsers = selectedUsers.filter(u => u.id !== btn.dataset.value);
    updateSelectedUsers();
});
