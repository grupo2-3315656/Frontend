import { usersApi } from "../api/usersApi.js";
import { assignmentsApi } from "../api/assignments.js";
import {
    userForm,
    userFormName,
    userFormEmail,
    userFormSubmitBtn,
    usersTableContainer,
} from "./config.js";
import { setTextContent } from "../ui/index.js";
import { renderUsersTable } from "../ui/usersTable.js";
import { showMessage, showErrorMessage } from "../ui/notifications.js";

export const searchUser = async (document) => {
    const user = await usersApi.getById(document);
    const tasks = await assignmentsApi.getByUserId(user.id);
    return { user, tasks };
};

export const loadUsers = async ({ getAllUsers, onEdit, onDelete }) => {
    try {
        const allUsers = await getAllUsers();
        const usersArray = Array.isArray(allUsers) ? allUsers : [];
        const countEl = document.getElementById("users-count");
        if (countEl) {
            countEl.textContent = `${usersArray.length} Usuarios`;
        }
        renderUsersTable(usersArray, usersTableContainer, {
            onEdit,
            onDelete,
        });
        return usersArray;
    } catch (error) {
        showErrorMessage(error.message);
        return [];
    }
};

export const handleEditUser = (user) => {
    userFormName.value = user.name;
    userFormEmail.value = user.email || "";
    setTextContent(userFormSubmitBtn, "Actualizar Usuario");
    setTextContent(
        document.getElementById("user-form-title"),
        "Actualizar Usuario",
    );
    userForm.scrollIntoView({ behavior: "smooth", block: "center" });
    userFormName.focus();
    return user.id;
};

export const handleDeleteUser = async ({ userId, deleteUser, onDeleted }) => {
    try {
        await deleteUser(userId);
        showMessage("Usuario eliminado correctamente");
        await onDeleted();
    } catch (error) {
        showErrorMessage(error.message);
    }
};
