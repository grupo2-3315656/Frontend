import {
    btnSearch,
    userDocInput,
    searchError,
    userInfoDisplay,
    userTasksSection,
    taskForm,
    taskTitle,
    titleError,
    taskDesc,
    descError,
    taskStatus,
    statusError,
    usersError,
    tasksTable,
    filterTitle,
    filterStatus,
    btnExport,
    getCurrentUser,
    setCurrentUser,
    getEditingTaskId,
    setEditingTaskId,
    toggleTaskForm,
    clearTasks,
    showUserInfo,
    addTaskToTable,
    showMessage,
    showErrorMessage,
    showEmptyTasks,
    handleExportTasks,
    searchUser,
    createTask,
    createTaskWithAssignments,
    updateTask,
    updateTaskWithAssignments,
    deleteTask,
    filterTasksList,
    filterAdminTasks,
    renderFilteredTasks,
    isValidInput,
    getStatusLabel,
    setTextContent,
    setInnerHtml,
    handleError,
    tasksOrderBar,
    sortTasks,
    extractTasksFromDOM,
    getSelectedUserIds,
    clearSelectedUsers,
    setSelectedUsers,
    assignmentsApi,
    navTabs,
    viewUsers,
    viewAdmin,
    viewTasks,
    userForm,
    userFormName,
    userFormEmail,
    userFormNameError,
    userFormEmailError,
    usersTableContainer,
    userFormSubmitBtn,
    adminTasksContainer,
    adminTaskCount,
    adminFilterStatus,
    adminFilterUser,
    taskCount,
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
} from "./src/index.js";

import { getAllTasksWithUsers } from "./src/services/adminService.js";
import { renderUsersTable } from "./src/ui/usersTable.js";
import { renderAdminTasks } from "./src/ui/adminTasksTable.js";

let allTasks = [];
let allUsers = [];
let editingUserId = null;
let adminAllTasks = [];

// ============================================
// NAVEGACIÓN POR TABS
// ============================================
function switchView(viewId) {
    document.querySelectorAll(".view").forEach((v) => {
        v.style.display = "none";
    });
    navTabs.forEach((tab) => {
        tab.classList.remove("nav__tab--active");
    });

    const targetView = document.getElementById(viewId);
    if (targetView) {
        targetView.style.display = "";
    }

    const activeTab = document.querySelector(`[data-view="${viewId}"]`);
    if (activeTab) {
        activeTab.classList.add("nav__tab--active");
    }

    if (viewId === "view-users") {
        loadUsers();
    } else if (viewId === "view-admin") {
        loadAdminTasks();
    } else if (viewId === "view-tasks") {
        loadAllTasks();
    }
}

navTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        const viewId = tab.getAttribute("data-view");
        switchView(viewId);
    });
});

// ============================================
// MÓDULO DE USUARIOS - CARGAR USUARIOS
// ============================================
async function loadUsers() {
    try {
        allUsers = await getAllUsers();
        const usersArray = Array.isArray(allUsers) ? allUsers : [];
        const countEl = document.getElementById("users-count");
        if (countEl) {
            countEl.textContent = `${usersArray.length} Usuarios`;
        }
        renderUsersTable(usersArray, usersTableContainer, {
            onEdit: handleEditUser,
            onDelete: handleDeleteUser,
        });
    } catch (error) {
        showErrorMessage(error.message);
    }
}

// ============================================
// MÓDULO DE USUARIOS - CREAR / ACTUALIZAR
// ============================================
userForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = userFormName.value.trim();
    const email = userFormEmail.value.trim();

    setTextContent(userFormNameError, "");
    setTextContent(userFormEmailError, "");

    if (!isValidInput(name)) {
        setTextContent(userFormNameError, "Debe ingresar un nombre");
        showErrorMessage("Debe ingresar un nombre");
        return;
    }

    if (!isValidInput(email)) {
        setTextContent(userFormEmailError, "Debe ingresar un email");
        showErrorMessage("Debe ingresar un email");
        return;
    }

    try {
        if (editingUserId) {
            await updateUser(editingUserId, { name, email });
            showMessage("Usuario actualizado correctamente");
            editingUserId = null;
            userFormName.value = "";
            userFormEmail.value = "";
            setTextContent(userFormSubmitBtn, "Guardar Usuario");
            setTextContent(
                document.getElementById("user-form-title"),
                "Registrar Nuevo Usuario",
            );
        } else {
            await createUser({ name, email });
            showMessage("Usuario registrado correctamente");
            userForm.reset();
        }
        loadUsers();
    } catch (error) {
        showErrorMessage(error.message);
    }
});

