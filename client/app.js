import {
    btnSearch,
    userDocInput,
    searchError,
    userInfoDisplay,
    taskForm,
    taskTitle,
    titleError,
    taskDesc,
    descError,
    taskStatus,
    statusError,
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
    updateTask,
    deleteTask,
    filterTasksList,
    renderFilteredTasks,
    isValidInput,
    getStatusLabel,
    setTextContent,
    setInnerHtml,
    handleError,
    tasksOrderBar,
    sortTasks,
    extractTasksFromDOM,
    loginEmail,
    loginError,
    btnLogin,
    loginSection,
    login,
    isAuthenticated,
    setAuthToken,
    setAuthUser,
    logout,
    loadUsers,
    deleteUser,
    updateUser,
    renderAdminTable,
    renderUserMultiSelect,
    getUserTasks,
    getIsAdmin,
    setIsAdmin,
    toggleUserSelection,
    selectAllUsers,
    clearUserSelection,
    getSelectedUserIds,
    validateUserSelection,
} from "./src/index.js";

const adminSection = document.getElementById("admin-section");
const searchUserSection = document.getElementById("search-user-section");

// ============================================
// VISTAS POR ROL
// ============================================
function renderRoleViews() {
    const isAdmin = getIsAdmin();

    if (isAdmin) {
        document.querySelectorAll(".form-section:not(#login-section)").forEach((el) => el.classList.remove("hidden"));
        document.querySelector(".messages-section").classList.remove("hidden");
        adminSection.classList.remove("hidden");
    } else {
        if (searchUserSection) searchUserSection.classList.add("hidden");
        document.querySelectorAll(".form-section:not(#login-section):not(#search-user-section)").forEach((el) => el.classList.remove("hidden"));
        document.querySelector(".messages-section").classList.remove("hidden");
        adminSection.classList.add("hidden");
    }
}

function hideAppContent() {
    document.querySelectorAll(".form-section:not(#login-section)").forEach((el) => el.classList.add("hidden"));
    document.querySelector(".messages-section").classList.add("hidden");
    if (adminSection) adminSection.classList.add("hidden");
}

async function loadAdminPanel() {
    if (getIsAdmin()) {
        try {
            showUserInfo(getCurrentUser());
            const users = await loadUsers();
            renderAdminTable(users);
            renderUserMultiSelect(users);
            adminSection.classList.remove("hidden");
        } catch (error) {
            showErrorMessage("Error al cargar panel de administración");
        }
    }
}

async function loadUserOwnTasks() {
    try {
        const user = getCurrentUser();
        clearTasks();
        showUserInfo(user);
        toggleTaskForm(false);
        const tasks = await getUserTasks(user.id);
        allTasks = tasks;
        if (allTasks.length > 0) {
            renderFilteredTasks(allTasks);
        } else {
            showEmptyTasks();
        }
    } catch (error) {
        showErrorMessage("Error al cargar tus tareas");
    }
}

function restoreSession() {
    const savedToken = localStorage.getItem("authToken");
    const savedUser = localStorage.getItem("authUser");
    if (savedToken && savedUser) {
        setAuthToken(savedToken);
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        if (user.role === "admin") {
            setIsAdmin(true);
        }
        loginSection.classList.add("hidden");
        document.getElementById("btn-logout").style.display = "block";
        showUserInfo(user);
        showMessage(`Bienvenido de nuevo, ${user.name}`);
        return true;
    }
    return false;
}

if (restoreSession()) {
    renderRoleViews();
    toggleTaskForm(false);
    if (getIsAdmin()) {
        loadAdminPanel();
    } else {
        loadUserOwnTasks();
    }
} else {
    hideAppContent();
}

let allTasks = [];

