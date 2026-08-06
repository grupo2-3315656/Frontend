import { usersApi } from "../api/usersApi.js";
import { taskUsers, selectedUsersContainer } from "../services/config.js";

// Acá se controla a qué usuarios se le asigna la tarea. selectedUsers
// guarda en memoria los elegidos ({ id, name }) y updateSelectedUsers()
// dibuja los chips con esos nombres debajo del select.
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

// Devuelve solo los ids de los usuarios seleccionados (lo que se
// manda al backend para las asignaciones).
export const getSelectedUserIds = () => selectedUsers.map(u => u.id);

// Vacía la selección y vuelve a dibujar (quedan cero chips).
export const clearSelectedUsers = () => {
    selectedUsers = [];
    updateSelectedUsers();
};

// Precarga los usuarios seleccionados: al editar, se llama con los
// usuarios que ya estaban asignados para que aparezcan en los chips.
export const setSelectedUsers = (users) => {
    selectedUsers = users.map(u => ({ id: u.id, name: u.name }));
    updateSelectedUsers();
};

// Redibuja los chips de los usuarios seleccionados.
const updateSelectedUsers = () => {
    selectedUsersContainer.innerHTML = selectedUsers.map(u =>
        `<span class="user-chip" data-initial="${u.name.charAt(0).toUpperCase()}">
            ${u.name}
            <button type="button" class="user-chip__remove" data-value="${u.id}">&times;</button>
        </span>`
    ).join("");
};

taskUsers.addEventListener("focus", loadUsers);

// Al elegir una opción en el select, se agrega ese usuario a la
// selección (si no estaba ya) y se deja el select en blanco.
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

// Si se hace clic en la X de un chip, ese usuario se quita de la selección.
selectedUsersContainer.addEventListener("click", (e) => {
    const btn = e.target.closest(".user-chip__remove");
    if (!btn) return;

    selectedUsers = selectedUsers.filter(u => u.id !== btn.dataset.value);
    updateSelectedUsers();
});