function handleEditUser(user) {
    editingUserId = user.id;
    userFormName.value = user.name;
    userFormEmail.value = user.email || "";
    setTextContent(userFormSubmitBtn, "Actualizar Usuario");
    setTextContent(
        document.getElementById("user-form-title"),
        "Actualizar Usuario",
    );
    userForm.scrollIntoView({ behavior: "smooth", block: "center" });
    userFormName.focus();
}

async function handleDeleteUser(userId) {
    try {
        await deleteUser(userId);
        showMessage("Usuario eliminado correctamente");
        loadUsers();
    } catch (error) {
        showErrorMessage(error.message);
    }
}

// ============================================
// VISTA ADMIN - CARGAR TODAS LAS TAREAS
// ============================================
async function loadAdminTasks() {
    try {
        adminAllTasks = await getAllTasksWithUsers();
        const tasksArray = Array.isArray(adminAllTasks) ? adminAllTasks : [];
        adminTaskCount.textContent = `${tasksArray.length} Tareas`;

        const usersSet = {};
        tasksArray.forEach((task) => {
            (task.assignedUsers || []).forEach((u) => {
                usersSet[u.id] = u;
            });
        });
        const uniqueUsers = Object.values(usersSet);

        adminFilterUser.innerHTML =
            '<option value="todos">Todos los usuarios</option>';
        uniqueUsers.forEach((u) => {
            const opt = document.createElement("option");
            opt.value = u.id;
            opt.textContent = u.name;
            adminFilterUser.appendChild(opt);
        });

        renderAdminTasks(tasksArray, adminTasksContainer);
    } catch (error) {
        showErrorMessage(error.message);
    }
}

function renderFilteredAdminTasks() {
    const statusVal = adminFilterStatus.value;
    const userVal = adminFilterUser.value;
    const filtered = filterAdminTasks(adminAllTasks, statusVal, userVal);
    adminTaskCount.textContent = `${filtered.length} Tareas`;
    renderAdminTasks(filtered, adminTasksContainer);
}

adminFilterStatus.addEventListener("change", renderFilteredAdminTasks);
adminFilterUser.addEventListener("change", renderFilteredAdminTasks);

// ============================================
// VISTA TAREAS - CARGAR TODAS LAS TAREAS
// ============================================
async function loadAllTasks() {
    try {
        allTasks = await getAllTasksWithUsers();
        const tasksArray = Array.isArray(allTasks) ? allTasks : [];
        taskCount.textContent = `${tasksArray.length} Tareas`;
        userTasksSection.style.display = "";

        if (tasksArray.length > 0) {
            renderFilteredTasks(allTasks);
        } else {
            clearTasks();
            showEmptyTasks();
        }
    } catch (error) {
        showErrorMessage(error.message);
    }
}

// ============================================
// EVENTO BUSCAR USUARIO
// ============================================
btnSearch.addEventListener("click", async () => {
    const documentValue = userDocInput.value.trim();

    setTextContent(searchError, "");

    if (!isValidInput(documentValue)) {
        setTextContent(searchError, "Debe ingresar un documento");
        showErrorMessage("Debe ingresar un documento");
        return;
    }

    try {
        clearTasks();
        const { user, tasks } = await searchUser(documentValue);
        setCurrentUser(user);
        showUserInfo(user);
        toggleTaskForm(false);
        userTasksSection.style.display = "";
        showMessage("Usuario encontrado correctamente");

        allTasks = tasks;
        if (allTasks.length > 0) {
            renderFilteredTasks(allTasks);
        } else {
            clearTasks();
            showEmptyTasks();
        }
    } catch (error) {
        toggleTaskForm(true);
        setInnerHtml(
            userInfoDisplay,
            `
            <div class="message-card__content">❌ ${error.message}</div>
        `,
        );
        showErrorMessage(error.message);
        loadAllTasks();
        console.error(error);
    }
});

