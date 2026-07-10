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
    renderAdminTable,
    deleteUser,
    getIsAdmin,
    setIsAdmin,
} from "./src/index.js";

const adminSection = document.getElementById("admin-section");

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
        showUserInfo(user);
        showMessage(`Bienvenido de nuevo, ${user.name}`);
        return true;
    }
    return false;
}

async function loadAdminPanel() {
    if (getIsAdmin()) {
        try {
            const users = await loadUsers();
            renderAdminTable(users);
            adminSection.classList.remove("hidden");
        } catch (error) {
            showErrorMessage("Error al cargar panel de administración");
        }
    }
}

function showAppContent() {
    document.querySelectorAll(".form-section:not(#login-section)").forEach((el) => el.classList.remove("hidden"));
    document.querySelector(".messages-section").classList.remove("hidden");
}

function hideAppContent() {
    document.querySelectorAll(".form-section:not(#login-section)").forEach((el) => el.classList.add("hidden"));
    document.querySelector(".messages-section").classList.add("hidden");
}

// ============================================
// EVENTO ELIMINAR USUARIO (ADMIN)
// ============================================
document.getElementById("admin-table-body").addEventListener("click", async (e) => {
    const deleteBtn = e.target.closest(".btn--delete");
    if (!deleteBtn) return;

    const tr = deleteBtn.closest("tr");
    const userId = tr.dataset.id;

    try {
        await deleteUser(userId);
        tr.remove();
        showMessage("Usuario eliminado correctamente");
    } catch (error) {
        showErrorMessage(error.message);
    }
});

if (restoreSession()) {
    showAppContent();
    toggleTaskForm(false);
    loadAdminPanel();
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
        showAppContent();
        toggleTaskForm(false);
        showMessage(`Bienvenido, ${user.name}`);
        loadAdminPanel();
    } catch (error) {
        setTextContent(loginError, error.message);
        showErrorMessage(error.message);
    }
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