// ============================================
// EVENTO INICIAR SESIÓN
// ============================================
btnLogin.addEventListener("click", async () => {
    const email = loginEmail.value.trim();

    setTextContent(loginError, "");

    if (!isValidInput(email)) {
        setTextContent(loginError, "Debe ingresar un correo electrónico");
        showErrorMessage("Debe ingresar un correo electrónico");
        return;
    }

    try {
        const user = await login(email);
        loginSection.classList.add("hidden");
        document.getElementById("btn-logout").style.display = "block";
        renderRoleViews();
        toggleTaskForm(false);
        showMessage(`Bienvenido, ${user.name}`);
        if (getIsAdmin()) {
            loadAdminPanel();
        } else {
            loadUserOwnTasks();
        }
    } catch (error) {
        setTextContent(loginError, error.message);
        showErrorMessage(error.message);
    }
});

// ============================================
// EVENTO CERRAR SESIÓN
// ============================================
document.getElementById("btn-logout").addEventListener("click", () => {
    logout();
    document.getElementById("btn-logout").style.display = "none";
    location.reload();
});

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
        clearTasks();
        showEmptyTasks();
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

    try {
        if (editingId) {
            const taskEdit = await updateTask(editingId, {
                title,
                description,
                status,
            });

            const index = allTasks.findIndex((t) => t.id == taskEdit.id);
            if (index !== -1) {
                allTasks[index] = taskEdit;
            }
            renderFilteredTasks(allTasks);

            setEditingTaskId(null);
            taskForm.reset();
            setTextContent(
                taskForm.querySelector('button[type="submit"]'),
                "Guardar Tarea",
            );
            showMessage("Tarea actualizada correctamente");
        } else {
            const taskSaved = await createTask({
                userId: getCurrentUser().id,
                title,
                description,
                status,
            });

            allTasks.push(taskSaved);
            renderFilteredTasks(allTasks);
            taskForm.reset();
            showMessage("Tarea registrada correctamente");
        }
    } catch (error) {
        showErrorMessage(error.message);
    }
});

// ============================================
// EVENTO EDITAR TAREA
// ============================================
tasksTable.addEventListener("click", (event) => {
    const btnUpdate = event.target.closest(".btnUpdate");
    if (!btnUpdate) return;

    event.preventDefault();

    const taskId = btnUpdate.getAttribute("data-id");
    const currentCard = btnUpdate.closest(".message-card");
    if (!currentCard) return;

    const currentTitleText = setTextContent(
        currentCard.querySelector(".message-card__title"),
    )
        .replace("Tarea: ", "")
        .trim();
    const currentDescText = setTextContent(
        currentCard.querySelector(".message-card__content"),
    ).trim();

    taskTitle.value = currentTitleText;
    taskDesc.value = currentDescText;
    taskStatus.value = "";

    setEditingTaskId(taskId);

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
        allTasks = allTasks.filter((t) => t.id != taskId);
        renderFilteredTasks(allTasks);
        showMessage("Tarea eliminada correctamente");
    } catch (error) {
        showErrorMessage(error.message);
    }
});

// ============================================
// EVENTOS SELECCIÓN MÚLTIPLE DE USUARIOS
// ============================================
document.getElementById("user-multiselect-container").addEventListener("change", (e) => {
    const selectAll = e.target.closest("#multiselect-select-all");
    const userCheck = e.target.closest(".user-check");

    if (selectAll) {
        const checks = document.querySelectorAll(".user-check");
        checks.forEach((cb) => {
            cb.checked = selectAll.checked;
        });
        if (selectAll.checked) {
            const userIds = Array.from(checks).map((cb) => cb.value);
            selectAllUsers(userIds);
        } else {
            clearUserSelection();
        }
        document.getElementById("multiselect-counter").textContent =
            `${getSelectedUserIds().length} seleccionado${getSelectedUserIds().length !== 1 ? "s" : ""}`;
    }

    if (userCheck) {
        toggleUserSelection(userCheck.value);
        const allCheck = document.getElementById("multiselect-select-all");
        if (allCheck) {
            const allChecked = document.querySelectorAll(".user-check:checked").length === document.querySelectorAll(".user-check").length;
            allCheck.checked = allChecked;
        }
        document.getElementById("multiselect-counter").textContent =
            `${getSelectedUserIds().length} seleccionado${getSelectedUserIds().length !== 1 ? "s" : ""}`;
    }
});