// ============================================
// EVENTO CREAR O ACTUALIZAR TAREA
// ============================================
taskForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = taskTitle.value.trim();
    const description = taskDesc.value.trim();
    const status = taskStatus.value;
    const editingId = getEditingTaskId();

    setTextContent(titleError, "");
    setTextContent(descError, "");
    setTextContent(statusError, "");
    setTextContent(usersError, "");

    if (!isValidInput(title)) {
        setTextContent(titleError, "Debe ingresar un título");
        showErrorMessage("Debe ingresar un título");
        return;
    }

    if (!isValidInput(description)) {
        setTextContent(descError, "Debe ingresar una descripción");
        showErrorMessage("Debe ingresar una descripción");
        return;
    }

    if (!isValidInput(status)) {
        setTextContent(statusError, "Debe seleccionar un estado");
        showErrorMessage("Debe seleccionar un estado");
        return;
    }

    const selectedUserIds = getSelectedUserIds();

    if (!selectedUserIds.length) {
        setTextContent(usersError, "Debe seleccionar al menos un usuario");
        showErrorMessage("Debe seleccionar al menos un usuario");
        return;
    }

    try {
        if (editingId) {
            const taskEdit = await updateTaskWithAssignments(editingId, {
                userIds: selectedUserIds,
                title,
                description,
                status,
            });

            setEditingTaskId(null);
            taskForm.reset();
            clearSelectedUsers();
            setTextContent(
                taskForm.querySelector('button[type="submit"]'),
                "Guardar Tarea",
            );
            showMessage("Tarea actualizada correctamente");
            await loadAllTasks();
        } else {
            await createTaskWithAssignments({
                userIds: selectedUserIds,
                title,
                description,
                status,
            });

            taskForm.reset();
            clearSelectedUsers();
            showMessage("Tarea registrada correctamente");
            await loadAllTasks();
        }
    } catch (error) {
        showErrorMessage(error.message);
    }
});

// ============================================
// EVENTO EDITAR TAREA
// ============================================
tasksTable.addEventListener("click", async (event) => {
    const btnUpdate = event.target.closest(".btnUpdate");
    if (!btnUpdate) return;

    event.preventDefault();

    const taskId = btnUpdate.getAttribute("data-id");
    const currentCard = btnUpdate.closest(".message-card");
    if (!currentCard) return;

    const currentTitleText = setTextContent(
        currentCard.querySelector(".message-card__username"),
    ).trim();
    const currentDescText = setTextContent(
        currentCard.querySelector(".message-card__content"),
    ).trim();

    taskTitle.value = currentTitleText;
    taskDesc.value = currentDescText;
    taskStatus.value = "";

    setEditingTaskId(taskId);

    try {
        const users = await assignmentsApi.getByTaskId(taskId);
        setSelectedUsers(users);
    } catch {}

    const submitBtn = taskForm.querySelector('button[type="submit"]');
    setTextContent(submitBtn, "Actualizar Tarea");

    taskForm.scrollIntoView({ behavior: "smooth", block: "center" });
    taskTitle.focus();
});

// ============================================
// EVENTO ELIMINAR TAREA
// ============================================
tasksTable.addEventListener("click", async (event) => {
    const btnDelete = event.target.closest(".btnDelete");
    if (!btnDelete) return;

    event.preventDefault();
    const taskId = btnDelete.getAttribute("data-id");

    try {
        await deleteTask(taskId);
        showMessage("Tarea eliminada correctamente");
        await loadAllTasks();
    } catch (error) {
        showErrorMessage(error.message);
    }
});

// ============================================
// EVENTO COMPLETAR TAREA
// ============================================
tasksTable.addEventListener("click", async (event) => {
    const btnComplete = event.target.closest(".btnComplete");
    if (!btnComplete) return;

    event.preventDefault();
    const taskId = btnComplete.getAttribute("data-id");

    try {
        await updateTask(taskId, { status: "completada" });
        showMessage("Tarea marcada como completada");
        await loadAllTasks();
    } catch (error) {
        showErrorMessage(error.message);
    }
});

// ============================================
// FILTROS EN TIEMPO REAL
// ============================================
filterTitle.addEventListener("input", () => renderFilteredTasks(allTasks));
filterStatus.addEventListener("change", () => renderFilteredTasks(allTasks));

// ============================================
// EVENTO ORDENAR TAREAS
// ============================================
document.addEventListener("change", (event) => {
    const orderSelect = event.target.closest("#status-order");
    if (!orderSelect) return;

    const criteria = orderSelect.value || "date";

    const tasks = extractTasksFromDOM();
    if (!tasks.length) return;

    const sorted = sortTasks(tasks, criteria);

    sorted.forEach((task) => {
        tasksTable.appendChild(task.element);
    });
});

// ============================================
// EVENTO EXPORTAR TAREAS
// ============================================
btnExport.addEventListener("click", handleExportTasks);

// ============================================
// CARGAR VISTA INICIAL
// ============================================
loadUsers();
