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
        `<span class="user-chip" data-initial="${u.name.charAt(0).toUpperCase()}">
            ${u.name}
            <button type="button" class="user-chip__remove" data-value="${u.id}">&times;</button>
        </span>`
    ).join("");
};

selectedUsersContainer.addEventListener("click", (e) => {
    const btn = e.target.closest(".user-chip__remove");
    if (!btn) return;

    const option = Array.from(taskUsers.options).find(o => o.value === btn.dataset.value);
    if (option) {
        option.selected = false;
        taskUsers.dispatchEvent(new Event("change"));
    }
});

taskUsers.addEventListener("change", updateSelectedUsers);