document.getElementById("user-multiselect-container").addEventListener("click", (e) => {
    const validateBtn = e.target.closest("#btn-validate-selection");
    if (!validateBtn) return;

    const errorEl = document.getElementById("multiselect-error");
    if (!validateUserSelection()) {
        errorEl.textContent = "Debe seleccionar al menos un usuario";
        errorEl.style.display = "block";
    } else {
        errorEl.style.display = "none";
        showMessage(`${getSelectedUserIds().length} usuario${getSelectedUserIds().length !== 1 ? "s" : ""} seleccionado${getSelectedUserIds().length !== 1 ? "s" : ""} correctamente`);
    }
});

// ============================================
// EVENTOS TABLA ADMIN (ELIMINAR / EDITAR)
// ============================================
document.getElementById("admin-table-body").addEventListener("click", async (e) => {
    const deleteBtn = e.target.closest(".btn--delete");
    if (deleteBtn) {
        const tr = deleteBtn.closest("tr");
        const userId = tr.dataset.id;
        try {
            await deleteUser(userId);
            tr.remove();
            showMessage("Usuario eliminado correctamente");
        } catch (error) {
            showErrorMessage(error.message);
        }
        return;
    }

    const editBtn = e.target.closest(".btn--edit");
    if (editBtn) {
        const tr = editBtn.closest("tr");
        const userId = tr.dataset.id;
        const userName = tr.children[1].textContent;
        const userEmail = tr.children[2].textContent;
        const userStatus = tr.children[3].querySelector(".status-badge").textContent.toLowerCase();

        document.getElementById("edit-user-id").value = userId;
        document.getElementById("edit-user-name").value = userName;
        document.getElementById("edit-user-email").value = userEmail;
        document.getElementById("edit-user-status").value = userStatus === "activo" ? "activo" : "inactivo";
        document.getElementById("edit-user-modal").classList.add("modal--visible");
    }
});

document.getElementById("edit-user-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const userId = document.getElementById("edit-user-id").value;
    const name = document.getElementById("edit-user-name").value.trim();
    const email = document.getElementById("edit-user-email").value.trim();
    const status = document.getElementById("edit-user-status").value;

    if (!name || !email) {
        showErrorMessage("Nombre y email son requeridos");
        return;
    }

    try {
        const updated = await updateUser(userId, { name, email, status });
        const tr = document.querySelector(`#admin-table-body tr[data-id="${userId}"]`);
        if (tr) {
            tr.children[1].textContent = updated.name;
            tr.children[2].textContent = updated.email;
            const badge = tr.children[3].querySelector(".status-badge");
            badge.textContent = updated.status === "activo" ? "Activo" : "Inactivo";
            badge.className = `status-badge ${updated.status === "activo" ? "status-badge--activo" : "status-badge--inactivo"}`;
        }
        document.getElementById("edit-user-modal").classList.remove("modal--visible");
        showMessage("Usuario actualizado correctamente");
    } catch (error) {
        showErrorMessage(error.message);
    }
});

document.getElementById("edit-user-cancel").addEventListener("click", () => {
    document.getElementById("edit-user-modal").classList.remove("modal--visible");
});

document.getElementById("edit-user-modal").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) {
        document.getElementById("edit-user-modal").classList.remove("modal--visible");
    }
});

// ==========================================
// FILTROS EN TIEMPO REAL
// ==========================================
filterTitle.addEventListener("input", () => renderFilteredTasks(allTasks));
filterStatus.addEventListener("change", () => renderFilteredTasks(allTasks));

// ==========================================
// EVENTO ORDENAR TAREAS
// ==========================================
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
